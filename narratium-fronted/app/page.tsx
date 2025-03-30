'use client';

import Link from "next/link";
import { useLanguage } from "./i18n/config";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useAuth } from "./contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { t, language } = useLanguage();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showLoginToast, setShowLoginToast] = useState(false);

  const titleFontClass = language === 'zh' ? 'font-cn-serif' : 'font-[family-name:var(--font-playfair)]';
  const textFontClass = language === 'zh' ? 'font-cn-sans' : 'font-[family-name:var(--font-inter)]';
  const buttonFontClass = language === 'zh' ? 'font-cn-sans' : 'font-[family-name:var(--font-raleway)]';

  const handleStoriesClick = (e: React.MouseEvent) => {
    if (!user && !loading) {
      e.preventDefault();
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3000);
      router.push('/login?redirect=/stories');
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="w-full flex justify-between items-center">
        <div className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ${titleFontClass}`}>
          {t('app.name')}
        </div>
        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.display_name || user.username}&background=random`}
                  alt={user.display_name || user.username}
                  className="w-8 h-8 rounded-full"
                />
                <Link
                  href="/stories"
                  className={`text-sm text-white hover:text-purple-300 transition-colors ${textFontClass}`}
                >
                  {t('nav.stories')}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={`text-sm text-white hover:text-purple-300 transition-colors ${textFontClass}`}
                >
                  {t('nav.login')}
                </Link>
              </div>
            )
          )}
          <LanguageSwitcher />
        </div>
      </header>

      <main className="flex flex-col gap-[32px] items-center max-w-4xl text-center animate-fade-in">
        <div className="animate-pulse">
          <h1 className={`text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-4 ${titleFontClass}`}>
            {t('app.name')}
          </h1>
        </div>
        <p className={`text-xl md:text-2xl text-gray-300 mb-8 ${textFontClass}`}>
          {t('home.subtitle')}
        </p>

        <div className="flex gap-6 items-center flex-col sm:flex-row">
          {user ? (
            <Link
              href="/stories"
              className={`rounded-full border-2 border-solid border-purple-500 transition-all flex items-center justify-center bg-purple-600 text-white gap-2 hover:bg-purple-700 hover:scale-105 font-bold text-lg sm:text-xl h-14 sm:h-16 px-8 sm:px-10 w-64 sm:w-auto shadow-lg shadow-purple-500/20 ${buttonFontClass}`}
            >
              {t('home.exploreButton')}
            </Link>
          ) : (
            <Link
              href="/login"
              className={`rounded-full border-2 border-solid border-purple-500 transition-all flex items-center justify-center bg-purple-600 text-white gap-2 hover:bg-purple-700 hover:scale-105 font-bold text-lg sm:text-xl h-14 sm:h-16 px-8 sm:px-10 w-64 sm:w-auto shadow-lg shadow-purple-500/20 ${buttonFontClass}`}
            >
              {t('home.loginButton') || '登录/注册'}
            </Link>
          )}
        </div>

        {showLoginToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <span>{language === 'zh' ? '请先登录以访问故事库' : 'Please login to access stories'}</span>
            </div>
          </div>
        )}

        <div className="mt-16 p-6 bg-gray-800/50 rounded-xl border border-gray-700 max-w-2xl card animate-slide-up">
          <h2 className={`text-2xl font-bold mb-4 text-pink-400 ${titleFontClass}`}>{t('home.yourStory')}</h2>
          <p className={`text-gray-300 mb-6 ${textFontClass}`}>
            {t('home.narratiumDescription')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className={`font-bold text-purple-400 ${titleFontClass}`}>{t('home.infinitePossibilities')}</h3>
              <p className={`text-sm text-gray-400 ${textFontClass}`}>{t('home.uniqueStories')}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className={`font-bold text-purple-400 ${titleFontClass}`}>{t('home.freeExploration')}</h3>
              <p className={`text-sm text-gray-400 ${textFontClass}`}>{t('home.imaginationGuided')}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className={`font-bold text-purple-400 ${titleFontClass}`}>{t('home.intelligentNarrative')}</h3>
              <p className={`text-sm text-gray-400 ${textFontClass}`}>{t('home.aiGenerated')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-800/30 rounded-xl border border-gray-700 max-w-2xl card animate-slide-up">
          <h2 className={`text-2xl font-bold mb-4 text-purple-400 ${titleFontClass}`}>{t('home.knowledgeGraph')}</h2>
          <p className={`text-gray-300 mb-6 ${textFontClass}`}>
            {t('home.graphRAGDescription')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className={`font-bold text-purple-400 ${titleFontClass}`}>{t('home.graphRetrieval')}</h3>
              <p className={`text-sm text-gray-400 ${textFontClass}`}>{t('home.intelligentContext')}</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors">
              <h3 className={`font-bold text-purple-400 ${titleFontClass}`}>{t('home.worldBuilding')}</h3>
              <p className={`text-sm text-gray-400 ${textFontClass}`}>{t('home.coherentWorlds')}</p>
            </div>
          </div>
        </div>
      </main>

      <footer className={`w-full flex gap-[24px] flex-wrap items-center justify-center text-gray-400 py-4 ${textFontClass}`}>
        <span>{t('footer.copyright')}</span>
        <span>|</span>
        <Link
          className="hover:text-purple-400 transition-colors"
          href="#"
        >
          {t('footer.about')}
        </Link>
        <span>|</span>
        <Link
          className="hover:text-purple-400 transition-colors"
          href="#"
        >
          {t('footer.terms')}
        </Link>
        <span>|</span>
        <Link
          className="hover:text-purple-400 transition-colors"
          href="#"
        >
          {t('footer.privacy')}
        </Link>
      </footer>
    </div>
  );
}
