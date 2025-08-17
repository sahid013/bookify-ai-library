"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { BookCard } from '@/components/BookCard'
import { BookstoreAPI } from '@/lib/api'
import { Book } from '@/types'
import { 
  BookOpen, 
  Star, 
  Users, 
  Search,
  ArrowRight,
  Brain,
  Bookmark,
  PenTool
} from 'lucide-react'
import Link from 'next/link'

export function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [recentBooks, setRecentBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const [featured, recent] = await Promise.all([
          BookstoreAPI.getFeaturedBooks(),
          BookstoreAPI.getBooks(1, 6)
        ])
        setFeaturedBooks(featured.slice(0, 3))
        setRecentBooks(recent.books)
      } catch (error) {
        console.error('Error loading books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Reading Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Discover, read, and discuss books with intelligent AI assistance. 
              Get personalized recommendations, deep insights, and an enhanced reading experience.
            </p>
            <div className="flex justify-center">
              <Link href="/catalog">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Reading
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Bookify AI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Insights</h3>
              <p className="text-gray-600">
                Get intelligent analysis, summaries, and discussion points for any book. 
                Our AI understands context and provides meaningful insights.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Enhanced Reading</h3>
              <p className="text-gray-600">
                Customizable reading experience with adjustable fonts, themes, and layouts. 
                Read comfortably anytime, anywhere.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interactive Discussions</h3>
              <p className="text-gray-600">
                Engage in meaningful conversations about books. Ask questions, explore themes, 
                and deepen your understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Books</h2>
            <Link href="/catalog">
              <Button variant="outline">
                View All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-200">Books Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-blue-200">Happy Readers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-200">AI Conversations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-blue-200">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Books Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Recently Added</h2>
            <Link href="/catalog">
              <Button variant="outline">
                Browse All <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBooks.map((book) => (
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
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Experience Reading Like Never Before</h2>
            <p className="text-xl mb-8 text-blue-100">
              Our AI companion doesn&apos;t just recommend books – it transforms how you read, 
              understand, and engage with literature.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4">
                <Bookmark className="h-12 w-12 mb-3 text-yellow-400" />
                <h3 className="text-lg font-semibold mb-2">Smart Bookmarks</h3>
                <p className="text-blue-100 text-sm">Automatically track important passages and themes</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <PenTool className="h-12 w-12 mb-3 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">Intelligent Notes</h3>
                <p className="text-blue-100 text-sm">AI-powered annotations and study guides</p>
              </div>
              <div className="flex flex-col items-center p-4">
                <Users className="h-12 w-12 mb-3 text-pink-400" />
                <h3 className="text-lg font-semibold mb-2">Discussion Groups</h3>
                <p className="text-blue-100 text-sm">Connect with fellow readers worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Join thousands of readers who have transformed their reading experience with Bookify AI. 
            Your next great book is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg">
                <Search className="h-5 w-5 mr-2" />
                Explore Books
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg"
            >
              <Star className="h-5 w-5 mr-2" />
              View Favorites
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
