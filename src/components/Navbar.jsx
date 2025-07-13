import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

const navItems = ["Game Info", "Media", "News", "Support", "esport"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(true); // Changed to true for auto-start
  const [isIndicatorActive, setIsIndicatorActive] = useState(true); // Changed to true for auto-start

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

  // Handle smooth scroll to section
  const handleSmoothScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
      duration: 0.1,
      ease: "power2.out",
    });
  };

  // Handle mouse leave from navigation container
  const handleMouseLeave = () => {
    gsap.to(backgroundRef.current, {
      opacity: 0,
      duration: 0.1,
      ease: "power2.out",
    });
  };

  // Auto-start audio when component mounts
  useEffect(() => {
    const playAudio = async () => {
      try {
        if (audioElementRef.current) {
          await audioElementRef.current.play();
        }
      } catch (error) {
        // Handle autoplay restrictions
        console.log("Autoplay was prevented:", error);
        // If autoplay fails, reset the states
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    };

    // Small delay to ensure audio element is ready
    const timer = setTimeout(playAudio, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play().catch((error) => {
        console.log("Audio play failed:", error);
      });
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

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

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.1,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-2 z-50 h-14 border-none transition-all duration-700 sm:inset-x-6"
    >
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
              containerClass="bg-red-50 md:flex hidden items-center justify-center gap-1 btn-clip hover:bg-white-100"
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div 
              ref={navLinksRef}
              className="hidden md:block relative"
              onMouseLeave={handleMouseLeave}
            >
              {/* Animated background */}
              <div 
                ref={backgroundRef}
                className="nav-animated-bg "
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

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5 cursor-pointer"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
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
      </header>
    </div>
  );
};

export default NavBar;