/**
 * CineSense AI — Intelligent Movie Sentiment Analyzer
 * United Nations SDG 9 (Industry, Innovation & Infrastructure) Aligned
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { HomeDashboard } from './components/HomeDashboard';
import { SentimentAnalyzer } from './components/SentimentAnalyzer';
import { PipelineVisualization } from './components/PipelineVisualization';
import { BatchAnalysis } from './components/BatchAnalysis';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { MovieExplorer } from './components/MovieExplorer';
import { SdgIntegration } from './components/SdgIntegration';
import { TechSpecs } from './components/TechSpecs';

const AppContent: React.FC = () => {
  const { activeTab, theme } = useApp();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950 text-slate-100 selection:bg-purple-500 selection:text-white' 
        : 'bg-slate-50 text-slate-900 selection:bg-purple-400 selection:text-white'
    }`}>
      {/* Toast Notification Layer */}
      <ToastContainer />

      {/* Primary Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'dashboard' && <HomeDashboard />}
        {activeTab === 'analyzer' && <SentimentAnalyzer />}
        {activeTab === 'pipeline' && <PipelineVisualization />}
        {activeTab === 'batch' && <BatchAnalysis />}
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'explorer' && <MovieExplorer />}
        {activeTab === 'sdg9' && <SdgIntegration />}
        {activeTab === 'docs' && <TechSpecs />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
