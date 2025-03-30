'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../i18n/config';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DEV_MODE } from '../services/config';

const MOCK_STORIES = [
  {
    id: '1',
    title: '失落的魔法王国',
    description: '一个古老的魔法王国被遗忘在时间的长河中，直到一位年轻的冒险家发现了通往它的秘密通道...',
    tags: ['奇幻', '冒险', '魔法'],
    author: '阿德',
    date: '2025-03-25',
    likes: 128,
    imageUrl: '/stories/fantasy1.jpg'
  },
  {
    id: '2',
    title: '星际迷航：未知边界',
    description: '人类首次跨越星系的探索任务面临着前所未有的挑战，当他们遇到一个神秘的外星文明...',
    tags: ['科幻', '太空', '探索'],
    author: '星际旅人',
    date: '2025-03-22',
    likes: 95,
    imageUrl: '/stories/scifi1.jpg'
  },
  {
    id: '3',
    title: '古城密探',
    description: '一位考古学家在一座古老城市的废墟中发现了一个可能改变人类历史认知的秘密...',
    tags: ['历史', '悬疑', '探险'],
    author: '历史学者',
    date: '2025-03-20',
    likes: 76,
    imageUrl: '/stories/mystery1.jpg'
  },
  {
    id: '4',
    title: '未来都市：赛博朋克2099',
    description: '在一个被巨型企业控制的未来都市，一名黑客发现了一个可能推翻整个系统的秘密...',
    tags: ['赛博朋克', '反乌托邦', '科技'],
    author: '数字幽灵',
    date: '2025-03-18',
    likes: 112,
    imageUrl: '/stories/cyberpunk1.jpg'
  },
  {
    id: '5',
    title: '海洋深处的秘密',
    description: '一支海洋探险队在深海发现了一个不应该存在的古代文明遗迹...',
    tags: ['海洋', '探险', '神秘'],
    author: '深海探险家',
    date: '2025-03-15',
    likes: 89,
    imageUrl: '/stories/ocean1.jpg'
  },
  {
    id: '6',
    title: '幽灵城堡',
    description: '一个古老的城堡中隐藏着几个世纪以来的秘密，当一位年轻的继承人搬入后，奇怪的事情开始发生...',
    tags: ['恐怖', '超自然', '悬疑'],
    author: '暗影作家',
    date: '2025-03-12',
    likes: 67,
    imageUrl: '/stories/horror1.jpg'
  },
];

const EN_MOCK_STORIES = [
  {
    id: '1',
    title: 'The Lost Magic Kingdom',
    description: 'An ancient magical kingdom forgotten in the river of time, until a young adventurer discovers a secret passage leading to it...',
    tags: ['Fantasy', 'Adventure', 'Magic'],
    author: 'Adrian',
    date: '2025-03-25',
    likes: 128,
    imageUrl: '/stories/fantasy1.jpg'
  },
  {
    id: '2',
    title: 'Star Trek: Unknown Frontier',
    description: 'Humanity\'s first cross-galactic exploration mission faces unprecedented challenges when they encounter a mysterious alien civilization...',
    tags: ['Sci-Fi', 'Space', 'Exploration'],
    author: 'Star Traveler',
    date: '2025-03-22',
    likes: 95,
    imageUrl: '/stories/scifi1.jpg'
  },
  {
    id: '3',
    title: 'Ancient City Detective',
    description: 'An archaeologist discovers a secret in the ruins of an ancient city that could change human understanding of history...',
    tags: ['Historical', 'Mystery', 'Adventure'],
    author: 'History Scholar',
    date: '2025-03-20',
    likes: 76,
    imageUrl: '/stories/mystery1.jpg'
  },
  {
    id: '4',
    title: 'Future City: Cyberpunk 2099',
    description: 'In a future city controlled by mega-corporations, a hacker discovers a secret that could overthrow the entire system...',
    tags: ['Cyberpunk', 'Dystopian', 'Technology'],
    author: 'Digital Ghost',
    date: '2025-03-18',
    likes: 112,
    imageUrl: '/stories/cyberpunk1.jpg'
  },
  {
    id: '5',
    title: 'Secrets of the Deep Ocean',
    description: 'A marine exploration team discovers the remnants of an ancient civilization in the deep sea that shouldn\'t exist...',
    tags: ['Ocean', 'Exploration', 'Mystery'],
    author: 'Deep Sea Explorer',
    date: '2025-03-15',
    likes: 89,
    imageUrl: '/stories/ocean1.jpg'
  },
  {
    id: '6',
    title: 'Ghost Castle',
    description: 'An old castle hides secrets from centuries ago, and when a young heir moves in, strange things begin to happen...',
    tags: ['Horror', 'Supernatural', 'Mystery'],
    author: 'Shadow Writer',
    date: '2025-03-12',
    likes: 67,
    imageUrl: '/stories/horror1.jpg'
  },
];

const StoryCard = ({ story }: { story: any }) => (
  <div className="bg-gray-800 rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10">
    <div className="h-48 relative bg-gray-700">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
        <span className="text-2xl font-bold text-white">{story.title.charAt(0)}</span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{story.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {story.tags.map((tag: string) => (
          <span key={tag} className="px-2 py-1 bg-gray-700 rounded-full text-xs text-purple-300">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <span>{story.author}</span>
          <span className="mx-2">•</span>
          <span>{new Date(story.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-pink-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          <span>{story.likes}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function StoriesPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredStories, setFilteredStories] = useState<any[]>([]);
  const { user, loading } = useAuth();
  const router = useRouter();

  // 检查用户是否已登录，如果未登录则重定向到登录页面
  useEffect(() => {
    if (!loading && !user && !DEV_MODE) {
      router.push('/login?redirect=/stories');
    }
  }, [user, loading, router]);

  const stories = language === 'zh' ? MOCK_STORIES : EN_MOCK_STORIES;

  const allTags = Array.from(new Set(stories.flatMap(story => story.tags)));

  useEffect(() => {
    setFilteredStories(stories);
  }, [language]);

  useEffect(() => {
    let result = stories;

    if (searchTerm) {
      result = result.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter(story =>
        selectedTags.every(tag => story.tags.includes(tag))
      );
    }

    setFilteredStories(result);
  }, [searchTerm, selectedTags, language]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            {t('app.name')}
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/stories" className="text-white font-medium">
              {t('nav.stories')}
            </Link>
            <Link href="/play" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.play')}
            </Link>
            <Link href="/settings" className="text-gray-300 hover:text-white transition-colors">
              {t('nav.settings')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('stories.title')}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            {t('stories.subtitle')}
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('stories.search')}
                  className="w-full bg-gray-800 border border-gray-700 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-4 top-3 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <select
                className="bg-gray-800 border border-gray-700 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white appearance-none"
              >
                <option value="recent">{t('stories.filter.recent')}</option>
                <option value="popular">{t('stories.filter.popular')}</option>
                <option value="trending">{t('stories.filter.trending')}</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map(story => (
              <Link key={story.id} href={`/play?story=${story.id}`}>
                <StoryCard story={story} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">{t('stories.noResults')}</h3>
            <p className="text-gray-400">{t('stories.noResultsDesc')}</p>
          </div>
        )}
      </main>

      <footer className="bg-gray-800/30 border-t border-gray-800 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="hover:text-purple-400 transition-colors">{t('footer.about')}</a>
            <span>|</span>
            <a href="#" className="hover:text-purple-400 transition-colors">{t('footer.terms')}</a>
            <span>|</span>
            <a href="#" className="hover:text-purple-400 transition-colors">{t('footer.privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
