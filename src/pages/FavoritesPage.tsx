"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookstoreAPI } from '@/lib/api';
import { Book } from '@/types';
import { 
  Heart, 
  BookOpen, 
  Search,
  Filter
} from 'lucide-react';

export function FavoritesPage() {
  const router = useRouter();
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      // Get favorite book IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
      
      if (favoriteIds.length > 0) {
        // Fetch all books and filter favorites
        const allBooksResult = await BookstoreAPI.getBooks(1, 100);
        const favorites = allBooksResult.books.filter(book => favoriteIds.includes(book.id));
        setFavoriteBooks(favorites);
      } else {
        setFavoriteBooks([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();

    // Listen for storage changes to update favorites in real-time
    const handleStorageChange = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('favoritesChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <h1 className="text-4xl font-bold tracking-tight">My Favorites</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your carefully curated collection of beloved books. These are the stories that have captured your heart and imagination.
        </p>
      </section>

      {favoriteBooks.length > 0 ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Favorite Books</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favoriteBooks.length}</div>
                <p className="text-xs text-muted-foreground">
                  books in your collection
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Genres</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(favoriteBooks.flatMap(book => book.genre)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  different genres
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(favoriteBooks.reduce((sum, book) => sum + book.rating, 0) / favoriteBooks.length).toFixed(1)}
                </div>
                <p className="text-xs text-muted-foreground">
                  stars average
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Books Grid */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Your Favorite Books</h2>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Sort & Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteBooks.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  author={book.author}
                  description={book.description}
                  coverImage={book.coverImage}
                  book={book}
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-16 space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">No Favorites Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start building your collection by adding books you love to your favorites. 
              Look for the heart icon on any book card!
            </p>
          </div>
          
          <Button size="lg" className="gap-2" onClick={() => router.push('/catalog')}>
            <Search className="h-5 w-5" />
            Discover Books
          </Button>
        </div>
      )}
    </div>
  );
}
