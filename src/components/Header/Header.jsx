import React, { useState, useRef, useEffect } from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';
import glow from '../../assets/glow.png';
import logo from '../../assets/logo.png';
// Nav links
const NAV_LINKS = [
  { href: 'https://www.tedxdypdpu.com/about', label: 'ABOUT' },
  { href: 'https://www.tedxdypdpu.com/team', label: 'TEAM' },
  { href: '#', label: 'GET TICKETS' },
  { href: 'https://www.tedxdypdpu.com/#contact', label: 'CONTACT' },
  { href: 'https://www.tedxdypdpu.com/sponsors', label: 'SPONSORS' },
];


function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileNavRef = useRef(null);

  // Prevent background scroll when mobile nav is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close mobile nav on hash change / back
  useEffect(() => {
    const handleRouteChange = () => setMobileOpen(false);
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e) {
      if (mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [mobileOpen]);

  return (
    <header className="flex items-center justify-between p-6 lg:px-12 relative z-30">
      <div className="flex items-center flex-1">
        <a href="/" className="">
          <img
            src={logo}
            alt="TEDx DYPCOE"
            className="lg:w-[250px] w-[75%]"
          />
        </a>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center space-x-8">
        {NAV_LINKS.map((link) => (
          <li key={link.label} className="nav-link text-white underline-right py-3 list-none">
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </nav>

      {/* Mobile Ticket Button
      <a href="#">
        <button className="mr-5 bg-red-600 text-white px-4 py-[5px] rounded-md lg:hidden">
          Get Tickets
        </button>
      </a> */}

      {/* Hamburger */}
      <button
        className="lg:hidden flex flex-col justify-center items-center w-10 h-10 z-40 relative"
        aria-label="Open navigation menu"
        onClick={() => setMobileOpen(true)}
      >
        <span
          className={`block w-7 h-0.5 bg-white mb-1.5 rounded transition-all duration-300 ${
            mobileOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block w-7 h-0.5 bg-white mb-1.5 rounded transition-all duration-300 ${
            mobileOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-7 h-0.5 bg-white rounded transition-all duration-300 ${
            mobileOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 99 }}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Nav */}
      <nav
        ref={mobileNavRef}
        className={`fixed top-0 left-0 h-full w-full max-w-full bg-gradient-to-b from-black via-[#000] to-[#222] text-white
        flex flex-col items-center justify-between
        transition-transform duration-400
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
        z-[100]
        px-8 py-10`}
        style={{
          transitionProperty: 'transform',
          transitionDuration: '400ms',
        }}
        aria-modal={mobileOpen}
        role="dialog"
      >
        {/* Close Button */}
        <button
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center z-50 hover:bg-white/10 rounded-full transition"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            className="text-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="7"
              y1="7"
              x2="21"
              y2="21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="21"
              y1="7"
              x2="7"
              y2="21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Nav Links */}
        <ul className="flex flex-col gap-8 text-3xl font-bold w-full items-center mt-14">
          {NAV_LINKS.map((link) => (
            <li
              key={link.label}
              className="nav-link py-3 text-center text-white w-full list-none"
            >
              <a
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block w-full hover:text-red-500 transition-colors duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Socials */}
        <div className="flex flex-col items-center gap-4 mt-12 mb-2 w-full">
          <div className="flex gap-6 justify-center">
            <a
              href="https://www.instagram.com/tedxdypdpu/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-lg"
            >
              <Instagram />
            </a>
            <a
              href="https://m.youtube.com/@tedxdypdpu2025"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-lg"
            >
              <Youtube />
            </a>
            <a
              href="https://www.linkedin.com/company/tedxdypdpu/about/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white text-lg"
            >
              <Linkedin />
            </a>
          </div>
          <span className="text-xs text-white/60 mt-2">Follow us</span>
        </div>
      </nav>

      {/* Glow background */}
      <img
        src={glow}
        alt="Glow Png"
        className="-z-50 absolute top-0 left-0 pointer-events-none"
        style={{ width: '900px', height: '500px' }}
      />
    </header>
  );
}

export default Header;
