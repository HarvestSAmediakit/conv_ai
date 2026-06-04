import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaExpand, 
  FaCompress,
  FaSearch,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPlay,
  FaPause,
  FaTimes,
  FaRobot
} from 'react-icons/fa';
import styles from './FlipbookReader.module.css';

interface FlipbookReaderProps {
  issueId: string;
  pdfUrl?: string;
  pages?: Array<{ pageNumber: number; imageUrl: string }>;
  articles?: Array<{
    id: string;
    title: string;
    pageStart: number;
    pageEnd: number;
    podcastStatus: string;
  }>;
  aiName: string;
  initialPage?: number;
  embedded?: boolean;
  showAI?: boolean;
}

export default function FlipbookReader({
  issueId,
  pages = [],
  articles = [],
  aiName,
  initialPage = 1,
  embedded = false,
  showAI = true,
}: FlipbookReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(pages.length || 1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) toggleFullscreen();
          break;
        case 's':
        case 'S':
          setShowSearch(true);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFullscreen]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage((prev) => prev + 1);
      setTimeout(() => setIsFlipping(false), 500);
    }
  }, [currentPage, totalPages, isFlipping]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1 && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage((prev) => prev - 1);
      setTimeout(() => setIsFlipping(false), 500);
    }
  }, [currentPage, isFlipping]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && !isFlipping) {
      setIsFlipping(true);
      setCurrentPage(page);
      setTimeout(() => setIsFlipping(false), 500);
    }
  }, [totalPages, isFlipping]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?issue=${issueId}&q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, issueId]);

  const getCurrentPageImage = useCallback(() => {
    if (pages.length > 0) {
      return pages[currentPage - 1]?.imageUrl || '/placeholder-page.jpg';
    }
    return '/placeholder-page.jpg';
  }, [pages, currentPage]);

  const getArticlesOnPage = useCallback(() => {
    return articles.filter(
      (article) => currentPage >= article.pageStart && currentPage <= article.pageEnd
    );
  }, [articles, currentPage]);

  const startPodcast = useCallback((articleId: string) => {
    // Trigger podcast player for specific article
    window.dispatchEvent(new CustomEvent('startPodcast', { detail: { articleId } }));
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`${styles.container} ${embedded ? styles.embedded : ''}`}
    >
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.pageIndicator}>
          <span className={styles.pageNumber}>{currentPage}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.totalPages}>{totalPages}</span>
        </div>

        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            onClick={() => setShowSearch(true)}
            title="Search (S)"
          >
            <FaSearch />
          </button>
          
          <button
            className={styles.controlButton}
            onClick={toggleFullscreen}
            title="Fullscreen (F)"
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* Flipbook Area */}
      <div className={styles.flipbookArea}>
        {/* Left Arrow */}
        <button
          className={`${styles.navArrow} ${styles.leftArrow}`}
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <FaChevronLeft />
        </button>

        {/* Page Display */}
        <div className={styles.pageContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: isFlipping ? (currentPage > initialPage ? -50 : 50) : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isFlipping ? (currentPage > initialPage ? 50 : -50) : 0 }}
              transition={{ duration: 0.3 }}
              className={styles.pageWrapper}
            >
              <img
                src={getCurrentPageImage()}
                alt={`Page ${currentPage}`}
                className={styles.pageImage}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              
              {/* Article Overlay */}
              {getArticlesOnPage().map((article) => (
                <div key={article.id} className={styles.articleOverlay}>
                  <h3>{article.title}</h3>
                  {article.podcastStatus === 'ready' && (
                    <button
                      className={styles.playButton}
                      onClick={() => startPodcast(article.id)}
                    >
                      <FaPlay /> Play Podcast
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          className={`${styles.navArrow} ${styles.rightArrow}`}
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Page Thumbnails */}
      <div className={styles.thumbnailStrip}>
        {pages.slice(0, 10).map((page, index) => (
          <button
            key={page.pageNumber}
            className={`${styles.thumbnail} ${currentPage === page.pageNumber ? styles.active : ''}`}
            onClick={() => goToPage(page.pageNumber)}
          >
            <img
              src={page.imageUrl}
              alt={`Page ${page.pageNumber}`}
              className={styles.thumbnailImage}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </button>
        ))}
      </div>

      {/* AI Chat Panel */}
      <AnimatePresence>
        {showAIChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className={styles.aiChatPanel}
          >
            <div className={styles.aiChatHeader}>
              <div className={styles.aiIcon}>
                <FaRobot />
              </div>
              <div className={styles.aiInfo}>
                <h3>{aiName}</h3>
                <p>I've read every page of this issue</p>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setShowAIChat(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.aiChatMessages}>
              {/* Chat messages rendered here */}
            </div>
            
            <div className={styles.aiChatInput}>
              <button
                className={`${styles.micButton} ${isListening ? styles.listening : ''}`}
                onClick={() => setIsListening(!isListening)}
              >
                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
              </button>
              <input
                type="text"
                placeholder="Ask about any article..."
                className={styles.chatInput}
              />
              <button className={styles.sendButton}>
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Chat Toggle */}
      {showAI && !showAIChat && (
        <button
          className={styles.aiChatToggle}
          onClick={() => setShowAIChat(true)}
        >
          <FaRobot />
          <span>Chat with {aiName}</span>
        </button>
      )}

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.searchModal}
          >
            <div className={styles.searchContent}>
              <div className={styles.searchHeader}>
                <h2>Search this issue</h2>
                <button onClick={() => setShowSearch(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className={styles.searchInputArea}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search articles, advertisers, topics..."
                  className={styles.searchInputField}
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className={styles.searchButton}
                >
                  {isSearching ? 'Searching...' : <FaSearch />}
                </button>
              </div>

              <div className={styles.searchResults}>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    className={styles.searchResult}
                    onClick={() => {
                      goToPage(result.pageNumber);
                      setShowSearch(false);
                    }}
                  >
                    <span className={styles.resultPage}>Page {result.pageNumber}</span>
                    <span className={styles.resultTitle}>{result.title}</span>
                    <span className={styles.resultExcerpt}>{result.excerpt}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
