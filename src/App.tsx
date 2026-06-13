import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './components/shared/AppLayout';
// Import types only for component definition if needed, otherwise rely on lazy imports

const InteractiveImageBentoGalleryDemo = React.lazy(() => import('./components/bento-gallery-demo'));
const Marketplace = React.lazy(() => import('./components/Marketplace'));
const PublisherDashboard = React.lazy(() => import('./components/PublisherDashboard'));
const ReaderApp = React.lazy(() => import('./components/ReaderApp'));
const RemixHarvestSA = React.lazy(() => import('./components/RemixHarvestSA'));
const AnalyticsPanel = React.lazy(() => import('./components/analytics/AnalyticsPanel'));
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));
const HomeDashboard = React.lazy(() => import('./components/HomeDashboard'));
const SmartReader = React.lazy(() => import('./components/SmartReader'));
const FlipbookReader = React.lazy(() => import('./components/FlipbookReader'));
const Profile = React.lazy(() => import('./components/Profile'));
const BillingManagement = React.lazy(() => import('./components/BillingManagement'));
const PrivacyTransparency = React.lazy(() => import('./components/legal/PrivacyTransparency'));
const AIAssetMarketplace = React.lazy(() => import('./components/enterprise/AIAssetMarketplace'));
const EnterpriseKnowledgeHub = React.lazy(() => import('./components/enterprise/EnterpriseKnowledgeHub'));
const RevenueIntelligence = React.lazy(() => import('./components/enterprise/RevenueIntelligence'));
const AIContentStudio = React.lazy(() => import('./components/enterprise/AIContentStudio'));
const WhiteLabelConfig = React.lazy(() => import('./components/enterprise/WhiteLabelConfig'));
const MobileAppGenerator = React.lazy(() => import('./components/enterprise/MobileAppGenerator'));
const DiscoveryPortal = React.lazy(() => import('./components/enterprise/DiscoveryPortal'));
const AdvertiserDashboard = React.lazy(() => import('./components/AdvertiserDashboard'));
const AudioInterruptReader = React.lazy(() => import('./components/AudioInterruptReader'));
const Login = React.lazy(() => import('./components/Login'));

function DashboardRoutes() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default function App() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono text-sm">Loading Media Library...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyTransparency />} />
          
          <Route element={<DashboardRoutes />}>
            <Route path="/home" element={<HomeDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/billing" element={<BillingManagement />} />
            <Route path="/hub" element={<Marketplace />} />
            <Route path="/bento" element={<InteractiveImageBentoGalleryDemo />} />
            <Route path="/publish" element={<PublisherDashboard />} />
            <Route path="/analytics" element={<AnalyticsPanel />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/marketplace" element={<AIAssetMarketplace />} />
            <Route path="/knowledge" element={<EnterpriseKnowledgeHub />} />
            <Route path="/revenue" element={<RevenueIntelligence />} />
            <Route path="/content-studio" element={<AIContentStudio magazineId="mag_1" magazineTitle="Harvest SA" />} />
            <Route path="/branding" element={<WhiteLabelConfig />} />
            <Route path="/mobile" element={<MobileAppGenerator />} />
            <Route path="/discovery" element={<DiscoveryPortal />} />
            <Route path="/advertiser" element={<AdvertiserDashboard />} />
          </Route>

          <Route path="/reader" element={<ReaderApp />} />
          <Route path="/flipbook/:id" element={<FlipbookReader />} />
          <Route path="/remix" element={<RemixHarvestSA />} />
          <Route path="/smart-reader" element={<SmartReader magazineId="test-mag" />} />
          <Route path="/demo" element={<AudioInterruptReader />} />
        </Routes>
      </BrowserRouter>
    </React.Suspense>
  );
}

