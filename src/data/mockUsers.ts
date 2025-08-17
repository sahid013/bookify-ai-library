import { User, ReadingProgress, Bookmark, Highlight, Review, ReadingList, ReadingStats } from '@/types';

export const mockUser: User = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  joinedDate: '2023-01-15',
  readingGoal: 24,
  currentStreak: 7,
  totalBooksRead: 42,
  preferences: {
    theme: 'dark',
    fontSize: 'medium',
    fontFamily: 'serif',
    readingSpeed: 250,
    autoBookmark: true,
    notifications: true
  }
};

export const mockReadingProgress: ReadingProgress[] = [
  {
    id: 'progress1',
    userId: 'user1',
    bookId: '1',
    currentPage: 156,
    totalPages: 281,
    percentage: 55.5,
    timeSpent: 420,
    lastReadDate: '2024-08-10T14:30:00Z',
    startedDate: '2024-08-05T10:00:00Z',
    status: 'reading'
  },
  {
    id: 'progress2',
    userId: 'user1',
    bookId: '3',
    currentPage: 432,
    totalPages: 432,
    percentage: 100,
    timeSpent: 680,
    lastReadDate: '2024-08-08T20:15:00Z',
    startedDate: '2024-07-28T09:00:00Z',
    finishedDate: '2024-08-08T20:15:00Z',
    status: 'completed'
  },
  {
    id: 'progress3',
    userId: 'user1',
    bookId: '7',
    currentPage: 89,
    totalPages: 223,
    percentage: 39.9,
    timeSpent: 180,
    lastReadDate: '2024-08-09T16:45:00Z',
    startedDate: '2024-08-08T21:00:00Z',
    status: 'reading'
  }
];

export const mockBookmarks: Bookmark[] = [
  {
    id: 'bookmark1',
    userId: 'user1',
    bookId: '1',
    page: 156,
    chapter: 'Chapter 12',
    note: 'Important scene with Atticus',
    createdAt: '2024-08-10T14:30:00Z'
  },
  {
    id: 'bookmark2',
    userId: 'user1',
    bookId: '7',
    page: 89,
    chapter: 'Chapter 7',
    note: 'First Quidditch match',
    createdAt: '2024-08-09T16:45:00Z'
  }
];

export const mockHighlights: Highlight[] = [
  {
    id: 'highlight1',
    userId: 'user1',
    bookId: '1',
    text: 'You never really understand a person until you consider things from his point of view... Until you climb inside of his skin and walk around in it.',
    page: 39,
    color: 'yellow',
    note: 'Key theme about empathy',
    createdAt: '2024-08-06T11:20:00Z'
  },
  {
    id: 'highlight2',
    userId: 'user1',
    bookId: '3',
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    page: 1,
    color: 'blue',
    note: 'Famous opening line',
    createdAt: '2024-07-28T09:05:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'review1',
    userId: 'user1',
    bookId: '3',
    rating: 5,
    title: 'A Timeless Masterpiece',
    content: 'Pride and Prejudice is everything I hoped it would be and more. Austen\'s wit and insight into human nature are unparalleled. Elizabeth Bennet is one of literature\'s most compelling heroines.',
    createdAt: '2024-08-08T21:00:00Z',
    updatedAt: '2024-08-08T21:00:00Z',
    likes: 23,
    helpful: 18
  },
  {
    id: 'review2',
    userId: 'user1',
    bookId: '2',
    rating: 4,
    title: 'Disturbingly Relevant',
    content: 'Orwell\'s vision of the future feels uncomfortably close to our present reality. A challenging but essential read that makes you question everything about surveillance and freedom.',
    createdAt: '2024-07-15T19:30:00Z',
    updatedAt: '2024-07-15T19:30:00Z',
    likes: 45,
    helpful: 32
  }
];

export const mockReadingLists: ReadingList[] = [
  {
    id: 'list1',
    userId: 'user1',
    name: 'Summer Reading 2024',
    description: 'Books I want to read this summer',
    bookIds: ['5', '6', '10'],
    isPublic: true,
    createdAt: '2024-06-01T10:00:00Z',
    updatedAt: '2024-08-10T15:00:00Z'
  },
  {
    id: 'list2',
    userId: 'user1',
    name: 'Classics to Read',
    description: 'Essential classic literature',
    bookIds: ['1', '2', '3', '4', '8'],
    isPublic: false,
    createdAt: '2024-05-15T14:30:00Z',
    updatedAt: '2024-08-05T12:00:00Z'
  }
];

export const mockReadingStats: ReadingStats = {
  booksRead: 42,
  pagesRead: 12456,
  timeSpent: 18240, // in minutes
  averageRating: 4.2,
  favoriteGenres: ['Classic', 'Science Fiction', 'Fantasy'],
  readingStreak: 7,
  thisWeek: {
    booksRead: 1,
    timeSpent: 420
  },
  thisMonth: {
    booksRead: 3,
    timeSpent: 1280
  },
  thisYear: {
    booksRead: 18,
    timeSpent: 8640
  }
};

