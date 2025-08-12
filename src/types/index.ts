export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string[];
  language: string;
  publishedYear: number;
  pages: number;
  rating: number;
  totalReviews: number;
  isbn: string;
  publisher: string;
  fileUrl?: string; // PDF or text file URL
  preview?: string; // First few pages/chapters
  featured?: boolean;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  readingGoal?: number; // books per year
  currentStreak: number;
  totalBooksRead: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large' | 'xl';
  fontFamily: 'serif' | 'sans-serif' | 'mono';
  readingSpeed: number; // words per minute
  autoBookmark: boolean;
  notifications: boolean;
}

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  currentPage: number;
  totalPages: number;
  percentage: number;
  timeSpent: number; // in minutes
  lastReadDate: string;
  startedDate: string;
  finishedDate?: string;
  status: 'not-started' | 'reading' | 'paused' | 'completed';
}

export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  page: number;
  chapter?: string;
  note?: string;
  createdAt: string;
}

export interface Highlight {
  id: string;
  userId: string;
  bookId: string;
  text: string;
  page: number;
  color: 'yellow' | 'blue' | 'green' | 'pink';
  note?: string;
  createdAt: string;
}

export interface Annotation {
  id: string;
  userId: string;
  bookId: string;
  page: number;
  x: number;
  y: number;
  content: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number; // 1-5
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  helpful: number;
}

export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  bookIds: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  bookId: string;
  text: string;
  author: string;
  page?: number;
  chapter?: string;
  addedBy: string;
  likes: number;
  shares: number;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    bookId?: string;
    page?: number;
    selectedText?: string;
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  title?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: {
    type: 'books_read' | 'streak_days' | 'pages_read' | 'reviews_written';
    target: number;
  };
  unlockedBy: string[];
}

export interface ReadingStats {
  booksRead: number;
  pagesRead: number;
  timeSpent: number; // in minutes
  averageRating: number;
  favoriteGenres: string[];
  readingStreak: number;
  thisWeek: {
    booksRead: number;
    timeSpent: number;
  };
  thisMonth: {
    booksRead: number;
    timeSpent: number;
  };
  thisYear: {
    booksRead: number;
    timeSpent: number;
  };
}

export interface FilterOptions {
  genres: string[];
  languages: string[];
  authors: string[];
  rating: number;
  publishedAfter?: number;
  publishedBefore?: number;
  sortBy: 'title' | 'author' | 'rating' | 'published' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResult {
  books: Book[];
  total: number;
  page: number;
  hasNextPage: boolean;
}
