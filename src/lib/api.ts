import { 
  Book, 
  User, 
  ReadingProgress, 
  Bookmark, 
  Highlight, 
  Review, 
  ReadingList, 
  ReadingStats,
  FilterOptions,
  SearchResult 
} from '@/types';
import { 
  mockBooks, 
  genres, 
  languages, 
  authors 
} from '@/data/mockBooks';
import { 
  mockUser, 
  mockReadingProgress, 
  mockBookmarks, 
  mockHighlights, 
  mockReviews, 
  mockReadingLists, 
  mockReadingStats 
} from '@/data/mockUsers';

// Simulate API delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class BookstoreAPI {
  // Books API
  static async getBooks(page: number = 1, limit: number = 12): Promise<SearchResult> {
    await delay();
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const books = mockBooks.slice(startIndex, endIndex);
    
    return {
      books,
      total: mockBooks.length,
      page,
      hasNextPage: endIndex < mockBooks.length
    };
  }

  static async getFeaturedBooks(): Promise<Book[]> {
    await delay();
    return mockBooks.filter(book => book.featured);
  }

  static async getBookById(id: string): Promise<Book | null> {
    await delay();
    return mockBooks.find(book => book.id === id) || null;
  }

  static async searchBooks(query: string, filters?: Partial<FilterOptions>, page: number = 1, limit: number = 12): Promise<SearchResult> {
    await delay();
    let filteredBooks = mockBooks;

    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(lowerQuery) ||
        book.author.toLowerCase().includes(lowerQuery) ||
        book.description.toLowerCase().includes(lowerQuery) ||
        book.genre.some(g => g.toLowerCase().includes(lowerQuery))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.genres && filters.genres.length > 0) {
        filteredBooks = filteredBooks.filter(book =>
          book.genre.some(g => filters.genres!.includes(g))
        );
      }

      if (filters.authors && filters.authors.length > 0) {
        filteredBooks = filteredBooks.filter(book =>
          filters.authors!.includes(book.author)
        );
      }

      if (filters.languages && filters.languages.length > 0) {
        filteredBooks = filteredBooks.filter(book =>
          filters.languages!.includes(book.language)
        );
      }

      if (filters.rating) {
        filteredBooks = filteredBooks.filter(book =>
          book.rating >= filters.rating!
        );
      }

      if (filters.publishedAfter) {
        filteredBooks = filteredBooks.filter(book =>
          book.publishedYear >= filters.publishedAfter!
        );
      }

      if (filters.publishedBefore) {
        filteredBooks = filteredBooks.filter(book =>
          book.publishedYear <= filters.publishedBefore!
        );
      }
    }

    // Sort results
    if (filters?.sortBy) {
      filteredBooks.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'author':
            comparison = a.author.localeCompare(b.author);
            break;
          case 'rating':
            comparison = a.rating - b.rating;
            break;
          case 'published':
            comparison = a.publishedYear - b.publishedYear;
            break;
          case 'popularity':
            comparison = a.totalReviews - b.totalReviews;
            break;
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    return {
      books: paginatedBooks,
      total: filteredBooks.length,
      page,
      hasNextPage: endIndex < filteredBooks.length
    };
  }

  static async getBooksByGenre(genre: string): Promise<Book[]> {
    await delay();
    return mockBooks.filter(book => book.genre.includes(genre));
  }

  // User API
  static async getCurrentUser(): Promise<User> {
    await delay();
    return mockUser;
  }

  static async updateUserPreferences(preferences: Partial<User['preferences']>): Promise<User> {
    await delay();
    mockUser.preferences = { ...mockUser.preferences, ...preferences };
    return mockUser;
  }

  // Reading Progress API
  static async getReadingProgress(bookId?: string): Promise<ReadingProgress[]> {
    await delay();
    if (bookId) {
      return mockReadingProgress.filter(progress => progress.bookId === bookId);
    }
    return mockReadingProgress;
  }

  static async updateReadingProgress(bookId: string, page: number, timeSpent: number): Promise<ReadingProgress> {
    await delay();
    let progress = mockReadingProgress.find(p => p.bookId === bookId);
    const book = await this.getBookById(bookId);
    
    if (!progress && book) {
      progress = {
        id: `progress_${Date.now()}`,
        userId: mockUser.id,
        bookId,
        currentPage: page,
        totalPages: book.pages,
        percentage: (page / book.pages) * 100,
        timeSpent,
        lastReadDate: new Date().toISOString(),
        startedDate: new Date().toISOString(),
        status: 'reading'
      };
      mockReadingProgress.push(progress);
    } else if (progress && book) {
      progress.currentPage = page;
      progress.percentage = (page / book.pages) * 100;
      progress.timeSpent += timeSpent;
      progress.lastReadDate = new Date().toISOString();
      if (page >= book.pages) {
        progress.status = 'completed';
        progress.finishedDate = new Date().toISOString();
      }
    }
    
    return progress!;
  }

  // Bookmarks API
  static async getBookmarks(bookId?: string): Promise<Bookmark[]> {
    await delay();
    if (bookId) {
      return mockBookmarks.filter(bookmark => bookmark.bookId === bookId);
    }
    return mockBookmarks;
  }

  static async createBookmark(bookId: string, page: number, note?: string): Promise<Bookmark> {
    await delay();
    const bookmark: Bookmark = {
      id: `bookmark_${Date.now()}`,
      userId: mockUser.id,
      bookId,
      page,
      note,
      createdAt: new Date().toISOString()
    };
    mockBookmarks.push(bookmark);
    return bookmark;
  }

  static async deleteBookmark(bookmarkId: string): Promise<void> {
    await delay();
    const index = mockBookmarks.findIndex(b => b.id === bookmarkId);
    if (index > -1) {
      mockBookmarks.splice(index, 1);
    }
  }

  // Highlights API
  static async getHighlights(bookId?: string): Promise<Highlight[]> {
    await delay();
    if (bookId) {
      return mockHighlights.filter(highlight => highlight.bookId === bookId);
    }
    return mockHighlights;
  }

  static async createHighlight(
    bookId: string, 
    text: string, 
    page: number, 
    color: Highlight['color'], 
    note?: string
  ): Promise<Highlight> {
    await delay();
    const highlight: Highlight = {
      id: `highlight_${Date.now()}`,
      userId: mockUser.id,
      bookId,
      text,
      page,
      color,
      note,
      createdAt: new Date().toISOString()
    };
    mockHighlights.push(highlight);
    return highlight;
  }

  // Reviews API
  static async getReviews(bookId?: string): Promise<Review[]> {
    await delay();
    if (bookId) {
      return mockReviews.filter(review => review.bookId === bookId);
    }
    return mockReviews;
  }

  static async createReview(
    bookId: string, 
    rating: number, 
    title: string, 
    content: string
  ): Promise<Review> {
    await delay();
    const review: Review = {
      id: `review_${Date.now()}`,
      userId: mockUser.id,
      bookId,
      rating,
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      helpful: 0
    };
    mockReviews.push(review);
    return review;
  }

  // Reading Lists API
  static async getReadingLists(): Promise<ReadingList[]> {
    await delay();
    return mockReadingLists;
  }

  static async createReadingList(name: string, description?: string): Promise<ReadingList> {
    await delay();
    const list: ReadingList = {
      id: `list_${Date.now()}`,
      userId: mockUser.id,
      name,
      description,
      bookIds: [],
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockReadingLists.push(list);
    return list;
  }

  static async addBookToList(listId: string, bookId: string): Promise<ReadingList> {
    await delay();
    const list = mockReadingLists.find(l => l.id === listId);
    if (list && !list.bookIds.includes(bookId)) {
      list.bookIds.push(bookId);
      list.updatedAt = new Date().toISOString();
    }
    return list!;
  }

  // Stats API
  static async getReadingStats(): Promise<ReadingStats> {
    await delay();
    return mockReadingStats;
  }

  // Filter options API
  static async getFilterOptions() {
    await delay();
    return {
      genres,
      languages,
      authors
    };
  }
}

