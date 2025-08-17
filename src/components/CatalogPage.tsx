"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookCard } from '@/components/BookCard'
import { BookstoreAPI } from '@/lib/api'
import { Book, FilterOptions } from '@/types'
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List,
  ArrowUpDown,
  X
} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CatalogPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [totalBooks, setTotalBooks] = useState(0)
  
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    genres: [],
    rating: 0,
    sortBy: 'title',
    sortOrder: 'asc'
  })

  // Available filter options
  const availableGenres = [
    'Classic', 'Science Fiction', 'Fantasy', 'Romance', 'Mystery',
    'Non-fiction', 'Biography', 'History', 'Young Adult', 'Contemporary Fiction'
  ]

  const loadBooks = async (page: number = 1, search: string = '') => {
    setIsLoading(true)
    try {
      let result
      if (search) {
        result = await BookstoreAPI.searchBooks(search, filters, page)
      } else {
        result = await BookstoreAPI.getBooks(page, 12)
      }
      
      if (page === 1) {
        setBooks(result.books)
      } else {
        setBooks(prev => [...prev, ...result.books])
      }
      
      setHasNextPage(result.hasNextPage)
      setTotalBooks(result.total)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error loading books:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadBooks(1, searchQuery)
  }, [searchQuery, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadBooks(1, searchQuery)
  }

  const handleLoadMore = () => {
    loadBooks(currentPage + 1, searchQuery)
  }

  const handleGenreFilter = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres?.includes(genre) 
        ? prev.genres.filter(g => g !== genre)
        : [...(prev.genres || []), genre]
    }))
  }

  const clearFilters = () => {
    setFilters({
      genres: [],
      rating: 0,
      sortBy: 'title',
      sortOrder: 'asc'
    })
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Books</h1>
        <p className="text-gray-600">Discover your next great read from our collection</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search books, authors, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
          <Button type="submit">
            Search
          </Button>
        </form>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {(filters.genres?.length || 0) > 0 && (
                <span className="bg-blue-600 text-white rounded-full text-xs px-2 py-1">
                  {filters.genres?.length}
                </span>
              )}
            </Button>

            {/* Quick Clear */}
            {((filters.genres?.length || 0) > 0 || searchQuery) && (
              <Button variant="ghost" onClick={clearFilters} className="text-red-600">
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort Controls */}
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc' 
              }))}
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <Button
                    key={genre}
                    variant={filters.genres?.includes(genre) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleGenreFilter(genre)}
                  >
                    {genre}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Minimum Rating</h3>
              <Select
                value={filters.rating?.toString() || '0'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, rating: parseInt(value) }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any Rating</SelectItem>
                  <SelectItem value="3">3+ Stars</SelectItem>
                  <SelectItem value="4">4+ Stars</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {isLoading ? (
            'Loading...'
          ) : (
            `Showing ${books.length} of ${totalBooks} books`
          )}
        </div>
      </div>

      {/* Books Grid/List */}
      {isLoading && books.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-6 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-4"></div>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
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
      )}

      {/* Load More */}
      {hasNextPage && (
        <div className="text-center mt-8">
          <Button 
            onClick={handleLoadMore} 
            disabled={isLoading}
            className="px-8"
          >
            {isLoading ? 'Loading...' : 'Load More Books'}
          </Button>
        </div>
      )}
    </div>
  )
}
