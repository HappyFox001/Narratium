'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '../i18n/config';
import LanguageSwitcher from '../components/LanguageSwitcher';
import {
  initializeGame,
  setupNewGame,
  takeAction,
  deleteGame,
  GameResponse,
  setupNewGameStream,
  takeActionStream,
  StreamHandler
} from '../services/api';
import { DEV_MODE } from '../services/config';
import { useAuth } from '../contexts/AuthContext';
import AuthGuard from '../components/auth/AuthGuard';

type GameState = {
  gameId?: string;
  character?: {
    name: string;
    description: string;
  };
  currentStory?: {
    text: string;
    options: string[];
  };
  history?: {
    text: string;
    isUserChoice: boolean;
  }[];
  isLoading: boolean;
  error?: string;
};

const initialGameState: GameState = {
  isLoading: false,
  history: []
};

export default function PlayPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const storyId = searchParams.get('story');
  const router = useRouter();
  const { user, loading } = useAuth();

  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [userInput, setUserInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [storyFramework, setStoryFramework] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const storyContainerRef = useRef<HTMLDivElement>(null);
  const streamingTextRef = useRef('');

  useEffect(() => {
    if (!loading && !user && !DEV_MODE) {
      router.push('/login?redirect=/play');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (storyContainerRef.current) {
      storyContainerRef.current.scrollTop = storyContainerRef.current.scrollHeight;
    }
  }, [gameState.history]);

  const startGameInitialization = async () => {
    if (isInitializing) return;

    setIsInitializing(true);
    setGameState(prev => ({ ...prev, isLoading: true, error: undefined }));

    try {
      const initResponse = await initializeGame(undefined, language);

      if (!initResponse.success) {
        throw new Error(initResponse.message || '初始化游戏失败');
      }

      console.log('游戏初始化成功:', initResponse);

      const gameId = initResponse.game_id;

      setGameState(prev => ({
        ...prev,
        gameId: gameId,
        isLoading: true
      }));

      setShowCharacterCreation(false);

      setIsStreaming(true);
      setStreamingText('正在生成故事内容...');

      const streamHandlers: StreamHandler = {
        onStart: (gameId) => {
          console.log('开始初始化游戏:', gameId);
        },
        onProgress: (step) => {
          console.log('初始化进度:', step);
          if (step === 'character_created') {
            setStreamingText(prev => prev + '');
          }
        },
        onChunk: (content) => {
          setStreamingText(prev => {
            const newText = prev + content;
            streamingTextRef.current = newText; // 更新ref
            return newText;
          });
        },
        onComplete: (nextPrompts) => {
          setIsStreaming(false);
          const finalStoryText = streamingTextRef.current; // 使用ref的值

          setGameState(prev => ({
            ...prev,
            gameId: gameId,
            currentStory: {
              text: finalStoryText,
              options: nextPrompts
            },
            history: [
              ...(prev.history || []),
              {
                text: finalStoryText,
                isUserChoice: false
              }
            ],
            isLoading: false
          }));
          setIsInitializing(false);
          console.log('故事初始化完成:', {
            gameId,
            storyText: finalStoryText,
            options: nextPrompts
          });
        },
        onError: (message) => {
          setIsStreaming(false);
          setGameState(prev => ({
            ...prev,
            gameId: gameId,
            error: message,
            isLoading: false
          }));
          setIsInitializing(false);

          console.error('开发模式详细错误信息:', {
            error: message,
            state: '设置游戏失败',
            gameId: gameId,
            characterInfo: `角色名称: ${characterName}\n角色描述: ${characterDescription}`
          });
        }
      };

      const framework = storyId
        ? `这是一个基于故事ID ${storyId} 的冒险`
        : storyFramework || '这是一个开放世界的奇幻冒险，玩家可以自由探索并与世界互动。';

      await setupNewGameStream(
        gameId,
        framework,
        `角色名称: ${characterName}\n角色描述: ${characterDescription}`,
        streamHandlers
      );
    } catch (error) {
      console.error('初始化游戏出错:', error);

      // 增强错误处理
      let errorMessage = '初始化游戏时发生未知错误';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      setGameState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));

      console.error('开发模式详细错误信息:', {
        error,
        state: '设置游戏失败',
        characterInfo: `角色名称: ${characterName}\n角色描述: ${characterDescription}`
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const submitAction = async (action: string) => {
    if (gameState.isLoading || !gameState.gameId) return;

    setGameState(prev => ({ ...prev, isLoading: true }));

    // 立即将用户输入添加到历史记录中
    setGameState(prev => ({
      ...prev,
      history: [
        ...(prev.history || []),
        {
          text: action,
          isUserChoice: true
        }
      ]
    }));

    setUserInput('');

    try {
      setIsStreaming(true);
      setStreamingText('');

      const streamHandlers: StreamHandler = {
        onStart: (gameId) => {
          console.log('开始处理动作:', gameId);
        },
        onChunk: (content) => {
          setStreamingText(prev => {
            const newText = prev + content;
            streamingTextRef.current = newText;
            return newText;
          });
        },
        onComplete: (nextPrompts) => {
          setIsStreaming(false);
          const finalStoryText = streamingTextRef.current;

          setGameState(prev => ({
            ...prev,
            currentStory: {
              text: finalStoryText,
              options: nextPrompts
            },
            history: [
              ...(prev.history || []),
              {
                text: finalStoryText,
                isUserChoice: false
              }
            ],
            isLoading: false
          }));

          console.log('动作处理完成:', {
            gameId: gameState.gameId,
            storyText: finalStoryText,
            options: nextPrompts
          });
        },
        onError: (message) => {
          setIsStreaming(false);
          setGameState(prev => ({
            ...prev,
            error: message,
            isLoading: false
          }));

          if (DEV_MODE) {
            console.error('开发模式详细错误信息:', {
              error: message,
              state: '提交动作失败',
              gameId: gameState.gameId,
              action
            });
          }
        }
      };

      await takeActionStream(gameState.gameId, action, streamHandlers);
    } catch (error) {
      console.error('提交行动出错:', error);

      console.log('流式API失败，尝试使用常规API');
      try {
        const actionResponse = await takeAction(gameState.gameId, action);

        if (!actionResponse.success) {
          throw new Error(actionResponse.message || '执行动作失败');
        }

        setGameState(prev => ({
          ...prev,
          currentStory: {
            text: actionResponse.narrative,
            options: actionResponse.next_prompts
          },
          history: [
            ...(prev.history || []),
            {
              text: actionResponse.narrative,
              isUserChoice: false
            }
          ],
          isLoading: false
        }));
      } catch (actionError) {
        let errorMessage = '提交行动时发生未知错误';
        if (actionError instanceof Error) {
          errorMessage = actionError.message;
        } else if (typeof actionError === 'object' && actionError !== null) {
          errorMessage = JSON.stringify(actionError);
        }

        setGameState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false
        }));

        if (DEV_MODE) {
          console.error('开发模式详细错误信息:', {
            error: actionError,
            state: '提交行动失败',
            gameId: gameState.gameId,
            action,
          });
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      submitAction(userInput.trim());
    }
  };

  const handleOptionClick = (option: string) => {
    submitAction(option);
  };

  const showCharacterCreationForm = () => {
    setShowCharacterCreation(true);
  };

  const startNewGame = () => {
    if (characterName && characterDescription) {
      startGameInitialization();
    } else {
      showCharacterCreationForm();
    }
  };

  const endCurrentGame = async () => {
    if (!gameState.gameId) return;

    try {
      await deleteGame(gameState.gameId);
      setGameState(initialGameState);
      setCharacterName('');
      setCharacterDescription('');
      setStoryFramework('');
    } catch (error) {
      console.error('结束游戏出错:', error);

      let errorMessage = '结束游戏时发生未知错误';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }

      alert(errorMessage);

      if (DEV_MODE) {
        console.error('开发模式详细错误信息:', {
          error,
          state: '结束游戏失败',
          gameId: gameState.gameId,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col">
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t('app.name')}
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/stories" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.stories')}
            </Link>
            <Link href="/play" className="text-white font-medium">
              {t('nav.play')}
            </Link>
            <Link href="/settings" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.settings')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        {!gameState.gameId ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            {showCharacterCreation ? (
              <div className="bg-gray-800/70 p-8 rounded-xl max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">{t('play.character.title')}</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  startGameInitialization();
                }}>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">{t('play.character.name')}</label>
                    <input
                      type="text"
                      value={characterName}
                      onChange={(e) => setCharacterName(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={t('play.character.name')}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-300 mb-2">{t('play.character.description')}</label>
                    <textarea
                      value={characterDescription}
                      onChange={(e) => setCharacterDescription(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                      placeholder={t('play.character.description')}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-300 mb-2">故事背景 (可选)</label>
                    <textarea
                      value={storyFramework}
                      onChange={(e) => setStoryFramework(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                      placeholder="描述你想要的故事背景和世界设定..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowCharacterCreation(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors"
                    >
                      {t('play.character.back')}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
                      disabled={isInitializing}
                    >
                      {isInitializing ? '创建中...' : t('play.character.start')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-6">{t('play.title')}</h1>
                <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                  {t('play.subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={startNewGame}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    {t('play.newAdventure')}
                  </button>
                  {storyId && (
                    <button
                      onClick={showCharacterCreationForm}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all"
                    >
                      {t('play.loadStory')}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-grow flex flex-col h-full max-h-[calc(100vh-200px)]">
            {gameState.character && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6 flex items-center max-w-3xl mx-auto w-full">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold mr-4">
                  {gameState.character.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{gameState.character.name}</h3>
                  <p className="text-gray-300 text-sm">{gameState.character.description}</p>
                </div>
              </div>
            )}

            <div
              ref={storyContainerRef}
              className="flex-grow overflow-y-auto mb-10 pr-2 custom-scrollbar max-w-3xl mx-auto w-full"
              style={{ minHeight: '500px', maxHeight: 'calc(100vh - 300px)' }}
            >
              <div className="whitespace-pre-wrap text-white">
                {gameState.history && gameState.history.map((item, index) => (
                  <div key={index} className={item.isUserChoice ? 'text-green-400 mb-2' : 'text-white mb-4'}>
                    {item.isUserChoice ? `> ${item.text}` : item.text}
                  </div>
                ))}

                {isStreaming && (
                  <div className="text-white">
                    {streamingText}
                    <span className="animate-pulse">▋</span>
                  </div>
                )}
              </div>

              {gameState.error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-4 rounded-lg mb-4 mt-4">
                  {gameState.error}
                </div>
              )}
            </div>
            <div className="max-w-3xl mx-auto w-full mt-auto">
              {gameState.currentStory && gameState.currentStory.options && gameState.currentStory.options.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2 w-full">
                  {gameState.currentStory.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      disabled={gameState.isLoading}
                      className="bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}


              <form onSubmit={handleSubmit} className="mb-6 w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={gameState.isLoading}
                    placeholder={t('play.input.placeholder')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-full px-5 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={gameState.isLoading || !userInput.trim()}
                    className="absolute right-2 top-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .loading-dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
        }
        
        .loading-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #a855f7;
          animation: pulse 1.5s infinite ease-in-out;
        }
        
        .loading-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .loading-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}
