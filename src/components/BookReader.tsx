"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Bookmark,
  BookmarkCheck,
  Menu,
  SkipBack,
  SkipForward,
  Palette,
  Type,
  AlignLeft,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff
} from 'lucide-react';
import { Book, Bookmark as BookmarkType } from '@/types';

interface BookReaderProps {
  book: Book;
  onClose: () => void;
  initialPage?: number;
}

interface ReaderSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'mono';
  lineHeight: number;
  backgroundColor: 'white' | 'sepia' | 'dark';
  textAlign: 'left' | 'justify';
  margin: number;
  autoScroll: boolean;
}



export function BookReader({ book, onClose, initialPage = 1 }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Reader settings
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    fontFamily: 'serif',
    lineHeight: 1.6,
    backgroundColor: 'white',
    textAlign: 'justify',
    margin: 20,
    autoScroll: false
  });

  // Reading state
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);

  const readerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Mock book content - in a real app, this would come from the book file
  const mockContent = `
    Chapter 1: The Beginning

    In the quiet town of Willowbrook, where the morning mist danced through ancient oak trees and the sound of church bells marked the passage of time, lived a young woman named Eleanor who possessed an extraordinary gift that she had yet to discover.

    The cobblestone streets glistened with morning dew as Eleanor made her way to the local library, her favorite refuge from the mundane routine of small-town life. Little did she know that this particular morning would change everything.

    As she pushed open the heavy wooden doors of the library, the familiar scent of old books and polished wood welcomed her like an old friend. Mrs. Hawthorne, the elderly librarian, looked up from her desk with a warm smile.

    "Good morning, Eleanor dear. I have something special for you today," she said, her eyes twinkling with mysterious delight.

    Eleanor approached the desk, curiosity piqued. Mrs. Hawthorne reached beneath her desk and produced an ancient tome bound in deep burgundy leather. The book seemed to shimmer in the morning light streaming through the tall windows.

    "This came in yesterday's donation," Mrs. Hawthorne explained. "Something tells me it belongs with you."

    As Eleanor's fingers touched the worn leather cover, she felt a strange tingling sensation run through her hands. The book seemed to pulse with an energy all its own, as if it had been waiting centuries for this very moment.

    She opened to the first page and began to read...

    Chapter 2: The Discovery

    The words on the page seemed to shimmer and dance before Eleanor's eyes. At first, she thought it was simply the effect of the morning sunlight streaming through the library windows, but as she continued reading, she realized something extraordinary was happening.

    The text was changing, rearranging itself before her very eyes, telling a story that seemed to respond to her thoughts and emotions. When she felt curious about a character's background, additional paragraphs would materialize, providing exactly the information she sought.

    "This can't be possible," she whispered to herself, glancing around to see if anyone else had noticed the miraculous phenomenon.

    Mrs. Hawthorne was nowhere to be seen, and the library was unusually quiet, almost eerily so. Eleanor looked back at the book and gasped. The page now displayed her own name, woven seamlessly into the narrative as if she had always been part of the story.

    She tried to close the book, but it wouldn't budge. The pages seemed fused together by some invisible force, compelling her to continue reading. As she read on, she began to understand that this was no ordinary book—it was a gateway to something far beyond her imagination.

    Chapter 3: The Journey Begins

    With each turn of the page, Eleanor found herself drawn deeper into a world that defied all logic and reason. The library around her began to fade, replaced by rolling hills and crystal-clear streams that seemed to flow directly from the pages of the mysterious book.

    She could feel the warm sun on her face and smell the sweet fragrance of wildflowers carried on a gentle breeze. This was no longer just reading—she was living the story, becoming part of a narrative that had been waiting for her arrival.

    In the distance, she could see a figure approaching along a winding path. As the figure drew nearer, she realized it was a woman who bore a striking resemblance to herself, yet seemed to possess an otherworldly grace and wisdom.

    "Welcome, Eleanor," the woman said, her voice carrying the melody of wind chimes. "I am Elara, your guide in this realm. You have been chosen to restore the balance between our worlds."

    Eleanor's mind raced with questions, but before she could voice them, Elara continued.

    "The book you hold is one of seven sacred texts, each containing the power to bridge different realms of existence. For too long, these books have been scattered across the world, their power dormant. But now, the time has come for them to be reunited."

    As Elara spoke, Eleanor noticed that the landscape around them was beginning to shift and change, responding to the words being spoken. Mountains rose in the distance, their peaks touched with snow that sparkled like diamonds in the afternoon sun.
  `;

  const totalPages = Math.ceil(mockContent.length / 1000); // Simulate pages based on content length
  const currentPageContent = mockContent.slice((currentPage - 1) * 1000, currentPage * 1000);
  const readingProgress = (currentPage / totalPages) * 100;

  // Auto-hide controls
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const handleMouseMove = () => {
      setShowControls(true);
      resetControlsTimeout();
    };

    if (isFullscreen) {
      document.addEventListener('mousemove', handleMouseMove);
      resetControlsTimeout();
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          previousPage();
          break;
        case 'ArrowRight':
          nextPage();
          break;
        case 'Escape':
          if (isFullscreen) toggleFullscreen();
          break;
        case 'f':
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case 'b':
        case 'B':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleBookmark();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      readerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const toggleBookmark = () => {
    const existingBookmark = bookmarks.find(b => b.page === currentPage);
    if (existingBookmark) {
      setBookmarks(prev => prev.filter(b => b.id !== existingBookmark.id));
    } else {
      const newBookmark: BookmarkType = {
        id: `bookmark-${Date.now()}`,
        userId: 'user1',
        bookId: book.id,
        page: currentPage,
        note: '',
        createdAt: new Date().toISOString()
      };
      setBookmarks(prev => [...prev, newBookmark]);
    }
  };



  const updateSettings = (key: keyof ReaderSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getBackgroundStyle = () => {
    switch (settings.backgroundColor) {
      case 'sepia':
        return { backgroundColor: '#f4f3e8', color: '#5c4b37' };
      case 'dark':
        return { backgroundColor: '#1a1a1a', color: '#e5e5e5' };
      default:
        return { backgroundColor: '#ffffff', color: '#000000' };
    }
  };

  const getTextStyle = () => ({
    fontSize: `${settings.fontSize}px`,
    fontFamily: settings.fontFamily === 'serif' ? 'Georgia, serif' : 
                settings.fontFamily === 'sans-serif' ? 'Arial, sans-serif' : 
                'Courier, monospace',
    lineHeight: settings.lineHeight,
    textAlign: settings.textAlign as any,
    padding: `${settings.margin}px`,
    ...getBackgroundStyle()
  });



  const isBookmarked = bookmarks.some(b => b.page === currentPage);

  return (
    <div 
      ref={readerRef}
      className={`fixed inset-0 z-50 ${isFullscreen ? 'bg-black' : 'bg-background'}`}
      style={isFullscreen ? getBackgroundStyle() : undefined}
    >
      {/* Header Controls */}
      <div className={`absolute top-0 left-0 right-0 z-10 transition-all duration-300 ${
        showControls || !isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
      }`}>
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{book.title}</h2>
              <p className="text-sm text-muted-foreground">by {book.author}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Settings */}
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium">Reading Settings</h4>
                  
                  {/* Font Size */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font Size</label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => updateSettings('fontSize', value)}
                      min={12}
                      max={24}
                      step={1}
                    />
                    <div className="text-xs text-muted-foreground">{settings.fontSize}px</div>
                  </div>

                  {/* Font Family */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Font Family</label>
                    <Select value={settings.fontFamily} onValueChange={(value) => updateSettings('fontFamily', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="mono">Monospace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Line Height */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Line Height</label>
                    <Slider
                      value={[settings.lineHeight]}
                      onValueChange={([value]) => updateSettings('lineHeight', value)}
                      min={1.2}
                      max={2.0}
                      step={0.1}
                    />
                    <div className="text-xs text-muted-foreground">{settings.lineHeight.toFixed(1)}</div>
                  </div>

                  {/* Background */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Background</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'white', icon: Sun, label: 'Light' },
                        { value: 'sepia', icon: Monitor, label: 'Sepia' },
                        { value: 'dark', icon: Moon, label: 'Dark' }
                      ].map(({ value, icon: Icon, label }) => (
                        <Button
                          key={value}
                          variant={settings.backgroundColor === value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSettings('backgroundColor', value)}
                          className="flex-1 gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Text Alignment</label>
                    <Select value={settings.textAlign} onValueChange={(value) => updateSettings('textAlign', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="justify">Justified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Margin */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Margin</label>
                    <Slider
                      value={[settings.margin]}
                      onValueChange={([value]) => updateSettings('margin', value)}
                      min={10}
                      max={50}
                      step={5}
                    />
                    <div className="text-xs text-muted-foreground">{settings.margin}px</div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Bookmark */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleBookmark}>
                    {isBookmarked ? (
                      <BookmarkCheck className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>



            {/* Fullscreen Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                    {isFullscreen ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Reading Area */}
      <div className="h-full flex flex-col pt-20">
        <div className="flex-1 relative">
          <div 
            className="h-full overflow-y-auto"
            style={getTextStyle()}
          >
            <div className="max-w-4xl mx-auto py-8">
              <pre className="whitespace-pre-wrap font-sans">
                {currentPageContent}
              </pre>
            </div>
          </div>


        </div>

        {/* Navigation Controls */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
          showControls || !isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
        }`}>
          <div className="bg-background/95 backdrop-blur border-t p-4">
            <div className="flex items-center justify-between max-w-4xl mx-auto">
              {/* Previous Page */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={previousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              {/* Progress and Page Info */}
              <div className="flex-1 mx-8 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Page {currentPage} of {totalPages}</span>
                  <span>{readingProgress.toFixed(1)}% complete</span>
                </div>
                <Progress value={readingProgress} className="h-2" />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                    className="w-20 h-8"
                  />
                  <span className="text-sm text-muted-foreground">Go to page</span>
                </div>
              </div>

              {/* Next Page */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
