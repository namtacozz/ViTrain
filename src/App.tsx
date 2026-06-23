import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSettings } from './lib/settings/settingsStore';

// Lazy load heavy pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const TeamBuilder = lazy(() => import('./pages/TeamBuilder'));
const Advisor = lazy(() => import('./pages/Advisor').then(m => ({ default: m.Advisor })));
const Battle = lazy(() => import('./pages/Battle'));
const Database = lazy(() => import('./pages/Database'));
const TypeChart = lazy(() => import('./pages/TypeChart'));
const Settings = lazy(() => import('./pages/Settings'));
const Builder = lazy(() => import('./pages/Builder'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="text-center space-y-3">
      <div className="text-4xl animate-spin">⚡</div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    initSettings();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-background text-foreground dark pb-16 md:pb-0">
          <Header />

          {/* Mobile Header */}
          <header className="md:hidden border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-50 p-4 flex justify-center items-center">
            <div className="font-bold tracking-tight">Champions<span className="text-red-500">Advisor</span></div>
          </header>

          <main className="max-w-5xl mx-auto p-4 animate-fade-in">
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/team/new" element={<TeamBuilder />} />
                  <Route path="/builder" element={<Builder />} />
                  <Route path="/advisor" element={<Advisor />} />
                  <Route path="/battle" element={<Battle />} />
                  <Route path="/database" element={<Database />} />
                  <Route path="/typechart" element={<TypeChart />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>

          <MobileNav />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
