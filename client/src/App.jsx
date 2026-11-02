import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SkipToContent } from './components/common/SkipToContent';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { DirectoryPage } from './pages/DirectoryPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { AddPlacePage } from './pages/AddPlacePage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
          <SkipToContent targetId="main-content" />
          <Navbar />
          <main id="main-content" className="flex-grow focus:outline-none" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<DirectoryPage />} />
              <Route path="/places/new" element={<AddPlacePage />} />
              <Route path="/places/:id" element={<PlaceDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

