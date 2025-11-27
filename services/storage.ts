import { Novel, Chapter, Comment, AppState, NovelStatus, Category } from '../types';

const STORAGE_KEY = 'inkflow_data_v1';

const seedData: AppState = {
  novels: [
    {
      id: '1',
      title: '永恒算法',
      author: '赛博笔客',
      description: '在一个代码即魔法的世界里，一位年轻的程序员发现了一个可能删除现实的Bug。',
      coverUrl: 'https://picsum.photos/300/450?random=1',
      category: Category.SCIFI,
      tags: ['赛博朋克', '魔法', '冒险'],
      status: NovelStatus.ONGOING,
      createdAt: Date.now() - 10000000,
      updatedAt: Date.now(),
      views: 12540,
      rating: 4.8,
      ratingCount: 340
    },
    {
      id: '2',
      title: '冬日繁花',
      author: '简·多伊',
      description: '一个在严冬中最意想不到的地方发现爱情的暖心故事。',
      coverUrl: 'https://picsum.photos/300/450?random=2',
      category: Category.ROMANCE,
      tags: ['慢热', '剧情'],
      status: NovelStatus.COMPLETED,
      createdAt: Date.now() - 20000000,
      updatedAt: Date.now() - 5000000,
      views: 8900,
      rating: 4.5,
      ratingCount: 120
    },
    {
        id: '3',
        title: '巨龙的叹息',
        author: '猎鳞者',
        description: '最后一条龙已经陨落，或者他们是这么认为的。群山再次躁动起来。',
        coverUrl: 'https://picsum.photos/300/450?random=3',
        category: Category.FANTASY,
        tags: ['龙', '战争', '史诗'],
        status: NovelStatus.ONGOING,
        createdAt: Date.now() - 5000000,
        updatedAt: Date.now(),
        views: 4500,
        rating: 4.2,
        ratingCount: 85
    }
  ],
  chapters: [
    {
      id: 'c1-1',
      novelId: '1',
      title: '第一章：故障',
      content: `屏幕闪烁了一下。这不是通常的硬件故障，也不是电源浪涌。这是显示器本身结构的一阵涟漪。\n\n“不可能，”凯尔喃喃自语，手指悬停在全息键盘上，“核心编译在三小时前就完成了。”\n\n他敲击了一串按键，调出了调试器。红色的文字在视野中倾泻而下，尖叫着文档中不存在的错误。`,
      wordCount: 300,
      order: 1,
      isPublished: true,
      publishedAt: Date.now() - 9000000
    },
    {
      id: 'c1-2',
      novelId: '1',
      title: '第二章：编译错误',
      content: `凯尔决定无视这个警告。菜鸟错误。在模拟中，无视警告通常意味着内存泄漏。而在现实世界中，这显然意味着他的咖啡杯现在悬浮在桌面上方三英寸处。\n\n“重力.exe 已停止工作，”他紧张地开玩笑，把杯子按了下去。它像水中的软木塞一样又浮了起来。`,
      wordCount: 450,
      order: 2,
      isPublished: true,
      publishedAt: Date.now() - 8000000
    },
    {
        id: 'c2-1',
        novelId: '2',
        title: '序章',
        content: '雪轻轻地落下，给城市披上了一层寂静的毯子。',
        wordCount: 150,
        order: 1,
        isPublished: true,
        publishedAt: Date.now() - 19000000
    }
  ],
  comments: [
    {
      id: 'com1',
      novelId: '1',
      username: '读者一号',
      content: '开篇不错！很喜欢代码魔法这个设定。',
      rating: 5,
      createdAt: Date.now() - 8500000
    }
  ],
  bookshelf: ['1'],
  history: []
};

export const getAppState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
  return JSON.parse(stored);
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const updateNovel = (novel: Novel) => {
  const state = getAppState();
  const idx = state.novels.findIndex(n => n.id === novel.id);
  if (idx >= 0) {
    state.novels[idx] = novel;
  } else {
    state.novels.push(novel);
  }
  saveAppState(state);
};

export const updateChapter = (chapter: Chapter) => {
  const state = getAppState();
  const idx = state.chapters.findIndex(c => c.id === chapter.id);
  if (idx >= 0) {
    state.chapters[idx] = chapter;
  } else {
    state.chapters.push(chapter);
  }
  // Update novel updated_at
  const novelIdx = state.novels.findIndex(n => n.id === chapter.novelId);
  if (novelIdx >= 0) {
    state.novels[novelIdx].updatedAt = Date.now();
  }
  saveAppState(state);
};

export const addComment = (comment: Comment) => {
  const state = getAppState();
  state.comments.push(comment);
  // Update rating
  const novelIdx = state.novels.findIndex(n => n.id === comment.novelId);
  if (novelIdx >= 0) {
    const novelComments = state.comments.filter(c => c.novelId === comment.novelId);
    const totalRating = novelComments.reduce((sum, c) => sum + c.rating, 0);
    state.novels[novelIdx].rating = totalRating / novelComments.length;
    state.novels[novelIdx].ratingCount = novelComments.length;
  }
  saveAppState(state);
};

export const toggleBookshelf = (novelId: string) => {
  const state = getAppState();
  if (state.bookshelf.includes(novelId)) {
    state.bookshelf = state.bookshelf.filter(id => id !== novelId);
  } else {
    state.bookshelf.push(novelId);
  }
  saveAppState(state);
};

export const updateHistory = (novelId: string, chapterId: string) => {
    const state = getAppState();
    const existingIdx = state.history.findIndex(h => h.novelId === novelId);
    if (existingIdx >= 0) {
        state.history[existingIdx] = { novelId, chapterId, timestamp: Date.now(), progress: 0 };
    } else {
        state.history.push({ novelId, chapterId, timestamp: Date.now(), progress: 0 });
    }
    saveAppState(state);
};