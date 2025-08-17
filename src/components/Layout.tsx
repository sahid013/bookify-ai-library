"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChatBot } from '@/components/ChatBot'
import { 
  BookOpen, 
  MessageCircle, 
  Search, 
  User, 
  Heart,
  Library,
  Menu,
  X 
} from 'lucide-react'
import Link from 'next/link'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Bookify</span>
            <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Browse Books
            </Link>
            <Link 
              href="/favorites" 
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Favorites
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(true)}
              className="relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="sr-only">Open AI Chat</span>
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-3 space-y-2">
              <Link 
                href="/" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Library className="h-4 w-4 inline mr-2" />
                Home
              </Link>
              <Link 
                href="/catalog" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4 inline mr-2" />
                Browse Books
              </Link>
              <Link 
                href="/favorites" 
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4 inline mr-2" />
                Favorites
              </Link>
              <div className="border-t pt-2 mt-2">
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Bookify AI</span>
              </div>
              <p className="text-gray-600 text-sm">
                Your intelligent reading companion. Discover, read, and discuss books 
                with the power of AI.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI-powered book recommendations</li>
                <li>• Interactive reading experience</li>
                <li>• Smart bookmarks and notes</li>
                <li>• Discussion and analysis tools</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-6 mt-6 text-center text-sm text-gray-500">
            © 2024 Bookify AI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI ChatBot */}
      <ChatBot
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  )
}
