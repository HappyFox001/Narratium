import { Language } from './config';

export type TranslationKey =
  | 'app.name'
  | 'home.title'
  | 'home.subtitle'
  | 'home.startButton'
  | 'home.exploreButton'
  | 'home.yourStory'
  | 'home.narratiumDescription'
  | 'home.infinitePossibilities'
  | 'home.uniqueStories'
  | 'home.freeExploration'
  | 'home.imaginationGuided'
  | 'home.intelligentNarrative'
  | 'home.aiGenerated'
  | 'home.knowledgeGraph'
  | 'home.graphRAGDescription'
  | 'home.graphRetrieval'
  | 'home.intelligentContext'
  | 'home.worldBuilding'
  | 'home.coherentWorlds'
  | 'home.loginButton'
  | 'home.dashboardButton'
  | 'nav.home'
  | 'nav.stories'
  | 'nav.play'
  | 'nav.login'
  | 'nav.dashboard'
  | 'nav.logout'
  | 'nav.settings'
  | 'stories.title'
  | 'stories.subtitle'
  | 'stories.search'
  | 'stories.filter.recent'
  | 'stories.filter.popular'
  | 'stories.filter.trending'
  | 'stories.noResults'
  | 'stories.noResultsDesc'
  | 'stories.createNew'
  | 'play.title'
  | 'play.subtitle'
  | 'play.newAdventure'
  | 'play.loadStory'
  | 'play.character.title'
  | 'play.character.name'
  | 'play.character.description'
  | 'play.character.back'
  | 'play.character.start'
  | 'play.input.placeholder'
  | 'play.endGame'
  | 'settings.title'
  | 'settings.subtitle'
  | 'settings.apiConfig'
  | 'settings.baseUrl'
  | 'settings.apiKey'
  | 'settings.save'
  | 'settings.reset'
  | 'settings.saveSuccess'
  | 'settings.saveError'
  | 'footer.copyright'
  | 'footer.about'
  | 'footer.terms'
  | 'footer.privacy';

const translations: Record<Language, Record<TranslationKey, string>> = {
  zh: {
    'app.name': '叙事之境',
    'home.title': '无限文本冒险',
    'home.subtitle': '探索AI驱动的故事世界，每一个选择都将塑造你独特的冒险',
    'home.startButton': '开始冒险',
    'home.exploreButton': '探索故事',
    'home.loginButton': '登录/注册',
    'home.dashboardButton': '我的仪表板',
    'home.yourStory': '你的故事，无限可能',
    'home.narratiumDescription': 'Narratium是一个由AI驱动的文本冒险平台，让你在无限可能的故事世界中探索。每一个选择都将引领你走向不同的故事线，创造属于你自己的独特冒险。',
    'home.infinitePossibilities': '无限可能',
    'home.uniqueStories': '每个故事都是独一无二的，根据你的选择而展开',
    'home.freeExploration': '自由探索',
    'home.imaginationGuided': '由你的想象力引导，没有固定的剧情路线',
    'home.intelligentNarrative': '智能叙事',
    'home.aiGenerated': 'AI生成的故事内容，根据你的行动实时调整',
    'home.knowledgeGraph': '知识图谱增强',
    'home.graphRAGDescription': '我们的 GraphRAG 技术确保故事世界的一致性和丰富性，创造更加沉浸式的体验',
    'home.graphRetrieval': '图谱检索',
    'home.intelligentContext': '智能上下文管理，保持故事的连贯性',
    'home.worldBuilding': '世界构建',
    'home.coherentWorlds': '创造连贯且丰富的故事世界',
    'nav.home': '首页',
    'nav.stories': '故事',
    'nav.play': '游戏',
    'nav.login': '登录',
    'nav.dashboard': '仪表板',
    'nav.logout': '登出',
    'nav.settings': '设置',
    'stories.title': '探索故事',
    'stories.subtitle': '发现由社区创建的精彩故事',
    'stories.search': '搜索故事...',
    'stories.filter.recent': '最新',
    'stories.filter.popular': '最热',
    'stories.filter.trending': '趋势',
    'stories.noResults': '没有找到故事',
    'stories.noResultsDesc': '尝试使用不同的搜索词或浏览所有故事',
    'stories.createNew': '创建新故事',
    'play.title': '开始冒险',
    'play.subtitle': '选择一个故事开始你的冒险',
    'play.newAdventure': '新的冒险',
    'play.loadStory': '加载故事',
    'play.character.title': '创建你的角色',
    'play.character.name': '角色名称',
    'play.character.description': '角色描述',
    'play.character.back': '返回',
    'play.character.start': '开始游戏',
    'play.input.placeholder': '你想做什么？',
    'play.endGame': '结束游戏',
    'settings.title': '系统设置',
    'settings.subtitle': '配置API连接和其他系统设置',
    'settings.apiConfig': 'API配置',
    'settings.baseUrl': 'API基础URL',
    'settings.apiKey': 'API密钥',
    'settings.save': '保存设置',
    'settings.reset': '重置',
    'settings.saveSuccess': '设置已保存',
    'settings.saveError': '保存设置时出错',
    'footer.copyright': ' 2025 Narratium. 保留所有权利。',
    'footer.about': '关于我们',
    'footer.terms': '服务条款',
    'footer.privacy': '隐私政策'
  },
  en: {
    'app.name': 'Narratium',
    'home.title': 'Infinite Text Adventures',
    'home.subtitle': 'Explore AI-driven story worlds where every choice shapes your unique adventure',
    'home.startButton': 'Start Adventure',
    'home.exploreButton': 'Explore Stories',
    'home.loginButton': 'Login/Register',
    'home.dashboardButton': 'My Dashboard',
    'home.yourStory': 'Your Story, Infinite Possibilities',
    'home.narratiumDescription': 'Narratium is an AI-powered text adventure platform that lets you explore infinite story worlds. Every choice leads to different storylines, creating your own unique adventure.',
    'home.infinitePossibilities': 'Infinite Possibilities',
    'home.uniqueStories': 'Every story is unique, unfolding based on your choices',
    'home.freeExploration': 'Free Exploration',
    'home.imaginationGuided': 'Guided by your imagination, no fixed plot lines',
    'home.intelligentNarrative': 'Intelligent Narrative',
    'home.aiGenerated': 'AI-generated story content, adapting in real-time to your actions',
    'home.knowledgeGraph': 'Knowledge Graph Enhanced',
    'home.graphRAGDescription': 'Our GraphRAG technology ensures consistency and richness in story worlds, creating a more immersive experience',
    'home.graphRetrieval': 'Graph Retrieval',
    'home.intelligentContext': 'Intelligent context management for coherent storytelling',
    'home.worldBuilding': 'World Building',
    'home.coherentWorlds': 'Creating coherent and rich story worlds',
    'nav.home': 'Home',
    'nav.stories': 'Stories',
    'nav.play': 'Play',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',
    'nav.settings': 'Settings',
    'stories.title': 'Explore Stories',
    'stories.subtitle': 'Discover amazing stories created by the community',
    'stories.search': 'Search stories...',
    'stories.filter.recent': 'Recent',
    'stories.filter.popular': 'Popular',
    'stories.filter.trending': 'Trending',
    'stories.noResults': 'No stories found',
    'stories.noResultsDesc': 'Try using different search terms or browse all stories',
    'stories.createNew': 'Create New Story',
    'play.title': 'Start Adventure',
    'play.subtitle': 'Choose a story to begin your adventure',
    'play.newAdventure': 'New Adventure',
    'play.loadStory': 'Load Story',
    'play.character.title': 'Create Your Character',
    'play.character.name': 'Character Name',
    'play.character.description': 'Character Description',
    'play.character.back': 'Back',
    'play.character.start': 'Start Game',
    'play.input.placeholder': 'What do you want to do?',
    'play.endGame': 'End Game',
    'settings.title': 'System Settings',
    'settings.subtitle': 'Configure API connections and other system settings',
    'settings.apiConfig': 'API Configuration',
    'settings.baseUrl': 'API Base URL',
    'settings.apiKey': 'API Key',
    'settings.save': 'Save Settings',
    'settings.reset': 'Reset',
    'settings.saveSuccess': 'Settings saved',
    'settings.saveError': 'Error saving settings',
    'footer.copyright': ' 2025 Narratium. All rights reserved.',
    'footer.about': 'About Us',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy'
  }
};

export const getTranslation = (language: Language, key: TranslationKey): string => {
  return translations[language][key] || key;
};
