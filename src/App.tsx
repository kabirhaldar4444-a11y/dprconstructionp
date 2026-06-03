/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'motion/react';
import { 
  Menu, X, ChevronDown, Globe, Award, Zap, Building2, 
  Truck, Factory, Cpu, Shield, Leaf, Users, Mail, 
  Phone, MapPin, ArrowRight, ExternalLink, Download,
  Briefcase, GraduationCap, Globe2, TrendingUp, BarChart3,
  HeartPulse, Database, Building, FlaskConical, ShieldCheck,
  Hotel, Pickaxe, Handshake, Check, ArrowLeft, Calendar,
  Tag, Clock, ChevronRight, Settings
} from 'lucide-react';
import { IMAGES, COLORS, NAV_LINKS } from './constants';
import { NEWS_ARTICLES } from './newsData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- Components ---

const Navbar = ({ onOpenMegaMenu }: { onOpenMegaMenu: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMouseEnter = (title: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(title);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    if (link.submenu) {
      e.preventDefault();
      setActiveDropdown(activeDropdown === link.title ? null : link.title);
    } else if (link.href?.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', link.href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setActiveDropdown(null);
    }
  };

  const handleSubLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      setActiveDropdown(null);
    } else if (href.startsWith('#')) {
      setActiveDropdown(null);
    }
  };

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-xl py-2' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
          window.history.pushState({}, '', '/');
          window.dispatchEvent(new PopStateEvent('popstate'));
          setActiveDropdown(null);
        }}>
          <img src={IMAGES.logo} alt="DPR Logo" className="h-20 w-auto" referrerPolicy="no-referrer" />
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <div 
              key={link.title} 
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter(link.title)}
              onMouseLeave={handleMouseLeave}
            >
              <a 
                href={link.href || '#'} 
                onClick={(e) => handleLinkClick(e, link)}
                className={`flex items-center gap-1 font-semibold text-sm uppercase tracking-wider transition-colors cursor-pointer ${isScrolled ? 'text-slate-900 hover:text-blue-700' : 'text-white hover:text-blue-300'}`}
              >
                {link.title}
                {link.submenu && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === link.title ? 'rotate-180' : ''}`} />}
              </a>
              
              <AnimatePresence>
                {link.submenu && activeDropdown === link.title && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-72 bg-[#F4F6F9] shadow-[0_10px_25px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden border border-slate-200/50 z-50"
                  >
                    {link.submenu.map((sub) => (
                      <a 
                        key={sub.title} 
                        href={sub.href}
                        onClick={(e) => handleSubLinkClick(e, sub.href)}
                        className="block px-6 py-4 text-[15px] font-semibold text-slate-800 hover:bg-[#E6F0FF] hover:text-blue-700 hover:pl-8 transition-all duration-200 border-b border-slate-200 last:border-0 focus:outline-none focus:bg-[#E6F0FF] focus:text-blue-700"
                      >
                        {sub.title}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <button 
            onClick={onOpenMegaMenu}
            className={`p-2 rounded-full transition-colors ${isScrolled ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
          >
            <Menu size={24} />
          </button>
        </div>

        <div className="lg:hidden">
           <button onClick={onOpenMegaMenu} className={isScrolled ? 'text-slate-900' : 'text-white'}>
             <Menu size={28} />
           </button>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [IMAGES.banner1, IMAGES.banner2, IMAGES.banner3, IMAGES.banner4, IMAGES.banner5];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-slate-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent z-10" />
          <img 
            src={slides[currentSlide]} 
            alt="Hero Banner" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 flex flex-col justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Building Infrastructure <br />
            <span className="text-blue-400">Beyond Borders</span>
          </h1>
          <p className="text-lg text-slate-200 mb-10 leading-relaxed max-w-2xl">
            A Redwood City, California-based global construction and engineering company delivering excellence in transport, power, mining, and high-rise infrastructure worldwide.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#business" className="px-8 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-sm transition-all flex items-center gap-2 group">
              Explore Our Projects
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/partner');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-bold rounded-sm transition-all"
            >
              Partner With Us
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button 
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1 transition-all duration-500 ${currentSlide === i ? 'w-12 bg-blue-500' : 'w-6 bg-white/30'}`}
          />
        ))}
      </div>
    </section>
  );
};

const StatCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center p-8 border-r border-slate-200 last:border-0">
      <div className="text-5xl font-bold text-blue-900 mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-500 uppercase tracking-widest text-xs font-bold">
        {label}
      </div>
    </div>
  );
};

const SectionHeading = ({ title, subtitle, light = false }: { title: string, subtitle?: string, light?: boolean }) => (
  <div className="mb-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4 mb-4"
    >
      <div className={`h-1 w-12 ${light ? 'bg-blue-400' : 'bg-blue-700'}`} />
      <span className={`uppercase tracking-[0.3em] text-xs font-bold ${light ? 'text-blue-300' : 'text-blue-700'}`}>
        DPR Construction
      </span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={`text-3xl md:text-4xl font-bold mb-6 ${light ? 'text-white' : 'text-slate-900'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={`max-w-2xl text-lg ${light ? 'text-slate-300' : 'text-slate-600'}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const MegaMenu = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-white overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-16">
              <div className="bg-slate-900 p-3 rounded-xl cursor-pointer" onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
                onClose();
              }}>
                <img src={IMAGES.logo} alt="Logo" className="h-16 w-auto brightness-0 invert" referrerPolicy="no-referrer" />
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={32} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h3 className="text-blue-900 font-bold uppercase tracking-widest text-sm mb-6 border-b pb-2">Company</h3>
                <ul className="space-y-4">
                  <li><a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="text-slate-600 hover:text-blue-700 font-medium">About Us</a></li>
                  <li><a href="/about/history" onClick={(e) => handleLinkClick(e, '/about/history')} className="text-slate-600 hover:text-blue-700 font-medium">History</a></li>
                  <li><a href="/about/leadership" onClick={(e) => handleLinkClick(e, '/about/leadership')} className="text-slate-600 hover:text-blue-700 font-medium">Leadership</a></li>
                  <li><a href="/about/global-presence" onClick={(e) => handleLinkClick(e, '/about/global-presence')} className="text-slate-600 hover:text-blue-700 font-medium">Global Offices</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-blue-900 font-bold uppercase tracking-widest text-sm mb-6 border-b pb-2">Business</h3>
                <ul className="space-y-4">
                  <li><a href="#business" onClick={(e) => handleLinkClick(e, '#business')} className="text-slate-600 hover:text-blue-700 font-medium">What We Build</a></li>
                  <li><a href="/what-we-build/healthcare" onClick={(e) => handleLinkClick(e, '/what-we-build/healthcare')} className="text-slate-600 hover:text-blue-700 font-medium">Health</a></li>
                  <li><a href="/what-we-build/hospitality" onClick={(e) => handleLinkClick(e, '/what-we-build/hospitality')} className="text-slate-600 hover:text-blue-700 font-medium">Hospitality</a></li>
                  <li><a href="/what-we-build/manufacturing" onClick={(e) => handleLinkClick(e, '/what-we-build/manufacturing')} className="text-slate-600 hover:text-blue-700 font-medium">Manufacturing</a></li>
                  <li><a href="/what-we-build/mission-critical" onClick={(e) => handleLinkClick(e, '/what-we-build/mission-critical')} className="text-slate-600 hover:text-blue-700 font-medium">Mission Critical</a></li>
                  <li><a href="/what-we-build/mining" onClick={(e) => handleLinkClick(e, '/what-we-build/mining')} className="text-slate-600 hover:text-blue-700 font-medium">Mining</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-blue-900 font-bold uppercase tracking-widest text-sm mb-6 border-b pb-2">Media & Impact</h3>
                <ul className="space-y-4">
                  <li><a href="/about/accomplishments" onClick={(e) => handleLinkClick(e, '/about/accomplishments')} className="text-slate-600 hover:text-blue-700 font-medium">Awards</a></li>
                  <li><a href="#news" onClick={(e) => handleLinkClick(e, '#news')} className="text-slate-600 hover:text-blue-700 font-medium">News & Insights</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-blue-900 font-bold uppercase tracking-widest text-sm mb-6 border-b pb-2">Careers & Contact</h3>
                <ul className="space-y-4">
                  <li><a href="/careers" onClick={(e) => handleLinkClick(e, '/careers')} className="text-slate-600 hover:text-blue-700 font-medium">Open Positions</a></li>
                  <li><a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="text-slate-600 hover:text-blue-700 font-medium">Office Locations</a></li>
                </ul>
              </div>
            </div>

            <div className="mt-24 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <div>
                 <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to build the future?</h2>
                 <p className="text-slate-600 mb-8">Join our global team of experts and work on some of the world's most challenging infrastructure projects.</p>
                 <button 
                  onClick={() => {
                    window.history.pushState({}, '', '/careers');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    onClose();
                  }}
                  className="px-8 py-4 bg-blue-900 text-white font-bold rounded-sm"
                >
                  View Opportunities
                </button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <img src={IMAGES.banner1} className="rounded-lg h-40 w-full object-cover" referrerPolicy="no-referrer" />
                 <img src={IMAGES.banner2} className="rounded-lg h-40 w-full object-cover" referrerPolicy="no-referrer" />
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Pages ---

const HomePage = () => {
  return (
    <main>
      <Hero />

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading 
                title="Building Infrastructure That Moves the World Forward" 
                subtitle="DPR Construction is a global engineering and infrastructure company committed to delivering technically complex and socially impactful projects across continents."
              />
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Since our founding in 1990, we have combined engineering precision, collaborative delivery models, and sustainable construction practices to shape transportation networks, energy systems, industrial facilities, and urban skylines worldwide.
                </p>
                <p>
                  We are builders, engineers, planners, and innovators united by a shared purpose — to build infrastructure that strengthens economies and improves communities. Our integrated approach brings together design excellence, advanced technology, and disciplined project execution to deliver value at every stage of development.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {[
                    "Culture of ownership",
                    "Transparent partnerships",
                    "Safety-first commitment",
                    "Innovation-driven methods",
                    "Integrated sustainability"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-900 font-semibold">
                      <div className="w-2 h-2 bg-blue-700 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>

                <p className="pt-6 font-bold text-blue-900 italic">
                  At DPR Construction, we do not simply construct projects — we build lasting relationships, resilient infrastructure, and sustainable futures.
                </p>

                <div className="pt-8">
                  <button 
                    onClick={() => {
                      window.history.pushState({}, '', '/about/history');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="px-8 py-4 bg-slate-900 text-white font-bold rounded-sm hover:bg-blue-900 transition-all flex items-center gap-2 group"
                  >
                    Learn More About Our Story
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img src={IMAGES.about_image} alt="About DPR" className="rounded-2xl shadow-2xl z-10 relative" referrerPolicy="no-referrer" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-900/10 rounded-full -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section id="business" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="What We Build" 
            subtitle="Diverse expertise across multiple infrastructure sectors, delivering complex projects with precision and innovation."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 'healthcare', icon: <HeartPulse />, title: "Health", desc: "State-of-the-art medical facilities and hospitals designed for patient care and clinical excellence." },
              { id: 'hospitality', icon: <Hotel />, title: "Hospitality", desc: "Luxury hotels, resorts, and entertainment venues delivering exceptional guest experiences." },
              { id: 'manufacturing', icon: <Factory />, title: "Manufacturing", desc: "Advanced industrial facilities and manufacturing plants optimized for production efficiency." },
              { id: 'mission-critical', icon: <Database />, title: "Mission Critical", desc: "High-performance data centers and critical infrastructure requiring 100% uptime." },
              { id: 'mining', icon: <Pickaxe />, title: "Mining", desc: "Complex mining infrastructure and heavy industrial engineering solutions." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl transition-all group border border-slate-100"
              >
                <div className="w-14 h-14 bg-slate-50 text-blue-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                  {React.cloneElement(item.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 mb-6">{item.desc}</p>
                <button 
                  onClick={() => {
                    window.history.pushState({}, '', `/what-we-build/${item.id}`);
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  }}
                  className="text-blue-700 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Collaborations */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <SectionHeading 
                title="Government & Institutional Partnerships in India" 
                subtitle="Strategic collaborations driving national development and infrastructure modernization across the Republic of India."
              />
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-blue-50 rounded-xl"><Zap className="text-blue-700" /></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Kovvada Nuclear Power Plant</h4>
                    <p className="text-slate-600">Strategic energy infrastructure in Andhra Pradesh, powering India's industrial growth.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-blue-50 rounded-xl"><Factory className="text-blue-700" /></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Reliance Jamnagar Refinery</h4>
                    <p className="text-slate-600">World-class industrial engineering for the world's largest oil refinery complex.</p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="p-4 bg-blue-50 rounded-xl"><Truck className="text-blue-700" /></div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Railway and Metro projects</h4>
                    <p className="text-slate-600">Historically well known for Delhi Metro consulting roles and similar work on other rail/metro programs.</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      window.history.pushState({}, '', '/about/india-partnerships');
                      window.dispatchEvent(new PopStateEvent('popstate'));
                    }}
                    className="flex items-center gap-2 text-blue-700 font-bold hover:text-blue-900 transition-colors group"
                  >
                    Read More
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={IMAGES.kovvada_nuclear} alt="Kovvada Nuclear Power Plant" className="rounded-2xl h-full object-cover shadow-lg" referrerPolicy="no-referrer" />
              <div className="space-y-4">
                <img src={IMAGES.navi_mumbai} alt="Navi Mumbai International Airport" className="rounded-2xl h-48 w-full object-cover shadow-lg" referrerPolicy="no-referrer" />
                <img src={IMAGES.jamnagar_refinery} alt="Reliance Jamnagar Refinery" className="rounded-2xl h-64 w-full object-cover shadow-lg" referrerPolicy="no-referrer" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section id="awards" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            light 
            title="Global Recognition for Excellence" 
            subtitle="Our commitment to quality, innovation, and sustainability has been recognized by leading industry bodies."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { year: "2023", title: "ENR Top 400 Contractors", org: "Engineering News-Record", desc: "Ranked #10 among the top 400 contractors in the United States, reflecting our scale and technical capability." },
              { year: "2024", title: "100 Best Companies to Work For", org: "Fortune Magazine", desc: "Recognized for the 15th consecutive year for our unique culture and commitment to our people." },
              { year: "2024", title: "Safety Excellence Award", org: "AGC of America", desc: "Honored for maintaining industry-leading safety standards across all our global project sites." },
            ].map((award, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white/5 p-10 rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="text-blue-400 font-bold text-4xl mb-6">{award.year}</div>
                <h3 className="text-2xl font-bold mb-2">{award.title}</h3>
                <div className="text-blue-300 uppercase tracking-widest text-xs font-bold mb-6">{award.org}</div>
                <p className="text-slate-400 leading-relaxed">{award.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Impact */}
      <section id="impact" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-5">
            <StatCounter value={500} label="Projects Completed" suffix="+" />
            <StatCounter value={25} label="Countries Served" suffix="+" />
            <StatCounter value={8000} label="Workforce" suffix="+" />
            <StatCounter value={3} label="Safe Man-Hours" suffix="M+" />
            <StatCounter value={12} label="Portfolio Value" suffix="B+" />
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section id="sustainability" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
             >
               <img src={IMAGES.sustainability} className="rounded-3xl shadow-2xl" referrerPolicy="no-referrer" />
             </motion.div>
             <div>
               <SectionHeading 
                 title="Engineering a Sustainable Future" 
                 subtitle="DPR Construction is committed to sustainable engineering practices, low-carbon solutions, environmentally responsible construction, and ESG-compliant project delivery worldwide."
               />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                   <Leaf className="text-emerald-700 mb-4" />
                   <h4 className="font-bold text-slate-900 mb-2">Net Zero 2040</h4>
                   <p className="text-sm text-slate-600">Our roadmap to achieve carbon neutrality across all global operations by 2040.</p>
                 </div>
                 <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                   <Shield className="text-blue-700 mb-4" />
                   <h4 className="font-bold text-slate-900 mb-2">ESG Leadership</h4>
                   <p className="text-sm text-slate-600">Strict adherence to environmental, social, and governance standards in every project.</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading 
            title="News & Insights" 
            subtitle="Stay updated with our latest project wins, technological breakthroughs, and global expansions."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {NEWS_ARTICLES.map((news, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => {
                  window.history.pushState({}, '', `/news/${news.slug}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer border border-slate-100"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-3 uppercase tracking-widest">
                    <Calendar size={12} />
                    {news.date}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-6 line-clamp-3 group-hover:text-blue-700 transition-colors leading-snug h-[4.5rem]">
                    {news.title}
                  </h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform flex items-center gap-2">
                      Read More <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

const CareersPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      alert("Please upload your resume before submitting.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading 
          title="Build Your Future With DPR Construction" 
          subtitle="Join a global community of innovators, engineers, and visionaries dedicated to building the world's most critical infrastructure."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Our Workplace Culture</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              At DPR Construction, we foster a positive and professional working atmosphere emphasizing safety, growth, diversity, and innovation. We believe that our people are our greatest asset, and we invest heavily in their success.
            </p>
            <ul className="space-y-4">
              {[
                { icon: <Shield size={20} />, title: "Safety Leadership", desc: "Uncompromising commitment to zero-harm workplace." },
                { icon: <TrendingUp size={20} />, title: "Growth & Development", desc: "Continuous learning and clear career progression paths." },
                { icon: <Users size={20} />, title: "Diversity & Inclusion", desc: "A global workforce representing over 50 nationalities." },
                { icon: <Globe size={20} />, title: "Global Mobility", desc: "Opportunities to work on projects across 5 continents." },
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Apply for a Position</h3>
            {isSubmitted ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 flex items-center gap-4">
                <Check size={24} className="text-green-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Application Submitted!</h4>
                  <p className="text-sm opacity-90">Thank you for applying. Our HR team will review your application and get back to you soon.</p>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+1 650 000 0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Country</label>
                    <select required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Select a country</option>
                      <option value="USA">USA</option>
                      <option value="India">India</option>
                      <option value="UAE">UAE</option>
                      <option value="Mexico">Mexico</option>
                      <option value="France">France</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Position Applying For</label>
                  <input type="text" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Senior Project Manager" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Upload Resume (PDF/DOC)</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                  />
                  <div 
                    onClick={triggerFileInput}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${fileName ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500'}`}
                  >
                    <Download className={`mx-auto mb-2 ${fileName ? 'text-green-600' : 'text-slate-400'}`} />
                    {fileName ? (
                      <p className="text-sm text-green-700 font-medium">Selected: {fileName}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Drag & drop your file here or click to browse</p>
                    )}
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">Submit Application</button>
              </form>
            )}
          </div>
        </div>

        <div className="bg-blue-900 text-white p-12 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">8,000+</div>
            <div className="text-blue-300 uppercase tracking-widest text-xs font-bold">Global Employees</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-blue-300 uppercase tracking-widest text-xs font-bold">Training Programs</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-blue-300 uppercase tracking-widest text-xs font-bold">Nationalities</div>
          </div>
        </div>
      </div>
    </main>
  );
};

const ContactPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const offices = [
    { city: "Redwood City, USA", type: "Global Headquarters", address: "1450 Veterans Blvd, Redwood City, CA 94063", phone: "+1 650 592 4800", email: "hq@dpr-construction.com", lat: 37.4852, lng: -122.2364 },
    { city: "Dubai, UAE", type: "Middle East Hub", address: "Level 45, Burj Daman, DIFC, Dubai", phone: "+971 4 321 0000", email: "dubai@dpr-construction.com", lat: 25.2120, lng: 55.2810 },
    { city: "Washington, USA", type: "North America Office", address: "1200 Pennsylvania Ave NW, Washington, DC 20004", phone: "+1 202 555 0123", email: "usa@dpr-construction.com", lat: 38.8954, lng: -77.0287 },
    { city: "Mumbai, India", type: "Asia Pacific HQ", address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051", phone: "+91 22 4000 0000", email: "india@dpr-construction.com", lat: 19.0660, lng: 72.8654 },
    { city: "Tokyo, Japan", type: "East Asia Office", address: "Marunouchi, Chiyoda City, Tokyo 100-0005", phone: "+81 3 0000 0000", email: "japan@dpr-construction.com", lat: 35.6812, lng: 139.7671 },
    { city: "Canberra, Australia", type: "Oceania Office", address: "15 Constitution Ave, Canberra ACT 2601", phone: "+61 2 0000 0000", email: "australia@dpr-construction.com", lat: -35.2809, lng: 149.1300 },
    { city: "Mexico City, Mexico", type: "Latin America Office", address: "Paseo de la Reforma 505, Cuauhtémoc, Mexico City", phone: "+52 55 5000 0000", email: "mexico@dpr-construction.com", lat: 19.4260, lng: -99.1729 },
  ];

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <SectionHeading 
            title="Get In Touch" 
            subtitle="Connect with our global offices or reach out for partnership opportunities."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-8">Send Us a Message</h3>
              {isSubmitted ? (
                <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 flex items-center gap-4">
                  <Check size={24} className="text-green-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Message Sent!</h4>
                    <p className="text-sm opacity-90">Thank you for reaching out. We will get back to you as soon as possible.</p>
                  </div>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Name" />
                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Email" />
                  </div>
                  <input type="text" required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Subject" />
                  <textarea rows={5} required className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your Message"></textarea>
                  <button type="submit" className="px-12 py-4 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 transition-colors">Send Message</button>
                </form>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-900 text-white p-8 rounded-3xl">
              <h3 className="text-xl font-bold mb-6">General Inquiries</h3>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Phone size={20} className="text-blue-300" />
                  <span>+912241520141</span>
                </div>
                <div className="flex gap-4 items-center">
                  <Phone size={20} className="text-blue-300" />
                  <span>+912241520142</span>
                </div>
                <div className="flex gap-4 items-center">
                  <Mail size={20} className="text-blue-300" />
                  <span>hrd@dprconstruction.in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <h3 className="text-3xl font-bold text-slate-900 mb-12">Our Global Offices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offices.map((office, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all"
              >
                <div className="text-blue-700 font-bold text-xl mb-1">{office.city}</div>
                <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-6">{office.type}</div>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex gap-3"><MapPin size={18} className="text-slate-400 shrink-0" /> {office.address}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Interactive World Map */}
        <div className="h-[500px] bg-slate-200 rounded-3xl overflow-hidden relative z-0">
          <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {offices.map((office, i) => (
              <Marker key={i} position={[office.lat, office.lng]}>
                <Popup>
                  <strong>{office.city}</strong><br />
                  <span className="text-xs text-slate-500 uppercase">{office.type}</span><br />
                  {office.address}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </main>
  );
};

const IndiaPartnershipsPage = () => {
  const projects = [
    { icon: <Zap />, title: "Kovvada Nuclear Power Plant", desc: "Strategic energy infrastructure in Andhra Pradesh, powering India's industrial growth.", image: IMAGES.kovvada_nuclear },
    { icon: <Factory />, title: "Reliance Jamnagar Refinery", desc: "World-class industrial engineering for the world's largest oil refinery complex.", image: "/reliance-jamnagar.jpeg" },
    { icon: <Globe2 />, title: "Navi Mumbai International Airport", desc: "A landmark aviation project enhancing connectivity for the Mumbai metropolitan region.", image: IMAGES.navi_mumbai },
    { icon: <Building2 />, title: "GIFT City Gujarat", desc: "Smart city utility tunnels and district cooling systems for India's first operational smart city in Gandhinagar.", image: "/gift-city-correct.png" },
    { icon: <Truck />, title: "Railway and Metro projects", desc: "Historically well known for Delhi Metro consulting roles and similar work on other rail/metro programs.", image: "/tunnel.jpg" },
    { icon: <Settings />, title: "Industrial Systems & Specialist Contracting", desc: "Precise installation, integration, and commissioning for complex industrial systems and refining packages.", image: IMAGES.india_industrial },
  ];

  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="text-blue-700 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
          <SectionHeading 
            title="India Strategic Partnerships" 
            subtitle="Comprehensive overview of our landmark projects and government collaborations across the Republic of India."
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-12 mb-16"
          >
            <div className="max-w-4xl">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                DPR Construction is an American construction company with an active presence in India, supporting projects through subcontracting and EPCM / PMC / General Consultant roles—helping teams manage, design, coordinate, and supervise project delivery to achieve stronger schedule, cost, safety, and quality outcomes.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                In addition, DPR works with partners as a technology licensor (particularly for refining and petrochemical applications) and also delivers specialist package contracting services for industrial systems, where precise installation, integration, and commissioning are critical.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                DPR’s engagement in India is further strengthened through an MoU with the Ministry of Housing and Urban Affairs (MoHUA), Government of India, reflecting a shared intent to support capability-building and collaboration aligned with India’s urban development priorities.
              </p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 border border-slate-200 rounded-2xl overflow-hidden shadow-2xl bg-white"
              >
                <div className="bg-slate-100 px-6 py-3 border-bottom border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">MoU Document: MoHUA & DPR Construction</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <iframe 
                  src="/mohua-dpr-agreement.pdf" 
                  title="MoU with Ministry of Housing and Urban Affairs" 
                  className="w-full h-[800px] border-none"
                />
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12 border border-slate-200 rounded-2xl overflow-hidden shadow-2xl bg-white"
              >
                <div className="bg-slate-100 px-6 py-3 border-bottom border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Project Reference: Strategic Infrastructure Development</span>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>
                <img 
                  src="https://lh3.googleusercontent.com/d/1uLdzPDpgFn2zHRiTCy9g4_6fhg0EfrjL" 
                  alt="Strategic Infrastructure Project Document" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="h-48 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="p-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-6">
                  {project.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{project.title}</h3>
                <p className="text-slate-600 leading-relaxed">{project.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

const Footer = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      window.history.pushState({}, '', href);
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.scrollTo(0, 0);
    } else if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.getElementById(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-slate-950 text-white pt-10 pb-6 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-10">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                Building Great Things.<br />
                <span className="text-blue-400">Everywhere.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md mb-6">
                DPR Construction is a Redwood City, California-based multinational engineering company delivering roads, metro, railway, power, mining, manufacturing, and high-rise infrastructure projects worldwide since 1990.
              </p>
              <div className="flex gap-6">
                <a href="https://www.linkedin.com/company/113341118/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">LinkedIn</a>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Company</h4>
              <ul className="space-y-4">
                {NAV_LINKS[0].submenu?.map((item) => (
                  <li key={item.title}>
                    <a href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="text-slate-400 hover:text-white transition-colors">{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Business</h4>
              <ul className="space-y-4">
                {NAV_LINKS[1].submenu?.map((item) => (
                  <li key={item.title}>
                    <a href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className="text-slate-400 hover:text-white transition-colors">{item.title}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400 mb-4">Support</h4>
              <ul className="space-y-4">
                <li><a href="/careers" onClick={(e) => handleLinkClick(e, '/careers')} className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" onClick={(e) => handleLinkClick(e, '/contact')} className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/partner" onClick={(e) => handleLinkClick(e, '/partner')} className="text-slate-400 hover:text-white transition-colors">Partner With Us</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-400 text-sm leading-relaxed">
          <div className="space-y-1">
            <p>+912241520141</p>
            <p>+912241520142</p>
            <p><a href="mailto:hrd@dprconstruction.in" className="hover:text-white transition-colors">hrd@dprconstruction.in</a></p>
          </div>
          <div>
            <p>Global HQ : 1450 Veterans Blvd,Redwood City, CA 94063 , USA</p>
          </div>
          <div>
            <p>Asia HQ : H-10 H Block , 10th Floor , Bandra Kurla Complex, Mumbai, Maharashtra<br />400051 ,India</p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} DPR Construction. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const ProjectDetailsPage = ({ sectorId }: { sectorId: string }) => {
  // ... (sectorData remains the same)
  const sectorData: Record<string, { title: string, description: string, projects: { name: string, location: string, image: string, details: string }[] }> = {
    'healthcare': {
      title: 'Healthcare Excellence',
      description: 'Building world-class medical facilities that prioritize patient care and clinical efficiency.',
      projects: [
        { name: 'UCSF Medical Center at Mission Bay', location: 'San Francisco, CA', image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop', details: 'A state-of-the-art 878,000-sq.-ft. hospital complex including children’s, women’s and cancer hospitals.' },
        { name: 'Mayo Clinic West Expansion', location: 'Phoenix, AZ', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop', details: 'Significant expansion of clinical and support space to enhance patient experience and care delivery.' }
      ]
    },
    'hospitality': {
      title: 'Hospitality & Entertainment',
      description: 'Creating immersive environments for luxury travel and world-class entertainment.',
      projects: [
        { name: 'JW Marriott Austin', location: 'Austin, TX', image: '/jw-marriott-austin.jpeg', details: 'The largest JW Marriott in North America, featuring 1,012 guest rooms and extensive meeting space.' },
        { name: 'The Walt Disney Family Museum', location: 'San Francisco, CA', image: 'https://images.unsplash.com/photo-1617139938955-92641dd1e6b3?q=80&w=1200&auto=format&fit=crop', details: 'A complex renovation of historic brick buildings into a high-tech museum space.' }
      ]
    },
    'manufacturing': {
      title: 'Advanced Manufacturing',
      description: 'Optimizing industrial spaces for high-tech production and operational excellence.',
      projects: [
        { name: 'Advanced Biopharmaceutical Facility', location: 'Holly Springs, NC', image: '/biopharma.png', details: 'Large-scale cell culture manufacturing facility with complex process piping and cleanroom environments.' },
        { name: 'High-Tech Electronics Plant', location: 'Austin, TX', image: '/electronics-plant.png', details: 'Fast-track construction of a semiconductor manufacturing facility with vibration-sensitive flooring.' }
      ]
    },
    'mission-critical': {
      title: 'Mission Critical Infrastructure',
      description: 'Delivering high-performance data centers with 100% reliability and uptime.',
      projects: [
        { name: 'Hyperscale Data Center Campus', location: 'Prineville, OR', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop', details: 'Multi-building data center campus featuring innovative cooling solutions and high-density power distribution.' },
        { name: 'Equinix SV10 Data Center', location: 'San Jose, CA', image: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?q=80&w=1200&auto=format&fit=crop', details: 'A premier colocation facility designed for maximum efficiency and interconnection density.' }
      ]
    },
    'mining': {
      title: 'Mining & Heavy Industrial',
      description: 'Engineering robust solutions for the most demanding industrial environments.',
      projects: [
        { name: 'Global Mining Operations Hub', location: 'Perth, Australia', image: 'https://images.unsplash.com/photo-1523848309072-c199db53f137?q=80&w=1200&auto=format&fit=crop', details: 'A centralized control and operations facility for remote mining sites across Western Australia.' },
        { name: 'Industrial Processing Plant', location: 'Salt Lake City, UT', image: 'https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?q=80&w=1200&auto=format&fit=crop', details: 'Complex structural and mechanical installation for a large-scale mineral processing facility.' }
      ]
    }
  };

  const data = sectorData[sectorId] || sectorData['healthcare'];

  return (
    <main className="pb-24">
      <div className="bg-slate-900 pt-40 pb-20 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="text-blue-400 font-bold flex items-center gap-2 mb-8 hover:gap-3 transition-all"
            >
              <ArrowRight size={18} className="rotate-180" /> Back to Home
            </button>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">{data.title}</h1>
            <p className="text-xl text-slate-300 max-w-3xl">{data.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {data.projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <img src={project.image} alt={project.name} className="w-full h-72 object-cover" referrerPolicy="no-referrer" />
              <div className="p-8">
                <div className="text-blue-700 font-bold text-sm uppercase tracking-widest mb-2">{project.location}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{project.name}</h3>
                <p className="text-slate-600 leading-relaxed">{project.details}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
};

const PartnerWithUsPage = () => {
  return (
    <main className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
            Collaboration & Growth
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8">
            Partner With Us
          </h1>
          <p className="text-2xl text-blue-700 font-medium mb-8">
            Building Powerful Partnerships That Shape the Future
          </p>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            At DPR Construction, we believe the best projects are built on trust, transparency, and shared ambition. Our partnerships go beyond contracts — they are long-term collaborations focused on delivering complex infrastructure solutions that transform communities and economies worldwide.
          </p>
        </motion.div>

        {/* Intro Text */}
        <div className="bg-slate-50 rounded-3xl p-12 mb-24 border border-slate-100">
          <p className="text-lg text-slate-700 leading-relaxed text-center max-w-3xl mx-auto">
            From highways and metro systems to power plants and industrial facilities, we work alongside visionary partners who share our commitment to excellence, safety, sustainability, and innovation.
          </p>
        </div>

        {/* Why Partner Section */}
        <div className="mb-24">
          <SectionHeading 
            title="Why Partner With DPR Construction?" 
            subtitle="We bring technical excellence and a collaborative spirit to every joint venture and alliance."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: "A Culture of Collaboration", 
                desc: "We foster open communication, integrated project delivery, and strong stakeholder alignment to ensure every partnership is built on mutual success."
              },
              { 
                title: "Global Infrastructure Expertise", 
                desc: "With operations across Europe, the Middle East, Asia, North America, and Latin America, we bring cross-border experience and technical excellence to every project."
              },
              { 
                title: "Performance-Driven Approach", 
                desc: "We combine engineering precision, financial strength, and risk-managed execution to consistently deliver on time and within budget."
              },
              { 
                title: "Sustainability & Innovation", 
                desc: "We integrate advanced construction technologies, digital modeling (BIM), green building practices, and energy-efficient engineering into every collaboration."
              },
              { 
                title: "Strong Government & MNC Network", 
                desc: "We actively collaborate with multinational corporations, public authorities, and infrastructure agencies on large-scale EPC and PPP projects."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partnership Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <Handshake className="text-blue-700" /> Partnership Opportunities
            </h2>
            <p className="text-slate-600 mb-8">We welcome collaboration in the following areas:</p>
            <ul className="space-y-4">
              {[
                "Joint Ventures (JV) & Strategic Alliances",
                "EPC & Turnkey Infrastructure Projects",
                "Public-Private Partnerships (PPP)",
                "Technology & Engineering Innovation Partners",
                "Material & Equipment Supply Chain Partners",
                "Sustainable Energy & Green Infrastructure Collaborations"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                  <div className="mt-1 bg-blue-100 text-blue-700 rounded-full p-1">
                    <Check size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Industries We Build Together</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Roads & Highways",
                "Metro & Railway Systems",
                "Power & Energy",
                "Oil & Gas Facilities",
                "Mining & Heavy Industrial",
                "High-Rise & Commercial",
                "Smart Cities"
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 px-6 py-4 rounded-xl border border-slate-100 text-slate-700 font-bold">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="bg-blue-900 text-white rounded-3xl p-12 mb-24 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-12">Our Commitment to Partners</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                "Transparent procurement processes",
                "Ethical business practices",
                "World-class safety standards",
                "ESG compliance and environmental responsibility",
                "Long-term value creation"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-lg">
                  <ShieldCheck className="text-blue-400 flex-shrink-0" size={28} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
              Our integrated delivery model ensures alignment from design through commissioning — minimizing risk and maximizing project outcomes.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-800/20 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Inquiry Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8">Partnership Inquiry</h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            We invite organizations, engineering firms, technology providers, and government bodies to explore collaboration opportunities with DPR Construction. Submit your partnership proposal and company profile through our secure portal, and our business development team will connect with you.
          </p>
          <div className="flex justify-center">
            <a 
              href="mailto:partnerships@dpr-construction.com" 
              className="px-10 py-5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-700/20 flex items-center gap-3"
            >
              <Mail size={24} />
              partnerships@dpr-construction.com
            </a>
          </div>
          <p className="mt-12 text-slate-500 font-medium italic">
            Together, we engineer infrastructure that powers nations and builds sustainable futures.
          </p>
        </div>
      </div>
    </main>
  );
};

const HistoryPage = () => {
  return (
    <main className="pb-24">
      <div className="bg-slate-900 pt-40 pb-20 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Our Journey of Growth and Impact</h1>
            <p className="text-xl text-slate-300 max-w-3xl">Founded in 1990 with a vision to build a different kind of construction company—one focused on innovation, collaboration, and exceptional customer service.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
            <p>
              Founded in 1990 by construction veterans Doug Woods, Peter Nosler, and Ron Davidowski, DPR Construction was created with a vision to build a different kind of construction company—one focused on innovation, collaboration, and exceptional customer service. The company's name comes from the initials of its three founders: D, P, and R.
            </p>
            <p>
              Starting with a small team of just 11 professionals and $750,000 in pooled resources, DPR quickly established itself as a trusted builder of complex and technically challenging projects. The company expanded rapidly by focusing on high-growth industries including healthcare, life sciences, advanced technology, higher education, mission-critical facilities, and commercial office construction.
            </p>
            <p>
              Throughout its history, DPR has been recognized for embracing innovation, sustainable building practices, and advanced construction technologies. The company was an early adopter of green building and has delivered numerous LEED-certified and net-zero energy projects across the United States and internationally.
            </p>
            <p>
              Today, DPR Construction is one of the largest employee-owned construction companies in the world, employing thousands of professionals and delivering billions of dollars in projects annually. Guided by its purpose of "Building Great Things", DPR continues to shape the future of construction through integrity, collaboration, and a commitment to excellence.
            </p>
          </div>
          <div className="bg-slate-100 rounded-3xl p-12 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Key Milestones</h3>
            <div className="space-y-8">
              {[
                { year: "1990", event: "Founded in France with a focus on transport infrastructure." },
                { year: "2010", event: "Expansion into Middle East and North Africa energy markets." },
                { year: "2015", event: "Establishment of Asia-Pacific headquarters in India." },
                { year: "2020", event: "Major milestone: Completion of 100th large-scale infrastructure project." },
                { year: "2024", event: "Pioneering sustainable engineering with low-carbon construction initiatives." }
              ].map((m, i) => (
                <div key={i} className="flex gap-6">
                  <div className="text-blue-700 font-bold text-xl shrink-0">{m.year}</div>
                  <div className="text-slate-600">{m.event}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const AccomplishmentsPage = () => {
  return (
    <main className="pb-24">
      <div className="bg-slate-900 pt-40 pb-20 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Delivering Excellence Across Borders</h1>
            <p className="text-xl text-slate-300 max-w-3xl">Our success is measured not only in projects completed, but in the long-term value created for our clients and communities.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            { title: "Landmark Infrastructure", desc: "Successfully delivered over 150 complex infrastructure projects globally, from high-speed rail to smart city networks." },
            { title: "MNC Partnerships", desc: "Trusted partner for Fortune 500 companies, delivering mission-critical facilities and industrial plants." },
            { title: "Government Collaborations", desc: "Active participant in Public-Private Partnerships (PPP) and large-scale EPC projects for national authorities." },
            { title: "Industry Recognition", desc: "Recipient of multiple awards for technical innovation, safety excellence, and sustainable design." },
            { title: "Safety Leadership", desc: "Maintaining industry-leading safety standards with millions of man-hours without lost-time incidents." },
            { title: "Sustainability Impact", desc: "Integrating green building practices and renewable energy solutions into 100% of our new developments." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-900 text-white rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Recognized for Excellence</h2>
          <div className="flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">2020</div>
              <div className="text-sm uppercase tracking-widest font-bold">Technical Innovation Award</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">2022</div>
              <div className="text-sm uppercase tracking-widest font-bold">Safety Excellence Award</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">2024</div>
              <div className="text-sm uppercase tracking-widest font-bold">Green Solutions Award</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const LeadershipPage = () => {
  return (
    <main className="pb-24">
      <div className="bg-slate-900 pt-40 pb-20 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Leadership Built on Experience and Integrity</h1>
            <p className="text-xl text-slate-300 max-w-3xl">Our executive team brings together global EPC experience and a strategic vision for sustainable growth.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-6 text-slate-700 text-lg leading-relaxed">
            <p>
              At DPR Construction, leadership is about more than just managing projects — it's about fostering a culture of ownership, accountability, and ethical governance. 
            </p>
            <p>
              Our executive leadership team possesses multidisciplinary expertise in engineering, finance, and project management, with a proven track record of delivering high-impact infrastructure across diverse global markets.
            </p>
            <p>
              We are committed to transparent partnerships and disciplined execution, ensuring that our strategic vision for sustainable global growth is realized through every project we undertake.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { role: "Executive Leadership", focus: "Global EPC Strategy" },
              { role: "Engineering Excellence", focus: "Technical Innovation" },
              { role: "Financial Strength", focus: "Risk-Managed Execution" },
              { role: "Ethical Governance", focus: "Compliance & Integrity" }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.role}</h3>
                <p className="text-blue-700 font-medium text-sm">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-24">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Executive Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Robert J. Miller", role: "Founder & Group Chairman" },
              { name: "William H. Anderson", role: "Chief Executive Officer" },
              { name: "Michael S. Thompson", role: "Chief Financial Officer (CFO)" },
              { name: "James D. Richardson", role: "Chief Operations Officer" },
              { name: "Sarah L. Williams", role: "Head of Human Resources" },
              { name: "David B. Clark", role: "Director of Global Projects" },
              { name: "Rajesh K. Sharma", role: "Head of Asia Pacific" },
              { name: "Christopher P. Evans", role: "Head of Middle East Hub" }
            ].map((leader, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-bold text-slate-900 mb-1">{leader.name}</h3>
                <p className="text-blue-700 text-sm font-medium">{leader.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const GlobalPresencePage = () => {
  return (
    <main className="pb-24">
      <div className="bg-slate-900 pt-40 pb-20 mb-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Engineering Across Continents</h1>
            <p className="text-xl text-slate-300 max-w-3xl">Headquartered in France with a robust network of global offices and active projects worldwide.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {[
            { city: "Paris, France", type: "Global Headquarters", desc: "Strategic hub for global operations and engineering excellence." },
            { city: "Dubai, UAE", type: "Middle East Hub", desc: "Leading complex infrastructure and energy projects across the region." },
            { city: "Washington, USA", type: "North America Office", desc: "Focusing on mission-critical and high-tech industrial facilities." },
            { city: "Mumbai, India", type: "Asia Pacific HQ", desc: "Driving large-scale transport and smart city developments." },
            { city: "Tokyo, Japan", type: "East Asia Office", desc: "Advancing high-tech manufacturing and sustainable urban solutions." },
            { city: "Canberra, Australia", type: "Oceania Office", desc: "Delivering innovative infrastructure and renewable energy projects." },
            { city: "Mexico City, Mexico", type: "Latin America Office", desc: "Expanding our footprint in emerging infrastructure markets." }
          ].map((office, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="text-blue-700 font-bold text-xl mb-2">{office.city}</div>
              <div className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-4">{office.type}</div>
              <p className="text-slate-600 text-sm leading-relaxed">{office.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-3xl p-12 border border-slate-100 mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Global Standards, Local Expertise</h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Our ability to deliver in diverse regulatory and environmental conditions is a testament to our adaptable engineering practices and strong local partnerships. Wherever we build, we build with purpose, precision, and partnership.
            </p>
            <div className="flex justify-center gap-4">
              <div className="px-6 py-3 bg-white rounded-full border border-slate-200 font-bold text-slate-900">25+ Countries</div>
              <div className="px-6 py-3 bg-white rounded-full border border-slate-200 font-bold text-slate-900">5 Continents</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const NewsDetailPage = ({ slug }: { slug: string }) => {
  const article = NEWS_ARTICLES.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="pt-40 pb-20 text-center">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <button 
          onClick={() => {
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
          className="mt-4 text-blue-600 hover:underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <main className="pt-20">
      {/* Breadcrumbs */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-slate-500">
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-medium">News & Insights</span>
          <ChevronRight size={14} />
          <span className="truncate max-w-[200px] md:max-w-none">{article.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded">
                {article.category}
              </span>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Calendar size={14} />
                {article.date}
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-900">Project Overview</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {article.overview}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-blue-600" />
                  Scope of Work
                </h3>
                <ul className="space-y-3">
                  {article.scope.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600">
                      <Check size={18} className="text-green-500 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-blue-600" />
                  Key Innovations
                </h3>
                <ul className="space-y-3">
                  {article.innovations.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-slate-200">
              <button 
                onClick={() => {
                  window.history.pushState({}, '', '/');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="flex items-center gap-2 text-blue-700 font-bold hover:gap-4 transition-all"
              >
                <ArrowLeft size={20} />
                Back to News & Insights
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold mb-6">Project Details</h3>
              <div className="space-y-6">
                {article.client && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Client</div>
                    <div className="text-slate-900 font-medium">{article.client}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</div>
                  <div className="text-slate-900 font-medium flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    {article.location}
                  </div>
                </div>
                {article.value && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Project Value</div>
                    <div className="text-slate-900 font-medium">{article.value}</div>
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Timeline</div>
                  <div className="text-slate-900 font-medium flex items-center gap-2">
                    <Clock size={16} className="text-blue-600" />
                    {article.timeline}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-900 p-8 rounded-2xl text-white">
              <h3 className="text-xl font-bold mb-4">Ready to build?</h3>
              <p className="text-blue-200 mb-6">
                Contact our technical experts to discuss your next mission-critical project.
              </p>
              <button 
                onClick={() => {
                  window.history.pushState({}, '', '/contact');
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
                className="w-full py-3 bg-white text-blue-900 font-bold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default function App() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentSector, setCurrentSector] = useState('');
  const [currentNewsSlug, setCurrentNewsSlug] = useState('');

  // Simple routing logic
  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (path === '/careers') {
        setCurrentPage('careers');
      } else if (path === '/contact') {
        setCurrentPage('contact');
      } else if (path === '/partner') {
        setCurrentPage('partner');
      } else if (path === '/about/history') {
        setCurrentPage('history');
      } else if (path === '/about/accomplishments') {
        setCurrentPage('accomplishments');
      } else if (path === '/about/leadership') {
        setCurrentPage('leadership');
      } else if (path === '/about/global-presence') {
        setCurrentPage('global-presence');
      } else if (path === '/about/india-partnerships') {
        setCurrentPage('india-partnerships');
      } else if (path.startsWith('/what-we-build/')) {
        setCurrentPage('project-details');
        setCurrentSector(path.split('/').pop() || '');
      } else if (path.startsWith('/news/')) {
        setCurrentPage('news-detail');
        setCurrentNewsSlug(path.split('/').pop() || '');
      } else {
        setCurrentPage('home');
      }
      window.scrollTo(0, 0);
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, []);

  return (
    <div className="font-sans text-slate-900 bg-white selection:bg-blue-100 selection:text-blue-900">
      <Navbar onOpenMegaMenu={() => setIsMegaMenuOpen(true)} />
      <MegaMenu isOpen={isMegaMenuOpen} onClose={() => setIsMegaMenuOpen(false)} />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'careers' && <CareersPage />}
      {currentPage === 'contact' && <ContactPage />}
      {currentPage === 'partner' && <PartnerWithUsPage />}
      {currentPage === 'history' && <HistoryPage />}
      {currentPage === 'accomplishments' && <AccomplishmentsPage />}
      {currentPage === 'leadership' && <LeadershipPage />}
      {currentPage === 'global-presence' && <GlobalPresencePage />}
      {currentPage === 'india-partnerships' && <IndiaPartnershipsPage />}
      {currentPage === 'project-details' && <ProjectDetailsPage sectorId={currentSector} />}
      {currentPage === 'news-detail' && <NewsDetailPage slug={currentNewsSlug} />}

      <Footer />
    </div>
  );
}
