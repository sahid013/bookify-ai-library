import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini client
let genAI: GoogleGenerativeAI | null = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const { message, bookContext, selectedText, conversationHistory } = await request.json();

    console.log('Chat API called with message:', message);
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY || !genAI) {
      console.log('Using fallback response');
      // Fallback to intelligent predefined responses
      const fallbackResponse = getFallbackResponse(message, bookContext, selectedText);
      return NextResponse.json({ 
        message: fallbackResponse,
        fallback: true 
      });
    }

    // Build context-aware prompt for Gemini
    let prompt = `You are an AI reading companion for Bookify AI Library, a modern online bookstore. You help users with:

1. Book recommendations based on preferences and reading history
2. Literary analysis including themes, characters, and writing techniques  
3. Study assistance like summaries, quiz questions, and explanations
4. Book discussions and interpretations
5. Finding quotes and passages
6. Comparing books and authors

You should be helpful, knowledgeable, and encouraging about reading. Keep responses conversational and engaging. If discussing a specific book, reference details accurately.`;

    // Add book context if available
    if (bookContext) {
      prompt += `\n\nCurrent book context: The user is currently reading or discussing "${bookContext.title}" by ${bookContext.author}.`;
    }

    // Add selected text context if available
    if (selectedText) {
      prompt += `\n\nSelected text from the book: "${selectedText}"`;
    }

    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      prompt += `\n\nConversation history:\n`;
      const recentHistory = conversationHistory.slice(-6); // Keep last 6 messages for context
      recentHistory.forEach((msg: { type: string; content: string }) => {
        prompt += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    prompt += `\n\nUser: ${message}\nAssistant:`;

    // Call Gemini API
    console.log('Calling Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent(prompt);
    console.log('Gemini API result received');
    
    const response = result.response;
    const aiResponse = response.text() || 'I apologize, but I was unable to generate a response. Please try again.';
    
    console.log('AI Response:', aiResponse.substring(0, 100) + '...');

    return NextResponse.json({ 
      message: aiResponse,
      model: 'gemini-1.5-flash'
    });

  } catch (error: unknown) {
    console.error('Gemini API error:', error);
    
    // Handle specific Gemini errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage?.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        { error: 'Invalid Gemini API key' },
        { status: 401 }
      );
    }
    
    if (errorMessage?.includes('QUOTA_EXCEEDED')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    if (errorMessage?.includes('SAFETY')) {
      return NextResponse.json(
        { error: 'Content blocked by safety filters. Please rephrase your question.' },
        { status: 400 }
      );
    }

    // Fallback to intelligent responses on any API error
    const fallbackResponse = getFallbackResponse('I need help', undefined, undefined);
    return NextResponse.json({ 
      message: fallbackResponse + '\n\n💡 *Fallback response - Gemini API temporarily unavailable.*',
      fallback: true 
    });
  }
}

// Intelligent fallback responses when Gemini API is not available
function getFallbackResponse(message: string, bookContext?: { title: string; author: string }, selectedText?: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Book recommendation requests
  if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) {
    if (lowerMessage.includes('fantasy')) {
      return "For fantasy lovers, I'd recommend starting with 'The Lord of the Rings' by J.R.R. Tolkien or 'Harry Potter' series by J.K. Rowling. Both offer rich world-building and memorable characters. 'Dune' by Frank Herbert is also excellent if you enjoy science fantasy!";
    }
    if (lowerMessage.includes('classic')) {
      return "Some timeless classics I'd suggest include 'To Kill a Mockingbird' by Harper Lee for its powerful social themes, 'Pride and Prejudice' by Jane Austen for brilliant character development, or '1984' by George Orwell for thought-provoking dystopian fiction.";
    }
    if (lowerMessage.includes('science fiction') || lowerMessage.includes('sci-fi')) {
      return "Great sci-fi picks include '1984' by George Orwell, 'Dune' by Frank Herbert, and 'The Handmaid's Tale' by Margaret Atwood. Each offers unique perspectives on technology, society, and human nature.";
    }
    return "I'd love to help with recommendations! Based on our catalog, popular choices include 'To Kill a Mockingbird', 'Pride and Prejudice', 'Dune', and 'Harry Potter'. What genre interests you most?";
  }
  
  // Analysis requests
  if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis') || lowerMessage.includes('theme')) {
    if (bookContext) {
      return `Great question about "${bookContext.title}"! Literary analysis involves examining themes, character development, symbolism, and the author's writing techniques. What specific aspect would you like to explore? I can help you think about character motivations, thematic elements, or literary devices used in the text.`;
    }
    return "Literary analysis is fascinating! When analyzing a book, consider themes (central messages), character development (how characters change), symbolism (deeper meanings), plot structure, and the author's writing style. Which book are you currently reading?";
  }
  
  // Summary requests
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    if (selectedText) {
      return "When summarizing text, focus on the main ideas, key events, and important character developments. Look for the central conflict, how it develops, and its resolution. What specific aspects of this passage would you like me to help you understand better?";
    }
    return "I can help you create effective summaries! Good summaries include main plot points, key character developments, central themes, and important outcomes. Which book or chapter would you like to summarize?";
  }
  
  // Study help
  if (lowerMessage.includes('study') || lowerMessage.includes('quiz') || lowerMessage.includes('test')) {
    return "Study tip: Create connections between characters, themes, and plot events. Try making character maps, timeline of events, and theme charts. For quizzes, focus on: character motivations, major plot points, themes, important quotes, and author's style. What subject are you studying?";
  }
  
  // Character questions
  if (lowerMessage.includes('character')) {
    return "Character analysis is key to understanding literature! Consider: What motivates this character? How do they change throughout the story? What do their actions reveal about their personality? How do they relate to other characters and themes? Which character interests you most?";
  }
  
  // Quote requests
  if (lowerMessage.includes('quote') || lowerMessage.includes('passage')) {
    return "Important quotes often reveal character insights, themes, or turning points in the story. When analyzing quotes, consider: Who said it? What's the context? What does it reveal about the character or theme? How does it connect to the larger story?";
  }
  
  // General greetings and conversation
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! I'm your AI reading companion. I'm here to help with book recommendations, literary analysis, study questions, character discussions, and more. What would you like to explore today?";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're very welcome! I'm always here to help with your reading journey. Feel free to ask about any book, character, theme, or literary concept. Happy reading! 📚";
  }
  
  // Default helpful response
  return "I'm here to help with your reading journey! I can assist with book recommendations, character analysis, theme exploration, study questions, plot summaries, and literary discussions. What would you like to explore? You can ask about specific books, request recommendations by genre, or dive into literary analysis!";
}
