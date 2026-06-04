// src/components/chat/AIChatPanel.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPaperclip,
  FaTimes,
  FaExpand,
  FaCompress,
  FaSearch,
  FaBook,
  FaStore,
} from 'react-icons/fa';
import styles from './AIChatPanel.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: {
    type: 'article' | 'advertiser';
    title: string;
    pageNumber?: number;
    relevance: number;
  }[];
  timestamp: Date;
}

interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'article' | 'advertiser' | 'general';
}

interface AIChatPanelProps {
  issueId: string;
  aiName: string;
  introduction: string;
  articles: Array<{ id: string; title: string; author?: string }>;
  advertisers: Array<{ id: string; brand_name: string; product_name?: string }>;
  onClose?: () => void;
}

export default function AIChatPanel({
  issueId,
  aiName,
  introduction,
  articles,
  advertisers,
  onClose,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'articles' | 'advertisers'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom when new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: introduction,
        timestamp: new Date(),
      },
    ]);
  }, [introduction]);

  // Suggested questions
  const suggestedQuestions: SuggestedQuestion[] = [
    { id: '1', text: 'What are the main articles in this issue?', category: 'article' },
    { id: '2', text: 'Tell me about the cover story', category: 'article' },
    { id: '3', text: 'What advertisers are featured?', category: 'advertiser' },
    { id: '4', text: 'What products have special offers?', category: 'advertiser' },
    { id: '5', text: 'Summarize this issue for me', category: 'general' },
  ];

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/magazines/${issueId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: content, history: messages }),
      });

      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || "Sorry, I couldn't understand that.",
        sources: data.pageSuggestions?.map((page: number) => ({
          type: 'article',
          title: `Page ${page}`,
          pageNumber: page,
          relevance: 1
        })) || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I had trouble processing that. Please try again.',
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    } 
  }, [issueId, messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Voice input
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as SpeechRecognitionResultList)
        .map((result) => result[0].transcript)
        .join('');
      setInput(transcript);
      sendMessage(transcript);
      stopListening();
    };
    
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        stopListening();
    };

    recognition.onend = () => {
        stopListening();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return (
    <div className={`${styles.container} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.header}>
            <div className={styles.aiInfo}>
                <FaRobot className={styles.aiIcon} />
                <div>
                   <h3>{aiName}</h3>
                   <p>Virtual Assistant</p>
                </div>
            </div>
            <div className={styles.headerActions}>
                <button onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <FaCompress /> : <FaExpand />}
                </button>
                {onClose && <button onClick={onClose}><FaTimes /></button>}
            </div>
        </div>

        <div className={styles.messagesContainer}>
            {messages.map(msg => (
                <div key={msg.id} className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.userWrapper : styles.assistantWrapper}`}>
                    <div className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
                        <div className={styles.messageContent}>
                            {msg.content}
                            {msg.sources && msg.sources.length > 0 && (
                                <div className={styles.sources}>
                                    <div className={styles.sourcesTitle}>Sources:</div>
                                    <div className={styles.sourcesList}>
                                        {msg.sources.map((src, i) => (
                                            <span key={i} className={styles.sourceTag}>
                                                {src.type === 'article' ? <FaBook /> : <FaStore />}
                                                {src.title}
                                                {src.pageNumber ? ` (p.${src.pageNumber})` : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className={`${styles.messageWrapper} ${styles.assistantWrapper}`}>
                    <div className={`${styles.message} ${styles.assistantMessage} ${styles.loadingMessage}`}>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                        <span className={styles.dot}></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {messages.length <= 2 && (
            <div className={styles.suggestionsContainer}>
                <div className={styles.suggestionsTitle}>Suggested Questions:</div>
                <div className={styles.suggestionsList}>
                    {suggestedQuestions.map(q => (
                        <button key={q.id} onClick={() => sendMessage(q.text)} className={styles.suggestionButton}>
                            {q.category === 'article' ? <FaBook /> : q.category === 'advertiser' ? <FaStore /> : <FaSearch />}
                            <span>{q.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        <form onSubmit={handleSubmit} className={styles.inputForm}>
             <button
                type="button"
                className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
                onClick={isListening ? stopListening : startListening}
             >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
             </button>
             <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question..."
                className={styles.inputField}
             />
             <button type="submit" className={styles.sendBtn} disabled={!input.trim() || isLoading}>
                 <FaPaperPlane />
             </button>
        </form>
    </div>
  );
}
