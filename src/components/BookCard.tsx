"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BookReader } from "@/components/BookReader"
import { Book } from "@/types"
import { BookOpen, Heart } from "lucide-react"

interface BookCardProps {
  title: string
  author: string
  description?: string
  coverImage?: string
  book?: Book
}

export function BookCard({ 
  title, 
  author, 
  description,
  coverImage,
  book
}: BookCardProps) {
  const [showReader, setShowReader] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Check if book is in favorites on component mount
  useEffect(() => {
    if (book) {
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteBooks') || '[]')
      setIsFavorite(favoriteIds.includes(book.id))
    }
  }, [book]);

  const toggleFavorite = () => {
    if (!book) return;
    
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteBooks') || '[]');
    let updatedFavorites;
    
    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = favoriteIds.filter((id: string) => id !== book.id);
    } else {
      // Add to favorites
      updatedFavorites = [...favoriteIds, book.id];
    }
    
    localStorage.setItem('favoriteBooks', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
    // Trigger custom event for real-time updates
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const handleReadBook = () => {
    if (book) {
      setShowReader(true)
    } else {
      alert(`Reading functionality not available for "${title}"`)
    }
  }
  return (
    <Card className="w-full max-w-sm p-0 overflow-hidden pb-5 relative">
      {book && (
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 z-10 transition-all ${
            coverImage 
              ? 'bg-white/80 hover:bg-white opacity-90 hover:opacity-100' 
              : 'bg-muted hover:bg-muted/80'
          }`}
          onClick={toggleFavorite}
        >
          <Heart 
            className={`h-5 w-5 transition-colors ${
              isFavorite 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </Button>
      )}
      
      {coverImage && (
        <div className="h-48 w-full overflow-hidden relative">
          <img
            src={coverImage}
            alt={`Cover of ${title}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>by {author}</CardDescription>
      </CardHeader>
      
      {description && (
        <CardContent className="pt-0 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {description}
          </p>
        </CardContent>
      )}
      
      <CardFooter className="pt-0">
        <Button 
          onClick={handleReadBook}
          className="w-full"
          variant="default"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Read Book
        </Button>
      </CardFooter>

      {/* Book Reader Modal */}
      {showReader && book && (
        <BookReader 
          book={book} 
          onClose={() => setShowReader(false)} 
        />
      )}
    </Card>
  )
}
