
// src/routes.tsx
import TrackingPage from '@/pages/tracking';
import GenerateInvoice from '@/pages/generateInvoice';
import BlogAIPage from '@/pages/blog-ai';
import SEOAIPage from '@/pages/seo-ai';
import MarketplaceB2B from '@/pages/marketplace-b2b';
import AutomationsPage from '@/pages/automations';

export const routes = [
  { path: "/tracking", element: <TrackingPage /> },
  { path: "/generate-invoice", element: <GenerateInvoice /> },
  { path: "/blog-ai", element: <BlogAIPage /> },
  { path: "/seo-ai", element: <SEOAIPage /> },
  { path: "/marketplace-b2b", element: <MarketplaceB2B /> },
  { path: "/automations", element: <AutomationsPage /> }
];
