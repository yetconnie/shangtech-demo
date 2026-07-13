'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const navigation = [
  { name: '产品', href: '/#products' },
  { name: '案例', href: '/#cases' },
  { name: '洞察', href: '/#insights' },
  { name: '投资者', href: '/#investors' },
  { name: '联系', href: '/#contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container-custom header-inner">
        <Link href="/" className="logo">
          <span className="logo-mark">S</span>
          <span className="logo-text">ShangTech</span>
        </Link>

        <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
          {navigation.map((item) => (
            <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
