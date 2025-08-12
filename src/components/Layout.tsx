"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search, 
  Menu, 
  BookOpen, 
  Home, 
  Library, 
  Heart, 
  MessageCircle,
  Star
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  const router = useRouter();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Catalog', href: '/catalog', icon: Library },
    { name: 'Favorites', href: '/favorites', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="flex flex-col gap-4 py-4">
                    <Link href="/" className="flex items-center gap-2 px-2 hover:opacity-80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                      <BookOpen className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold">Bookify AI</span>
                    </Link>
                    <nav className="flex flex-col gap-2">
                      {navigation.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <Button
                            variant="ghost"
                            className="justify-start gap-2 w-full"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                          </Button>
                        </Link>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Bookify AI</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button variant="ghost" className="gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search books, authors, genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>
            </div>

            {/* AI Chat Button */}
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">Bookify AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered reading companion. Discover, read, and discuss books like never before.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold" suppressHydrationWarning>Discover</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Featured Books</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">New Releases</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Bestsellers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Free Books</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold" suppressHydrationWarning>Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Fiction</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Science Fiction</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Fantasy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Romance</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold" suppressHydrationWarning>Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Bookify AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatBot 
        isOpen={isChatOpen} 
        onToggle={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
}
