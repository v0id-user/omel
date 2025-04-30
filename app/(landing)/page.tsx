'use client';

import { useEffect } from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import Footer from '@/components/landing/Footer';
import { cn } from '@/lib/utils';
import React from 'react';

const Index = () => {
  useEffect(() => {
    // Add smooth scrolling to the document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Animate elements as they scroll into view
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    // Add custom scrollbar styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: #222;
        border-radius: 4px;
        transition: background 0.2s ease;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: #000;
      }
      
      /* Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: #222 rgba(0, 0, 0, 0.05);
      }
      
      /* Enhanced smooth scrolling */
      html {
        scroll-behavior: smooth;
      }
      
      /* For Safari and other browsers that don't support scroll-behavior */
      @supports not (scroll-behavior: smooth) {
        html, body {
          scroll-behavior: auto;
        }
      }
    `;
    document.head.appendChild(styleElement);

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.fade-up').forEach(el => {
        observer.unobserve(el);
      });

      // Clean up the custom scrollbar styles
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }

      // Reset scroll behavior
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
      <div
        className={cn(
          'absolute inset-0',
          '[background-size:50px_50px]',
          '[background-image:linear-gradient(to_right,#E6E4E4_1px,transparent_1px),linear-gradient(to_bottom,#E6E4E4_1px,transparent_1px)]'
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_5%,black)]"></div>
      <div className="relative inset-0">
        <Navbar />
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
