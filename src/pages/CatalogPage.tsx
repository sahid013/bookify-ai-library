"use client"

import { useState, useEffect } from 'react';
import { BookCard } from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { BookstoreAPI } from '@/lib/api';
import { Book, FilterOptions, SearchResult } from '@/types';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Calendar,
  User,
  BookOpen,
  SlidersHorizontal,
  X
} from 'lucide-react';

export function CatalogPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [yearRange, setYearRange] = useState<[number, number]>([1800, 2024]);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'rating' | 'published' | 'popularity'>('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Available filter options
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    searchBooks();
  }, [searchQuery, selectedGenres, selectedAuthors, selectedLanguages, ratingFilter, yearRange, sortBy, sortOrder, currentPage]);

  const loadFilterOptions = async () => {
    try {
      const options = await BookstoreAPI.getFilterOptions();
      setAvailableGenres(options.genres);
      setAvailableAuthors(options.authors);
      setAvailableLanguages(options.languages);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };

  const searchBooks = async () => {
    setLoading(true);
    try {
      const filters: Partial<FilterOptions> = {
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        authors: selectedAuthors.length > 0 ? selectedAuthors : undefined,
        languages: selectedLanguages.length > 0 ? selectedLanguages : undefined,
        rating: ratingFilter > 0 ? ratingFilter : undefined,
        publishedAfter: yearRange[0] !== 1800 ? yearRange[0] : undefined,
        publishedBefore: yearRange[1] !== 2024 ? yearRange[1] : undefined,
        sortBy,
        sortOrder
      };

      const result: SearchResult = await BookstoreAPI.searchBooks(searchQuery, filters);
      setBooks(result.books);
      setTotalBooks(result.total);
      setHasNextPage(result.hasNextPage);
    } catch (error) {
      console.error('Error searching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setSelectedLanguages([]);
    setRatingFilter(0);
    setYearRange([1800, 2024]);
    setSearchQuery('');
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const toggleAuthor = (author: string) => {
    setSelectedAuthors(prev => 
      prev.includes(author) 
        ? prev.filter(a => a !== author)
        : [...prev, author]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const activeFiltersCount = selectedGenres.length + selectedAuthors.length + selectedLanguages.length + 
    (ratingFilter > 0 ? 1 : 0) + 
    (yearRange[0] !== 1800 || yearRange[1] !== 2024 ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Book Catalog</h1>
          <p className="text-muted-foreground">
            Discover from our collection of {totalBooks.toLocaleString()} books
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Popular Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Popular Categories</h3>
          <div className="flex flex-wrap gap-2">
            {['Fiction', 'Science Fiction', 'Fantasy', 'Romance', 'Classic', 'Mystery', 'Biography', 'Young Adult'].map(genre => (
              <Badge 
                key={genre} 
                variant={selectedGenres.includes(genre) ? 'default' : 'outline'} 
                className="cursor-pointer hover:shadow-sm transition-all"
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map(genre => (
              <Badge key={genre} variant="default" className="gap-1">
                {genre}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleGenre(genre)}
                />
              </Badge>
            ))}
            {selectedAuthors.map(author => (
              <Badge key={author} variant="secondary" className="gap-1">
                {author}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => toggleAuthor(author)}
                />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Filters</span>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sort */}
              <div className="space-y-3">
                <h4 className="font-medium">Sort by</h4>
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="published">Published Year</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Rating Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center space-x-2">
                      <Checkbox
                        id={`rating-${rating}`}
                        checked={ratingFilter === rating}
                        onCheckedChange={(checked) => 
                          setRatingFilter(checked ? rating : 0)
                        }
                      />
                      <label 
                        htmlFor={`rating-${rating}`}
                        className="flex items-center gap-1 text-sm cursor-pointer"
                      >
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3 w-3 ${
                                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        & up
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Genres */}
              <div className="space-y-3">
                <h4 className="font-medium">Genres</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableGenres.map(genre => (
                    <div key={genre} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre}`}
                        checked={selectedGenres.includes(genre)}
                        onCheckedChange={() => toggleGenre(genre)}
                      />
                      <label 
                        htmlFor={`genre-${genre}`}
                        className="text-sm cursor-pointer"
                      >
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Languages */}
              <div className="space-y-3">
                <h4 className="font-medium">Languages</h4>
                <div className="space-y-2">
                  {availableLanguages.slice(0, 5).map(language => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${language}`}
                        checked={selectedLanguages.includes(language)}
                        onCheckedChange={() => toggleLanguage(language)}
                      />
                      <label 
                        htmlFor={`language-${language}`}
                        className="text-sm cursor-pointer"
                      >
                        {language}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Publication Year */}
              <div className="space-y-3">
                <h4 className="font-medium">Publication Year</h4>
                <div className="space-y-4">
                  <Slider
                    value={yearRange}
                    onValueChange={(value) => setYearRange(value as [number, number])}
                    min={1800}
                    max={2024}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Books Grid/List */}
        <div className={`${showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : books.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {books.length} of {totalBooks.toLocaleString()} books
                </p>
              </div>
              
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {books.map((book) => (
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

              {hasNextPage && (
                <div className="flex justify-center pt-8">
                  <Button 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={loading}
                  >
                    Load More Books
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
