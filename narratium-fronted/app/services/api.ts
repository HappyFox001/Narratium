import { API_BASE_URL, DEV_MODE } from './config';
import { getToken } from './auth';

export interface GameResponse {
  game_id: string;
  narrative: string;
  next_prompts: string[];
  success: boolean;
  message?: string;
}

export interface StreamChunk {
  type: 'start' | 'chunk' | 'progress' | 'complete' | 'error';
  game_id?: string;
  content?: string;
  step?: string;
  next_prompts?: string[];
  success?: boolean;
  message?: string;
}

export type StreamHandler = {
  onStart?: (gameId: string) => void;
  onChunk?: (content: string) => void;
  onProgress?: (step: string) => void;
  onComplete?: (nextPrompts: string[]) => void;
  onError?: (message: string) => void;
};

const getAuthHeaders = () => {
  if (DEV_MODE) {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer dev-token-123'
    };
  }

  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function initializeGame(model: string = "qwen2.5-14b-instruct-1m", language: string = 'zh', type: string = 'openai'): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        model,
        language,
        type
      }),
    });

    if (!response.ok) {
      throw new Error(`初始化游戏失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

export async function setupNewGame(gameId: string, storyFramework: string, characterInfo: string): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/setup`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        game_id: gameId,
        story_framework: storyFramework,
        character_info: characterInfo
      }),
    });

    if (!response.ok) {
      throw new Error(`设置游戏失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

export async function takeAction(gameId: string, userInput: string): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/action`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        game_id: gameId,
        user_input: userInput
      }),
    });

    if (!response.ok) {
      throw new Error(`执行动作失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

export async function getGameStatus(gameId: string): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/status/${gameId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取游戏状态失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

export async function deleteGame(gameId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/game/${gameId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`删除游戏失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 故事相关API
export interface Story {
  id: string;
  title: string;
  description: string | null;
  framework: string;
  visibility: 'public' | 'unlisted' | 'private';
  creator_id: string;
  created_at: string;
  updated_at: string;
  creator_username: string;
}

export interface StoryCreateRequest {
  title: string;
  description?: string;
  framework: string;
  visibility?: 'public' | 'unlisted' | 'private';
}

export interface StoryUpdateRequest {
  title?: string;
  description?: string;
  framework?: string;
  visibility?: 'public' | 'unlisted' | 'private';
}

// 获取用户的故事列表
export async function getUserStories(includePublic: boolean = false): Promise<Story[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories?include_public=${includePublic}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取故事列表失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 获取单个故事详情
export async function getStory(storyId: string): Promise<Story> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取故事详情失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 创建新故事
export async function createStory(storyData: StoryCreateRequest): Promise<Story> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(storyData),
    });

    if (!response.ok) {
      throw new Error(`创建故事失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 更新故事
export async function updateStory(storyId: string, storyData: StoryUpdateRequest): Promise<Story> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(storyData),
    });

    if (!response.ok) {
      throw new Error(`更新故事失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 删除故事
export async function deleteStory(storyId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`删除故事失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 收藏故事
export async function collectStory(storyId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/collect`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`收藏故事失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 取消收藏故事
export async function uncollectStory(storyId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}/collect`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`取消收藏故事失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 获取收藏的故事列表
export async function getCollectedStories(): Promise<Story[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/collected`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取收藏故事列表失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 游戏会话相关API
export interface GameSession {
  id: string;
  story_id: string;
  story_title: string;
  character_info: string;
  created_at: string;
  updated_at: string;
  last_played_at: string;
}

export interface SessionCreateRequest {
  story_id: string;
  character_info: string;
  language?: string;
  model?: string;
}

// 创建游戏会话
export async function createGameSession(sessionData: SessionCreateRequest): Promise<GameSession> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`创建游戏会话失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 获取用户的游戏会话列表
export async function getGameSessions(): Promise<GameSession[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取游戏会话列表失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 获取单个游戏会话详情
export async function getGameSession(sessionId: string): Promise<GameSession> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取游戏会话详情失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 删除游戏会话
export async function deleteGameSession(sessionId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`删除游戏会话失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 设置游戏会话
export async function setupGameSession(sessionId: string): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/setup`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`设置游戏会话失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 在游戏会话中执行动作
export async function takeSessionAction(sessionId: string, userInput: string): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/action`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ user_input: userInput }),
    });

    if (!response.ok) {
      throw new Error(`执行游戏动作失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 获取游戏会话状态
export async function getSessionStatus(sessionId: string): Promise<GameResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/status`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`获取游戏会话状态失败: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 流式处理游戏设置
export async function setupNewGameStream(
  gameId: string,
  storyFramework: string,
  characterInfo: string,
  handlers: StreamHandler
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/setup/stream`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        game_id: gameId,
        story_framework: storyFramework,
        character_info: characterInfo
      }),
    });

    if (!response.ok) {
      throw new Error(`设置游戏失败: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let narrative = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data: StreamChunk = JSON.parse(line);

          switch (data.type) {
            case 'start':
              if (handlers.onStart && data.game_id) handlers.onStart(data.game_id);
              break;
            case 'chunk':
              if (handlers.onChunk && data.content) {
                handlers.onChunk(data.content);
                narrative += data.content;
              }
              break;
            case 'progress':
              if (handlers.onProgress && data.step) handlers.onProgress(data.step);
              break;
            case 'complete':
              if (handlers.onComplete && data.next_prompts) {
                console.log('流式输出完成，完整文本长度:', narrative.length);
                handlers.onComplete(data.next_prompts);
              }
              break;
            case 'error':
              if (handlers.onError && data.message) handlers.onError(data.message);
              break;
          }
        } catch (e) {
          console.error('解析流数据失败:', e, line);
        }
      }
    }
  } catch (error) {
    console.error('流式API调用错误:', error);
    if (handlers.onError) handlers.onError(error instanceof Error ? error.message : String(error));
  }
}

// 流式处理用户动作
export async function takeActionStream(
  gameId: string,
  userInput: string,
  handlers: StreamHandler
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/action/stream`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        game_id: gameId,
        user_input: userInput
      }),
    });

    if (!response.ok) {
      throw new Error(`执行动作失败: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('响应体为空');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let narrative = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        try {
          const data: StreamChunk = JSON.parse(line);

          switch (data.type) {
            case 'start':
              if (handlers.onStart && data.game_id) handlers.onStart(data.game_id);
              break;
            case 'chunk':
              if (handlers.onChunk && data.content) {
                handlers.onChunk(data.content);
                narrative += data.content;
              }
              break;
            case 'complete':
              if (handlers.onComplete && data.next_prompts) {
                console.log('流式输出完成，完整文本长度:', narrative.length);
                handlers.onComplete(data.next_prompts);
              }
              break;
            case 'error':
              if (handlers.onError && data.message) handlers.onError(data.message);
              break;
          }
        } catch (e) {
          console.error('解析流数据失败:', e, line);
        }
      }
    }
  } catch (error) {
    console.error('流式API调用错误:', error);
    if (handlers.onError) handlers.onError(error instanceof Error ? error.message : String(error));
  }
}
