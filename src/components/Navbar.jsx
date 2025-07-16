import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

const navItems = ["Game Info", "Media", "News", "Support", "esport"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu state

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const backgroundRef = useRef(null);
  const navLinksRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Handle smooth scroll to section
  const handleSmoothScroll = (sectionId) => {
    // Close mobile menu first
    setIsMobileMenuOpen(false);
    
    // Format the section ID properly
    let formattedId = sectionId.toLowerCase().replace(/\s+/g, '-');
    
    // Try different ID formats
    const possibleIds = [
      formattedId,
      sectionId.toLowerCase(),
      sectionId.toLowerCase().replace(/\s+/g, ''),
      sectionId
    ];
    
    let element = null;
    
    // Try to find the element with different ID formats
    for (const id of possibleIds) {
      element = document.getElementById(id);
      if (element) {
        console.log(`Found element with ID: ${id}`);
        break;
      }
    }
    
    // If still not found, try querySelector with class or other selectors
    if (!element) {
      const classSelector = `.${formattedId}`;
      element = document.querySelector(classSelector);
      if (element) {
        console.log(`Found element with class: ${classSelector}`);
      }
    }
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.warn(`Element not found for: ${sectionId}`);
      console.log('Available IDs:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
    }
  };

  // Handle mouse enter on navigation items
  const handleMouseEnter = (e) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const parentRect = navLinksRef.current.getBoundingClientRect();
    
    const x = rect.left - parentRect.left;
    const width = rect.width;
    
    gsap.to(backgroundRef.current, {
      x: x,
      width: width,
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Handle mouse leave from navigation container
  const handleMouseLeave = () => {
    gsap.to(backgroundRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Function to handle first user interaction
  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      // Start audio automatically after user interaction
      setTimeout(() => {
        setIsAudioPlaying(true);
        setIsIndicatorActive(true);
      }, 100);
    }
  };

  // Setup event listeners for user interaction
  useEffect(() => {
    const handleClick = () => handleUserInteraction();
    const handleScroll = () => handleUserInteraction();
    const handleKeyDown = () => handleUserInteraction();
    const handleTouchStart = () => handleUserInteraction();

    // Add event listeners
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      // Clean up event listeners
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [hasUserInteracted]);

  // Manage audio playback
  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaying) {
        audioElementRef.current.play().catch((error) => {
          console.log("Audio play failed:", error);
        });
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  // Handle scroll behavior for navbar visibility
  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // Animate navbar visibility
  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-2 z-50 h-14 border-none transition-all duration-700 sm:inset-x-6"
    >
      {/* Single audio element for the entire component */}
      <audio
        ref={audioElementRef}
        className="hidden"
        src="/audio/loop.mp3"
        loop
        preload="auto"
      />
      
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img 
              src="/img/logo.png" 
              alt="logo" 
              className="w-10 cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            <Button
              id="product-button"
              title="PLAY FOR FREE"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-red-50 hidden items-center justify-center gap-1 btn-clip md:flex hover:bg-white-100"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            {/* Desktop Navigation */}
            <div 
              ref={navLinksRef}
              className="hidden md:block relative"
              onMouseLeave={handleMouseLeave}
            >
              {/* Animated background */}
              <div 
                ref={backgroundRef}
                className="nav-animated-bg"
              />
              
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSmoothScroll(item.toLowerCase().replace(' ', '-'))}
                  className="nav-hover-btn-new cursor-pointer"
                  onMouseEnter={handleMouseEnter}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile: Play Button */}
            <Button
              id="mobile-product-button"
              title="PLAY FOR FREE"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-red-50 md:hidden items-center justify-center gap-1 btn-clip flex hover:bg-white-100 mr-4"
            />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex flex-col items-center justify-center w-8 h-8"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white mt-1 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
            </button>

            {/* Desktop Audio Button */}
            <button
              onClick={toggleAudioIndicator}
              className="hidden md:flex ml-10 items-center space-x-0.5 cursor-pointer"
            >
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden absolute top-full left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}>
          <div className="bg-black/90 backdrop-blur-sm border-t border-white/20">
            <div className="flex flex-col p-4 space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleSmoothScroll(item.toLowerCase().replace(' ', '-'))}
                  className="text-white text-left py-2 px-4 rounded hover:bg-white/10 transition-all duration-200 transform hover:translate-x-1"
                >
                  {item}
                </button>
              ))}
              
              {/* Mobile Audio Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={toggleAudioIndicator}
                  className="flex items-center space-x-2 cursor-pointer text-white text-sm hover:text-gray-300 transition-colors"
                >
                  <span>{isAudioPlaying ? 'SOUND ON' : 'SOUND OFF'}</span>
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={clsx("indicator-line", {
                          active: isIndicatorActive,
                        })}
                        style={{
                          animationDelay: `${bar * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;