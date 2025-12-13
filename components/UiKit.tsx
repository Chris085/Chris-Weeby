import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';

// --- Buttons ---

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  to?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  icon,
  className = '',
  to,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-transparent",
    secondary: "bg-white/10 text-white hover:bg-white/15 backdrop-blur-md border border-white/10",
    outline: "bg-transparent border border-white/20 text-slate-300 hover:text-white hover:border-primary/50",
    ghost: "bg-transparent text-slate-400 hover:text-primary hover:bg-white/5",
  };

  const sizes = {
    sm: "text-sm px-3 py-1.5 gap-2",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-3",
  };

  const content = (
    <>
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!isLoading && children}
      {!isLoading && icon && <span className="group-hover:translate-x-1 transition-transform duration-300">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading} {...props}>
      {content}
    </button>
  );
};

// --- Cards ---

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden
        bg-dark-card backdrop-blur-md border border-dark-border
        rounded-xl p-6
        ${hoverEffect ? 'hover:border-primary/30 hover:shadow-[0_4px_30px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all duration-300' : ''}
        ${className}
      `}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

// --- Section Wrapper ---

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  fullHeight?: boolean;
}

export const Section: React.FC<SectionProps> = ({ children, className = '', id, fullHeight }) => {
  return (
    <section 
      id={id} 
      className={`
        relative w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 
        ${fullHeight ? 'min-h-screen flex flex-col justify-center' : ''} 
        ${className}
      `}
    >
      <div className="max-w-7xl mx-auto w-full">
        {children}
      </div>
    </section>
  );
};

// --- Typography ---

export const Heading: React.FC<{ children: React.ReactNode, level?: 1 | 2 | 3, className?: string }> = ({ children, level = 2, className = '' }) => {
  const styles = "font-sans tracking-tight text-white";
  if (level === 1) return <h1 className={`text-4xl md:text-6xl font-bold leading-tight ${styles} ${className}`}>{children}</h1>;
  if (level === 2) return <h2 className={`text-3xl md:text-4xl font-semibold ${styles} ${className}`}>{children}</h2>;
  return <h3 className={`text-xl md:text-2xl font-medium ${styles} ${className}`}>{children}</h3>;
};

export const Text: React.FC<{ children: React.ReactNode, className?: string, size?: 'sm' | 'base' | 'lg' }> = ({ children, className = '', size = 'base' }) => {
  const sizes = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed",
    lg: "text-lg leading-relaxed",
  };
  return <p className={`text-slate-400 font-light ${sizes[size]} ${className}`}>{children}</p>;
};