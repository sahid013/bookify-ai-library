"use client"

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { ChatMessage, ChatSession } from '@/types';

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
      content: "Hi! I'm your AI reading companion. I can help you with book recommendations, discuss themes and characters, analyze text, create study materials, and much more. How can I assist you today?",
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

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple response logic based on message content
    const message = userMessage.toLowerCase();
    
    if (message.includes('recommend') || message.includes('suggest')) {
      return "Based on your reading history, I'd recommend checking out 'The Seven Husbands of Evelyn Hugo' by Taylor Jenkins Reid. It's a captivating contemporary fiction with strong character development, similar to some of your previous reads. Would you like more recommendations in this genre or something different?";
    }
    
    if (message.includes('theme') || message.includes('meaning')) {
      return "Great question! The main themes in this work include human resilience, the complexity of relationships, and the search for identity. These themes are woven throughout the narrative through the protagonist's journey and interactions with other characters. Which specific theme would you like me to explore in more depth?";
    }
    
    if (message.includes('character') || message.includes('protagonist')) {
      return "The character development in this book is quite nuanced. The protagonist evolves from someone who is initially reactive to circumstances to someone who takes control of their destiny. Their relationships with supporting characters reveal different facets of their personality. What aspects of character development are you most interested in discussing?";
    }
    
    if (message.includes('quote') || message.includes('passage')) {
      return "Here's a powerful quote from the book: 'The only way to make sense out of change is to plunge into it, move with it, and join the dance.' This passage encapsulates the book's central message about embracing life's uncertainties. Would you like me to find more quotes with similar themes?";
    }
    
    if (message.includes('summary') || message.includes('summarize')) {
      return "This chapter focuses on a pivotal moment in the story where the main character faces a crucial decision. The author uses vivid imagery and internal monologue to show the character's inner conflict. Key events include the confrontation with the antagonist and the revelation that changes everything. Would you like me to elaborate on any specific part?";
    }
    
    return "That's an interesting question! I'd be happy to help you explore that topic further. Could you provide a bit more context about what specifically you'd like to know? I can offer insights about the book's themes, characters, writing style, historical context, or anything else you're curious about.";
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date().toISOString(),
      context: currentBookId ? { bookId: currentBookId, selectedText } : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await simulateAIResponse(newMessage);
      
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

  const handleQuickAction = (actionText: string) => {
    setNewMessage(actionText);
    sendMessage();
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
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-3">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4">
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="actions" className="flex-1">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'assistant' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                    {message.context?.selectedText && (
                      <div className="mt-2 p-2 bg-background/50 rounded border-l-2 border-primary">
                        <p className="text-xs text-muted-foreground">Selected text:</p>
                        <p className="text-xs italic">"{message.context.selectedText}"</p>
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 mt-1">
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

        <TabsContent value="actions" className="flex-1 mt-0">
          <ScrollArea className="flex-1 px-4">
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
                        className="justify-start gap-2 h-auto py-2"
                        onClick={() => handleQuickAction(action.text)}
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-left">{action.text}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Input
            placeholder="Ask me anything about books..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isTyping}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!newMessage.trim() || isTyping}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
