import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sheet } from 'lucide-react';
import { Button } from './UiKit';

const navItems = [
  { label: 'What I Do', path: '/what-i-do' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Proof', path: '/proof' },
  { label: 'Examples', path: '/examples' },
  { label: 'About', path: '/about' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled || mobileMenuOpen ? 'bg-dark-bg/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent border-transparent'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
              CJ
            </div>
            <span className="text-white font-medium tracking-wide">Chris Jeal</span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-slate-400 hover:text-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button size="sm" variant="primary" to="/contact">
              Review a Spreadsheet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-dark-bg/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col space-y-4 shadow-2xl">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-base font-medium ${
                  isActive ? 'bg-white/10 text-primary' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <div className="pt-4 border-t border-white/10">
            <Button to="/contact" className="w-full">
              Review a Spreadsheet
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};