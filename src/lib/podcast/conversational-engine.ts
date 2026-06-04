import textChunker from './text-chunker';

// Mocking ElevenLabs for the demo environment to avoid failing API calls
export interface PodcastConfig {
  elevenlabs?: any;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  speakerBoost?: boolean;
}

export interface PodcastSection {
  id: string;
  articleId: string;
  text: string;
  audioUrl?: string;
  durationMs: number;
  startTimeMs: number;
  keywords: string[];
}

export interface PlaybackState {
  status: 'idle' | 'playing' | 'paused' | 'interrupted' | 'answering';
  currentSectionIndex: number;
  positionMs: number;
  interruptCount: number;
  lastInterruptTime: Date | null;
}

export interface InterruptResult {
  acknowledged: boolean;
  question: string;
  answer: string;
  citations: string[];
  canResume: boolean;
  resumePositionMs: number;
}

class AudioQueueManager {
  private queue: Map<string, AudioBuffer> = new Map();
  private maxCacheSize = 5; 
  private currentPreloading: string | null = null;

  async preload(sections: PodcastSection[], currentIndex: number): Promise<void> {
    for (let i = currentIndex; i < Math.min(currentIndex + 2, sections.length); i++) {
      const section = sections[i];
      if (!this.queue.has(section.id) && !this.currentPreloading) {
        this.currentPreloading = section.id;
        this.currentPreloading = null;
      }
    }

    if (this.queue.size > this.maxCacheSize) {
      const oldestKeys = Array.from(this.queue.keys()).slice(0, 2);
      oldestKeys.forEach((key) => this.queue.delete(key));
    }
  }

  getCached(sectionId: string): AudioBuffer | undefined {
    return this.queue.get(sectionId);
  }

  cache(sectionId: string, audio: AudioBuffer): void {
    this.queue.set(sectionId, audio);
  }

  clear(): void {
    this.queue.clear();
  }
}

class SmoothTransitionManager {
  private fadeDurationMs = 500;
  private resumeOffsetMs = 2000;

  calculateResumePosition(
    currentPosition: number,
    sectionStartTime: number,
    totalSectionDuration: number
  ): number {
    const targetPosition = Math.max(0, currentPosition - this.resumeOffsetMs);
    return Math.min(targetPosition, sectionStartTime + totalSectionDuration - 1000);
  }

  async fadeOut(audioContext: AudioContext, source: AudioBufferSourceNode): Promise<void> {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + this.fadeDurationMs / 1000);
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    await new Promise((resolve) => setTimeout(resolve, this.fadeDurationMs));
  }

  async fadeIn(audioContext: AudioContext, source: AudioBufferSourceNode): Promise<void> {
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(1, audioContext.currentTime + this.fadeDurationMs / 1000);
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
  }
}

export class ConversationalPodcastEngine {
  private voiceId: string;
  private config: PodcastConfig;
  private sections: PodcastSection[] = [];
  private state: PlaybackState;
  private audioQueue: AudioQueueManager;
  private transitionManager: SmoothTransitionManager;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;

  private onStateChange?: (state: PlaybackState) => void;
  private onAudioProgress?: (positionMs: number, sectionIndex: number) => void;
  private onInterrupt?: (question: string, answer: string) => void;
  private onPlaybackEnd?: () => void;

  constructor(config: PodcastConfig) {
    this.voiceId = config.voiceId;
    this.config = config;
    this.state = {
      status: 'idle',
      currentSectionIndex: 0,
      positionMs: 0,
      interruptCount: 0,
      lastInterruptTime: null,
    };
    this.audioQueue = new AudioQueueManager();
    this.transitionManager = new SmoothTransitionManager();
  }

  async initialize(article: {
    id: string;
    title: string;
    content: string;
    keywords?: string[];
  }): Promise<PodcastSection[]> {
    console.log(`🎧 Initializing podcast for: ${article.title}`);

    const chunks = textChunker.chunk(article.content, {
      maxLength: 1500,
      overlap: 100,
      preserveSentences: true,
    });

    let cumulativeTime = 0;
    this.sections = chunks.map((chunk, index) => {
      const durationMs = this.estimateDuration(chunk.text);
      const section = {
        id: `${article.id}-section-${index}`,
        articleId: article.id,
        text: chunk.text,
        durationMs: durationMs,
        startTimeMs: cumulativeTime,
        keywords: this.extractKeywords(chunk.text, article.keywords),
      };
      cumulativeTime += durationMs;
      return section;
    });

    return this.sections;
  }

  async play(): Promise<void> {
    if (this.state.status === 'idle' && this.sections.length === 0) {
      throw new Error('No content loaded');
    }

    console.log('▶️ Starting playback');
    this.setState({ ...this.state, status: 'playing' });

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    await this.playCurrentSection();
  }

  async pause(): Promise<void> {
    if (this.state.status !== 'playing') return;

    if (this.currentSource && this.audioContext) {
      await this.transitionManager.fadeOut(this.audioContext, this.currentSource);
    }

    this.setState({ ...this.state, status: 'paused' });
  }

  async resume(): Promise<void> {
    if (this.state.status !== 'paused') return;

    this.setState({ ...this.state, status: 'playing' });

    await this.playCurrentSection();
  }

  async handleInterrupt(
    question: string,
    ragAnswer: { answer: string; citations: string[] }
  ): Promise<InterruptResult> {
    this.setState({
      ...this.state,
      status: 'interrupted',
      interruptCount: this.state.interruptCount + 1,
      lastInterruptTime: new Date(),
    });

    const section = this.sections[this.state.currentSectionIndex];
    const resumePosition = this.transitionManager.calculateResumePosition(
      this.state.positionMs,
      section.startTimeMs,
      section.durationMs
    );

    const result: InterruptResult = {
      acknowledged: true,
      question,
      answer: ragAnswer.answer,
      citations: ragAnswer.citations,
      canResume: true,
      resumePositionMs: resumePosition,
    };

    this.onInterrupt?.(question, ragAnswer.answer);

    return result;
  }

  async seek(positionMs: number): Promise<void> {
    let cumulativeTime = 0;
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      if (cumulativeTime + section.durationMs > positionMs) {
        if (this.currentSource && this.audioContext) {
          await this.transitionManager.fadeOut(this.audioContext, this.currentSource);
        }

        this.setState({
          ...this.state,
          currentSectionIndex: i,
          positionMs,
        });

        if (this.state.status === 'playing') {
          await this.playCurrentSection();
        }
        return;
      }
      cumulativeTime += section.durationMs;
    }
  }

  getSections(): PodcastSection[] {
    return this.sections;
  }

  getState(): PlaybackState {
    return this.state;
  }

  onStateChanged(callback: (state: PlaybackState) => void): void {
    this.onStateChange = callback;
  }

  onInterrupted(callback: (question: string, answer: string) => void): void {
    this.onInterrupt = callback;
  }

  onEnded(callback: () => void): void {
    this.onPlaybackEnd = callback;
  }

  async generateSectionAudio(sectionId: string): Promise<string> {
    // Generate an empty audio buffer URL string for demo purposes
    if (!this.audioContext) {
        this.audioContext = new AudioContext();
    }
    const sampleRate = this.audioContext.sampleRate;
    const durationSeconds = 5;
    const buffer = this.audioContext.createBuffer(1, sampleRate * durationSeconds, sampleRate);
    
    // Fill with silence 
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < channelData.length; i++) {
        channelData[i] = 0;
    }
    
    // Return a dummy data url 
    return "data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA==";
  }

  destroy(): void {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioQueue.clear();
    this.sections = [];
    this.setState({ ...this.state, status: 'idle' });
  }

  private async playCurrentSection(): Promise<void> {
    // Mock functionality in order to fulfill the build
    setTimeout(() => {
        if (this.state.status !== 'playing') return;
        const nextIndex = this.state.currentSectionIndex + 1;
        if (nextIndex < this.sections.length) {
            this.setState({
                ...this.state,
                currentSectionIndex: nextIndex,
                positionMs: this.sections[nextIndex].startTimeMs,
            });
            this.playCurrentSection();
        } else {
            this.setState({ ...this.state, status: 'idle' });
            this.onPlaybackEnd?.();
        }
    }, 2000);
  }

  private setState(newState: PlaybackState): void {
    this.state = newState;
    this.onStateChange?.(newState);
  }

  private estimateDuration(text: string): number {
    const words = text.split(/\s+/).length;
    return Math.round((words / 150) * 60 * 1000);
  }

  private extractKeywords(text: string, articleKeywords?: string[]): string[] {
    const keywords: string[] = articleKeywords || [];
    
    const importantTerms = [
      'AI', 'machine learning', 'technology', 'company', 'price',
    ];
    
    for (const term of importantTerms) {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        keywords.push(term);
      }
    }
    
    return [...new Set(keywords)];
  }
}

export function createPodcastEngine(
  elevenLabsApiKey: string,
  voiceId: string
): ConversationalPodcastEngine {
  return new ConversationalPodcastEngine({
    voiceId,
  });
}
