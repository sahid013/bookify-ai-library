"use client"

import { useState, useEffect } from 'react'
import { BookCard } from '@/components/BookCard'
import { BookstoreAPI } from '@/lib/api'
import { Book } from '@/types'
import { Heart, BookOpen, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FavoritesPage() {
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Get favorite book IDs from localStorage
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteBooks') || '[]')
        
        if (favoriteIds.length === 0) {
          setIsLoading(false)
          return
        }

        // Get all books and filter favorites
        const allBooksResult = await BookstoreAPI.getBooks(1, 100) // Get more books to ensure we catch all favorites
        const favorites = allBooksResult.books.filter(book => favoriteIds.includes(book.id))
        
        setFavoriteBooks(favorites)
      } catch (error) {
        console.error('Error loading favorite books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()

    // Listen for favorites changes from other components
    const handleFavoritesChange = () => {
      loadFavorites()
    }

    window.addEventListener('favoritesChanged', handleFavoritesChange)
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">Your personally curated collection</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-6 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-4"></div>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (favoriteBooks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">Your personally curated collection</p>
        </div>

        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No favorites yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start building your personal library by adding books to your favorites. 
            Click the heart icon on any book to add it here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button className="px-8">
                <Search className="h-4 w-4 mr-2" />
                Browse Books
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-8">
                <BookOpen className="h-4 w-4 mr-2" />
                View Featured
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
        </div>
        <p className="text-gray-600">
          {favoriteBooks.length} book{favoriteBooks.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex flex-wrap gap-4">
        <Link href="/catalog">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Discover More Books
          </Button>
        </Link>
        <Button 
          variant="outline"
          onClick={() => {
            localStorage.removeItem('favoriteBooks')
            setFavoriteBooks([])
            window.dispatchEvent(new Event('favoritesChanged'))
          }}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear All Favorites
        </Button>
      </div>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

      {/* Reading Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {favoriteBooks.length}
          </div>
          <div className="text-blue-600 font-medium">Favorite Books</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {favoriteBooks.reduce((total, book) => total + book.pages, 0).toLocaleString()}
          </div>
          <div className="text-green-600 font-medium">Total Pages</div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {favoriteBooks.length > 0 
              ? (favoriteBooks.reduce((total, book) => total + book.rating, 0) / favoriteBooks.length).toFixed(1)
              : '0'
            }
          </div>
          <div className="text-purple-600 font-medium">Average Rating</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Based on your favorites</h2>
        <p className="text-gray-600 mb-6">
          We think you might enjoy these books based on your reading preferences.
        </p>
        <Link href="/catalog">
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Get Recommendations
          </Button>
        </Link>
      </div>
    </div>
  )
}
