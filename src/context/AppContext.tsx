import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalysisResult, SentimentType } from '../types';
import { INITIAL_ANALYTICS_HISTORY } from '../data/mockData';
import { analyzeSentimentLocally } from '../utils/sentimentEngine';

export type NavigationTab = 
  | 'dashboard' 
  | 'analyzer' 
  | 'pipeline' 
  | 'batch' 
  | 'analytics' 
  | 'explorer' 
  | 'sdg9' 
  | 'docs';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  analysisHistory: AnalysisResult[];
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  analyzerInput: {
    reviewText: string;
    movieTitle: string;
    genre: string;
  };
  setAnalyzerInput: React.Dispatch<React.SetStateAction<{
    reviewText: string;
    movieTitle: string;
    genre: string;
  }>>;
  apiStatus: {
    online: boolean;
    hasGemini: boolean;
    activeModel: string;
  };
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  analyzeReview: (review: string, movieTitle?: string, genre?: string) => Promise<AnalysisResult>;
  clearHistory: () => void;
  loadReviewIntoAnalyzer: (review: string, movieTitle?: string, genre?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'cinesense_analysis_history_v1';
const THEME_KEY = 'cinesense_theme_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [analyzerInput, setAnalyzerInput] = useState({
    reviewText: '',
    movieTitle: '',
    genre: 'Drama'
  });
  const [apiStatus, setApiStatus] = useState({
    online: true,
    hasGemini: false,
    activeModel: 'Detecting...'
  });

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
    return INITIAL_ANALYTICS_HISTORY;
  });

  // Load saved theme
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch {
      // ignore
    }
  }, []);

  // Update document body theme class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  // Check backend server status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/status');
        if (res.ok) {
          const data = await res.json();
          setApiStatus({
            online: true,
            hasGemini: Boolean(data.hasGeminiApiKey),
            activeModel: data.activeModel || 'Gemini 3.8 Flash'
          });
        }
      } catch {
        setApiStatus({
          online: false,
          hasGemini: false,
          activeModel: 'CineSense NLP Lexicon Engine (Local Offline)'
        });
      }
    };
    checkStatus();
  }, []);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analysisHistory));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  }, [analysisHistory]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearHistory = () => {
    setAnalysisHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    showToast('Analysis history cleared successfully', 'info');
  };

  const loadReviewIntoAnalyzer = (review: string, movieTitle = '', genre = 'Drama') => {
    setAnalyzerInput({
      reviewText: review,
      movieTitle,
      genre
    });
    setActiveTab('analyzer');
    showToast(`Loaded review for "${movieTitle || 'Movie'}" into Analyzer`, 'info');
  };

  const analyzeReview = async (review: string, movieTitle = '', genre = 'Drama'): Promise<AnalysisResult> => {
    setIsAnalyzing(true);
    try {
      let result: AnalysisResult;

      // Try server API first
      try {
        const response = await fetch('/api/sentiment/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ review, movieTitle, genre })
        });

        if (response.ok) {
          result = await response.json();
        } else {
          // If server returns error, fallback locally
          result = analyzeSentimentLocally(review, movieTitle, genre);
        }
      } catch {
        // Network or offline fallback
        result = analyzeSentimentLocally(review, movieTitle, genre);
      }

      setCurrentAnalysis(result);
      // Append to history (keep max 100)
      setAnalysisHistory(prev => [result, ...prev.slice(0, 99)]);
      showToast(`Analysis complete: ${result.sentiment} sentiment (${result.confidence}% confidence)`, 'success');
      return result;
    } catch (err: any) {
      showToast(err.message || 'Error running sentiment analysis', 'error');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        analysisHistory,
        currentAnalysis,
        setCurrentAnalysis,
        isAnalyzing,
        analyzerInput,
        setAnalyzerInput,
        apiStatus,
        toasts,
        showToast,
        removeToast,
        analyzeReview,
        clearHistory,
        loadReviewIntoAnalyzer
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
