import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', active: true },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Menu', href: '#menu' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      id="main-nav"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.06] py-4 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          className="group flex items-center gap-3 tracking-[0.22em] text-white transition-opacity duration-300 hover:opacity-90"
        >
          {/* Subtle Embers Mark */}
          <div className="w-8 h-8 rounded-sm border border-[#C1121F]/40 bg-gradient-to-br from-[#1c0809] to-[#080808] flex items-center justify-center transition-colors duration-300 group-hover:border-[#C1121F]">
            <span className="w-2 h-2 rounded-full bg-[#C1121F] shadow-[0_0_10px_#FF4500]"></span>
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-lg md:text-xl font-bold tracking-[0.25em] text-white">
              GRILL ISLAND
            </span>
            <span className="text-[9px] tracking-[0.35em] text-[#C1121F] uppercase font-medium -mt-0.5">
              Fine Hearth & Smoke
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs uppercase tracking-[0.22em] transition-all duration-300 relative py-1 ${
                link.active
                  ? 'text-white font-medium after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#C1121F]'
                  : 'text-neutral-400 hover:text-white after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C1121F] hover:after:w-full after:transition-all after:duration-300'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden text-neutral-300 hover:text-white p-2 transition-colors focus:outline-none"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-x-0 top-[73px] bg-[#080808]/98 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-500 overflow-hidden ${
          mobileMenuOpen ? 'max-h-80 opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="flex flex-col items-center gap-5 px-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs uppercase tracking-[0.25em] text-neutral-300 hover:text-[#C1121F] transition-colors py-1"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
