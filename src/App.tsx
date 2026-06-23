import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeamBuilder from './pages/TeamBuilder';
import { Advisor } from './pages/Advisor';
import Battle from './pages/Battle';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { ErrorBoundary } from './components/ErrorBoundary';

import Database from './pages/Database';
import TypeChart from './pages/TypeChart';
import Settings from './pages/Settings';
import Builder from './pages/Builder';
import { useEffect } from 'react';
import { initSettings } from './lib/settings/settingsStore';

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
            </ErrorBoundary>
          </main>

          <MobileNav />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
