// src/routes.tsx
import React from 'react';
import TrackingPage from '@/pages/tracking';
import GenerateInvoice from '@/pages/generateInvoice';
import BlogAIPage from '@/pages/blog-ai';
import SEOAIPage from '@/pages/seo-ai';
import MarketplaceB2B from '@/pages/marketplace-b2b';
import AutomationsPage from '@/pages/automations';
import SeoAuditPage from '@/pages/SeoAudit';
import SeoCompetitorPage from '@/pages/seo-competitor';

const AppRoutes = () => {
  return (
    <div>
      {/* Routes will be rendered here */}
    </div>
  );
};

export const routes = [
  { path: "/tracking", element: <TrackingPage /> },
  { path: "/generate-invoice", element: <GenerateInvoice /> },
  { path: "/blog-ai", element: <BlogAIPage /> },
  { path: "/seo-ai", element: <SEOAIPage /> },
  { path: "/marketplace-b2b", element: <MarketplaceB2B /> },
  { path: "/automations", element: <AutomationsPage /> },
  { path: "/app/seo-audit", element: <SeoAuditPage /> },
  { path: "/app/seo-competitor", element: <SeoCompetitorPage /> }
];

export default AppRoutes;