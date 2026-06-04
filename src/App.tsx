import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Marketplace from './components/Marketplace';
import PublisherDashboard from './components/PublisherDashboard';
import ReaderApp from './components/ReaderApp';
import RemixHarvestSA from './components/RemixHarvestSA';
import AnalyticsPanel from './components/analytics/AnalyticsPanel';
import AdminPanel from './components/admin/AdminPanel';
import HomeDashboard from './components/HomeDashboard';
import SmartReader from './components/SmartReader';
import FlipbookReader from './components/FlipbookReader';
import Profile from './components/Profile';
import AdvertiserDashboard from './components/AdvertiserDashboard';
import AudioInterruptReader from './components/AudioInterruptReader';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomeDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/hub" element={<Marketplace />} />
        <Route path="/publish" element={<PublisherDashboard />} />
        <Route path="/reader" element={<ReaderApp />} />
        <Route path="/flipbook/:id" element={<FlipbookReader />} />
        <Route path="/remix" element={<RemixHarvestSA />} />
        <Route path="/analytics" element={<AnalyticsPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/advertiser" element={<AdvertiserDashboard />} />
        <Route path="/smart-reader" element={<SmartReader magazineId="test-mag" />} />
        <Route path="/demo" element={<AudioInterruptReader />} />
      </Routes>
    </BrowserRouter>
  );
}

