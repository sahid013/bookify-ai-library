"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookstoreAPI } from '@/lib/api';
import { Book, ReadingStats } from '@/types';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  BookOpen,
  Star,
  Users,
  Flame
} from 'lucide-react';

export function HomePage() {
  const router = useRouter();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, recent, stats] = await Promise.all([
          BookstoreAPI.getFeaturedBooks(),
          BookstoreAPI.getBooks(1, 8),
          BookstoreAPI.getReadingStats()
        ]);
        
        setFeaturedBooks(featured);
        setRecentBooks(recent.books);
        setReadingStats(stats);
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);



  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/70 text-primary-foreground h-[75vh]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 px-8 py-16 h-full">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center text-left space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Welcome to Bookify AI
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl">
              Your intelligent reading companion. Discover amazing books, track your progress, 
              and get personalized recommendations powered by AI.
            </p>
            <div className="flex justify-start">
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => router.push('/catalog')}>
                <Star className="h-5 w-5" />
                Browse Catalog
              </Button>
            </div>
          </div>

          {/* Right Column - Book Marquees */}
          <div className="relative flex gap-4 h-full min-h-[calc(75vh-8rem)]">
            {/* First Marquee Column - Top to Bottom */}
            <div className="flex-1 overflow-hidden relative marquee-container">
              <div className="animate-marquee-down">
                {[...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks]
                  .filter(book => book.id !== '5') // Remove Dune
                  .map((book, index) => (
                  <div key={`marquee1-${index}`} className="mb-4">
                    <div className="relative group cursor-pointer">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-2xl shadow-lg transition-transform group-hover:scale-105"
                        style={{ borderRadius: '16px' }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          // Use different fallback images for each book to ensure variety
                          const fallbackImages = [
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1614544048536-0d28caf77200?w=300&h=450&fit=crop'
                          ];
                          const fallbackIndex = parseInt(book.id) % fallbackImages.length;
                          if (img.src !== fallbackImages[fallbackIndex]) {
                            img.src = fallbackImages[fallbackIndex];
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <h3 className="font-bold text-sm mb-1">{book.title}</h3>
                          <p className="text-xs opacity-80">by {book.author}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Second Marquee Column - Bottom to Top */}
            <div className="flex-1 overflow-hidden relative marquee-container">
              <div className="animate-marquee-up">
                {[...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks, ...recentBooks, ...featuredBooks]
                  .filter(book => book.id !== '5') // Remove Dune
                  .map((book, index) => (
                  <div key={`marquee2-${index}`} className="mb-4">
                    <div className="relative group cursor-pointer">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-48 object-cover rounded-2xl shadow-lg transition-transform group-hover:scale-105"
                        style={{ borderRadius: '16px' }}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          // Use different fallback images for each book to ensure variety
                          const fallbackImages = [
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop',
                            'https://images.unsplash.com/photo-1614544048536-0d28caf77200?w=300&h=450&fit=crop'
                          ];
                          const fallbackIndex = parseInt(book.id) % fallbackImages.length;
                          if (img.src !== fallbackImages[fallbackIndex]) {
                            img.src = fallbackImages[fallbackIndex];
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <h3 className="font-bold text-sm mb-1">{book.title}</h3>
                          <p className="text-xs opacity-80">by {book.author}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reading Stats */}
      {readingStats && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Books Read</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.booksRead}</div>
              <p className="text-xs text-muted-foreground">
                +{readingStats.thisMonth.booksRead} this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.readingStreak}</div>
              <p className="text-xs text-muted-foreground">days in a row</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(readingStats.timeSpent / 60)}h</div>
              <p className="text-xs text-muted-foreground">total reading time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readingStats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">stars given</p>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Featured Books */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Books</h2>
            <p className="text-muted-foreground">Handpicked selections just for you</p>
          </div>
          <Button variant="outline" className="gap-2" onClick={() => router.push('/catalog')}>
            <TrendingUp className="h-4 w-4" />
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
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



      {/* Latest Additions */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Latest Additions</h2>
            <p className="text-muted-foreground">Recently added to our collection</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/catalog')}>View All</Button>
        </div>
        
        <Tabs defaultValue="new" className="w-full">
          <TabsList>
            <TabsTrigger value="new">New Releases</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentBooks.slice(0, 4).map((book) => (
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
          </TabsContent>
          
          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentBooks.slice(4, 8).map((book) => (
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
          </TabsContent>
          
          <TabsContent value="popular" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentBooks.slice(0, 4).map((book) => (
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
          </TabsContent>
        </Tabs>
      </section>

      {/* Reading Challenge */}
      <section className="bg-muted/50 rounded-2xl p-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">2024 Reading Challenge</h2>
            <p className="text-muted-foreground">
              Set a goal and track your reading progress throughout the year
            </p>
          </div>
          
          {readingStats && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Progress: {readingStats.thisYear.booksRead} / 24 books</span>
                <span>{Math.round((readingStats.thisYear.booksRead / 24) * 100)}%</span>
              </div>
              <Progress value={(readingStats.thisYear.booksRead / 24) * 100} className="h-3" />
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Goal: 24 books</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>{24 - readingStats.thisYear.booksRead} books to go</span>
                </div>
              </div>
            </div>
          )}
          
          <Button size="lg" className="gap-2">
            <Target className="h-5 w-5" />
            Join Challenge
          </Button>
        </div>
      </section>
    </div>
  );
}
