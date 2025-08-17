"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  BookOpen, 
  Lightbulb, 
  Quote,
  Search,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
  currentBookId?: string;
  selectedText?: string;
}

export function ChatBot({ isOpen, onToggle, currentBookId, selectedText }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I&apos;m your AI reading companion. I can help you with book recommendations, discuss themes and characters, analyze text, create study materials, and much more. How can I assist you today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    {
      category: 'Book Analysis',
      actions: [
        { text: 'Summarize this chapter', icon: BookOpen },
        { text: 'Explain the main themes', icon: Lightbulb },
        { text: 'Analyze the characters', icon: User },
        { text: 'Find important quotes', icon: Quote }
      ]
    },
    {
      category: 'Study Help',
      actions: [
        { text: 'Create quiz questions', icon: Search },
        { text: 'Make study notes', icon: BookOpen },
        { text: 'Explain difficult concepts', icon: Lightbulb },
        { text: 'Compare with other books', icon: BookOpen }
      ]
    },
    {
      category: 'Recommendations',
      actions: [
        { text: 'Suggest similar books', icon: Sparkles },
        { text: 'Find books by genre', icon: Search },
        { text: 'Recommend based on mood', icon: Lightbulb },
        { text: 'Popular new releases', icon: BookOpen }
      ]
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          bookContext: currentBookId ? { 
            title: 'Current Book', // You can enhance this with actual book data
            author: 'Unknown Author' 
          } : undefined,
          selectedText: selectedText,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      
      // Check if this was a fallback response
      if (data.fallback) {
        return data.message + "\n\n💡 *This response is from my built-in knowledge. For more advanced AI assistance, you can add a Google Gemini API key to the environment.*";
      }
      
      return data.message;
    } catch (error: unknown) {
      console.error('AI API Error:', error);
      
      // Fallback responses for common errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes('API key')) {
        return "I'm working with my built-in responses right now. I can still help with book recommendations, analysis tips, and literary discussions! To enable advanced AI responses, add a Google Gemini API key. Try the quick actions below or ask me anything about books. 📚";
      }
      
      if (errorMessage?.includes('Rate limit')) {
        return "I'm experiencing high demand right now. Please wait a moment and try again. In the meantime, you can explore the quick actions below!";
      }
      
      return "I'm here to help! While I work on processing your request, feel free to try the quick actions below or ask me about book recommendations, character analysis, or literary themes! 📖";
    }
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || newMessage.trim();
    if (!textToSend) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      context: currentBookId ? { bookId: currentBookId, selectedText } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    if (!messageText) setNewMessage(''); // Only clear if it's from the input
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(textToSend);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (actionText: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: actionText,
      timestamp: new Date().toISOString(),
      context: currentBookId ? { bookId: currentBookId, selectedText } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(actionText);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'assistant',
        content: "Hi! I'm your AI reading companion. How can I assist you today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-2rem)] shadow-2xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-3 flex-shrink-0 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-5 w-5" />
          AI Reading Assistant
          {currentBookId && <Badge variant="secondary" className="text-xs">Book Context</Badge>}
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={clearChat}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="mx-4 mb-2 flex-shrink-0">
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="actions" className="flex-1">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0 min-h-0">
          <ScrollArea className="flex-1 px-4 min-h-0">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm break-words ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                      {message.content}
                    </div>
                    {message.context?.selectedText && (
                      <div className="mt-2 p-2 bg-background/50 rounded border-l-2 border-primary">
                        <p className="text-xs text-muted-foreground">Selected text:</p>
                        <p className="text-xs italic break-words">&quot;{message.context.selectedText}&quot;</p>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="actions" className="flex-1 mt-0 min-h-0 flex flex-col">
          <ScrollArea className="flex-1 px-4 min-h-0">
            <div className="space-y-6 py-4">
              {quickActions.map((category) => (
                <div key={category.category} className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">
                    {category.category}
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {category.actions.map((action) => (
                      <Button
                        key={action.text}
                        variant="outline"
                        size="sm"
                        className="justify-start gap-2 h-auto py-2 text-left"
                        onClick={() => handleQuickAction(action.text)}
                      >
                        <action.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-left break-words">{action.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <CardFooter className="p-4 pt-2 flex-shrink-0 border-t bg-background/50">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Ask me anything about books..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            disabled={isTyping}
            className="min-w-0 flex-1"
          />
          <Button 
            onClick={() => sendMessage()} 
            disabled={!newMessage.trim() || isTyping}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
