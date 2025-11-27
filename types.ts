export enum NovelStatus {
  ONGOING = '连载中',
  COMPLETED = '已完结',
  HIATUS = '断更'
}

export enum Category {
  FANTASY = '玄幻',
  ROMANCE = '言情',
  SCIFI = '科幻',
  MYSTERY = '悬疑',
  URBAN = '都市',
  HISTORY = '历史'
}

export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: Category;
  tags: string[];
  status: NovelStatus;
  createdAt: number;
  updatedAt: number;
  views: number;
  rating: number; // 0-5
  ratingCount: number;
}

export interface Chapter {
  id: string;
  novelId: string;
  title: string;
  content: string;
  wordCount: number;
  order: number;
  isPublished: boolean;
  publishedAt?: number;
}

export interface Comment {
  id: string;
  novelId: string;
  username: string; // Simplified user
  content: string;
  rating: number;
  createdAt: number;
}

export interface ReadingHistory {
  novelId: string;
  chapterId: string;
  timestamp: number;
  progress: number; // percentage simplified
}

export interface AppState {
  novels: Novel[];
  chapters: Chapter[];
  comments: Comment[];
  bookshelf: string[]; // Novel IDs
  history: ReadingHistory[];
}