import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaList,
  FaTimes,
  FaMicrophone,
  FaMicrophoneSlash,
  FaCheckCircle,
  FaExclamationCircle,
} from 'react-icons/fa';
import styles from './PodcastPlayer.module.css';

interface Article {
  id: string;
  title: string;
  author?: string;
  summary?: string;
}

interface PodcastPlayerProps {
  article: Article;
  content: string;
  voiceId: string;
  onClose?: () => void;
  onQuestionAsked?: (question: string) => Promise<{
    answer: string;
    citations: string[];
  }>;
}

interface PlaybackState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'answering';
  currentTime: number;
  duration: number;
  volume: number;
  sections: PodcastSection[];
  currentSectionIndex: number;
}

interface PodcastSection {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

interface InterruptState {
  isActive: boolean;
  question: string;
  answer?: string;
  citations?: string[];
}

export default function PodcastPlayer({
  article,
  content,
  voiceId,
  onClose,
  onQuestionAsked,
}: PodcastPlayerProps) {
  const [playback, setPlayback] = useState<PlaybackState>({
    status: 'loading',
    currentTime: 0,
    duration: 0,
    sections: [],
    currentSectionIndex: 0,
    volume: 1,
  });
  const [interrupt, setInterrupt] = useState<InterruptState>({
    isActive: false,
    question: '',
  });
  const [isListening, setIsListening] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null); // Use any to bypass TS error in this file simply

  // Initialize podcast
  useEffect(() => {
    initializePodcast();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializePodcast = async () => {
    // Split content into sections
    const sections = chunkContent(content || 'No content provided');
    
    // Generate TTS for each section (in production, fetch from server)
    // For now, use browser speech synthesis as fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('');
      utterance.onend = () => {
        setPlayback((prev) => ({ ...prev, status: 'idle' }));
      };
    }

    setPlayback((prev) => ({
      ...prev,
      status: 'idle',
      duration: sections.length > 0 ? sections[sections.length - 1].endTime : 0,
      sections,
    }));
  };

  const chunkContent = (text: string): PodcastSection[] => {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim());
    const sections: PodcastSection[] = [];
    let currentTime = 0;

    for (let i = 0; i < sentences.length; i += 3) {
      const chunk = sentences.slice(i, i + 3).join('. ');
      const wordCount = chunk.split(/\s+/).length;
      const duration = (wordCount / 150) * 60 * 1000; // 150 wpm

      sections.push({
        id: `section-${i}`,
        text: chunk,
        startTime: currentTime,
        endTime: currentTime + duration,
      });

      currentTime += duration;
    }

    return sections;
  };

  const play = useCallback(() => {
    setPlayback((prev) => ({ ...prev, status: 'playing' }));
    // Audio playback logic here
  }, []);

  const pause = useCallback(() => {
    setPlayback((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const seek = useCallback((time: number) => {
    setPlayback((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const skipForward = useCallback(() => {
    const newTime = Math.min(
      playback.currentTime + 10000,
      playback.duration
    );
    seek(newTime);
  }, [playback.currentTime, playback.duration, seek]);

  const skipBackward = useCallback(() => {
    const newTime = Math.max(playback.currentTime - 10000, 0);
    seek(newTime);
  }, [playback.currentTime, seek]);

  // Voice interruption
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as SpeechRecognitionResultList)
        .map((result) => result[0].transcript)
        .join('');

      // Detect interruption keywords
      if (transcript.toLowerCase().includes('hey') ||
          transcript.toLowerCase().includes('pause') ||
          transcript.toLowerCase().includes('what')) {
        handleInterrupt(transcript);
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const handleInterrupt = useCallback(async (question: string) => {
    // Pause playback
    pause();

    setInterrupt({
      isActive: true,
      question,
    });

    // Ask the question to the AI
    if (onQuestionAsked) {
      const response = await onQuestionAsked(question);
      
      setInterrupt({
        isActive: true,
        question,
        answer: response.answer,
        citations: response.citations,
      });
    }
  }, [pause, onQuestionAsked]);

  const resumePlayback = useCallback(() => {
    setInterrupt({
      isActive: false,
      question: '',
    });
    play();
  }, [play]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.player}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.articleInfo}>
          <h2>{article.title}</h2>
          {article.author && <p>By {article.author}</p>}
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      {/* Waveform Visualizer */}
      <div className={styles.visualizer}>
        <div className={styles.waveform}>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className={`${styles.bar} ${
                i < (playback.currentTime / playback.duration) * 50
                  ? styles.active
                  : ''
              }`}
              animate={{
                height: playback.status === 'playing'
                  ? Math.random() * 40 + 10
                  : 10,
              }}
              transition={{
                duration: 0.2,
                repeat: playback.status === 'playing' ? Infinity : 0,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressArea}>
        <span className={styles.time}>{formatTime(playback.currentTime)}</span>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${playback.duration ? (playback.currentTime / playback.duration) * 100 : 0}%` }}
          />
          <div
            className={styles.progressHandle}
            style={{ left: `${playback.duration ? (playback.currentTime / playback.duration) * 100 : 0}%` }}
          />
        </div>
        <span className={styles.time}>{formatTime(playback.duration)}</span>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <button
          className={styles.skipBtn}
          onClick={skipBackward}
          title="Skip back 10s"
        >
          <FaBackward />
        </button>

        <button
          className={`${styles.playBtn} ${
            playback.status === 'playing' ? styles.playing : ''
          }`}
          onClick={playback.status === 'playing' ? pause : play}
        >
          {playback.status === 'playing' ? (
            <FaPause />
          ) : (
            <FaPlay />
          )}
        </button>

        <button className={styles.skipBtn} onClick={skipForward} title="Skip forward 10s">
          <FaForward />
        </button>
      </div>

      {/* Voice & Extra Controls */}
      <div className={styles.extraControls}>
        <button
          className={`${styles.voiceBtn} ${isListening ? styles.listening : ''}`}
          onClick={isListening ? stopListening : startListening}
        >
          {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
          <span>{isListening ? 'Listening...' : 'Voice Control'}</span>
        </button>

        <button
          className={styles.transcriptBtn}
          onClick={() => setShowTranscript(!showTranscript)}
        >
          <FaList />
          Transcript
        </button>
      </div>

      {/* Interrupt Panel */}
      <AnimatePresence>
        {interrupt.isActive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={styles.interruptPanel}
          >
            <div className={styles.interruptHeader}>
              <FaMicrophone />
              <span>Question Asked</span>
            </div>

            <div className={styles.interruptContent}>
              <div className={styles.question}>
                <strong>You asked:</strong>
                <p>{interrupt.question}</p>
              </div>

              {interrupt.answer && (
                <div className={styles.answer}>
                  <strong>Answer:</strong>
                  <p>{interrupt.answer}</p>
                  
                  {interrupt.citations && (
                    <div className={styles.citations}>
                      {interrupt.citations.map((cite, i) => (
                        <span key={i} className={styles.citation}>
                          <FaCheckCircle /> {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                className={styles.resumeBtn}
                onClick={resumePlayback}
              >
                <FaPlay /> Resume Podcast
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Panel */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.transcriptPanel}
          >
            <h3>Transcript</h3>
            <div className={styles.transcriptContent}>
              {playback.sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`${styles.transcriptSection} ${
                    index === playback.currentSectionIndex ? styles.current : ''
                  }`}
                  onClick={() => seek(section.startTime)}
                >
                  <span className={styles.timestamp}>
                    {formatTime(section.startTime)}
                  </span>
                  <p>{section.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Element (hidden) */}
      <audio ref={audioRef} />
    </div>
  );
}
