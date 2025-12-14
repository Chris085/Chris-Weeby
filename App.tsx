import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { WhatIDo } from './pages/WhatIDo';
import { HowItWorks } from './pages/HowItWorks';
import { Proof } from './pages/Proof';
import { Examples } from './pages/Examples';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Footer = () => (
  <footer className="border-t border-white/10 py-12 bg-dark-bg text-center">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Chris Jeal. All rights reserved.
      </div>
      <div className="mt-4 flex justify-center gap-6 text-sm text-slate-600 items-center">
        <span>London, UK</span>
        <span>•</span>
        <Link to="/admin" className="hover:text-slate-400 transition-colors">Admin</Link>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-dark-bg text-slate-200 font-sans selection:bg-primary/30 selection:text-primary-hover">
        <Navbar />
        <main className="relative z-10">
           {/* Global background effects */}
           <div className="fixed inset-0 pointer-events-none z-[-1]">
             <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent opacity-50" />
           </div>
           
           <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/what-i-do" element={<WhatIDo />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/proof" element={<Proof />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
