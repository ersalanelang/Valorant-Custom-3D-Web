import gsap from "gsap";
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [isScrollAnimationActive, setIsScrollAnimationActive] = useState(false);
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);
  const polygonRef = useRef(null);

  // Fungsi untuk mengecek apakah point berada di dalam polygon
  const isPointInPolygon = (x, y, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0];
      const yi = polygon[i][1];
      const xj = polygon[j][0];
      const yj = polygon[j][1];
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Fungsi untuk mengkonversi persentase clip-path ke koordinat pixel
  const getPolygonCoordinates = (element) => {
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Koordinat polygon dari CSS: polygon(25% 15%, 90% 0%, 75% 85%, 10% 100%)
    return [
      [width * 0.25, height * 0.15], // 25% 15%
      [width * 0.90, height * 0.00], // 90% 0%
      [width * 0.75, height * 0.85], // 75% 85%
      [width * 0.10, height * 1.00], // 10% 100%
    ];
  };

  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.3,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          // Nonaktifkan animasi mouse selama scroll berlangsung
          setIsScrollAnimationActive(self.progress > 0);
        },
        onToggle: (self) => {
          // Jika animasi scroll baru saja AKTIF, reset posisi elemen
          if (self.isActive) {
            gsap.killTweensOf(polygonRef.current);
            gsap.set(polygonRef.current, {
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
            });
          }
        },
        onComplete: () => {
          // Tandai bahwa animasi scroll telah selesai permanen
          setIsAnimationCompleted(true);
          setIsScrollAnimationActive(false);
        },
      },
    });

    // Pastikan elemen dimulai dari posisi center sebelum animasi clip-path
    clipAnimation.set(polygonRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });

    clipAnimation.to(".mask-clip-path", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  // useEffect untuk animasi mouse
  useEffect(() => {
    const el = polygonRef.current;
    if (!el) return;

    const handleMouseMove = (e) => {
      // JANGAN jalankan animasi mouse jika animasi scroll aktif ATAU sudah selesai
      if (isScrollAnimationActive || isAnimationCompleted) return;

      const imageElement = el.querySelector('.about-image');
      if (!imageElement) return;

      const rect = imageElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Cek apakah mouse berada di dalam polygon
      const polygonCoords = getPolygonCoordinates(imageElement);
      if (!isPointInPolygon(x, y, polygonCoords)) {
        return; // Mouse di luar polygon, tidak jalankan animasi
      }

      gsap.killTweensOf(el);
      const containerRect = el.getBoundingClientRect();
      const centerX = e.clientX - containerRect.left - containerRect.width / 2;
      const centerY = e.clientY - containerRect.top - containerRect.height / 2;

      gsap.to(el, {
        x: centerX * 0.1,
        y: centerY * 0.1,
        rotateX: -centerY * 0.05,
        rotateY: centerX * 0.05,
        ease: "power2.out",
        duration: 1.5,
      });
    };

    const handleMouseLeave = () => {
      // JANGAN jalankan animasi mouse jika animasi scroll aktif ATAU sudah selesai
      if (isScrollAnimationActive || isAnimationCompleted) return;
      
      gsap.killTweensOf(el);
      gsap.to(el, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        ease: "power2.out",
        duration: 0.7,
      });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, [isScrollAnimationActive, isAnimationCompleted]);

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-Valorant text-sm md:text-[11px]">
          Welcome to vALORANT
        </p>

        <AnimatedTitle
          title="A 5v5 t<b>a</b>ctical sho<b>o</b>ter featuring <br /> agents <b>w</b>ith unique abili<b>t</b>ies"
          containerClass="special-font text-7xl text-[82px] mt-5 !text-black text-center "
        />

        <div >
          <p className="about-subtext">DEFY THE LIMITS</p>
          <p className="about-subsubtext text-gray-700">
            Blend your style and experience on a global, competitive stage. You have 13 rounds to attack and defend your side using sharp gunplay and tactical abilities. And, with one life per-round, you&rsquo;ll need to think faster than your opponent if you want to survive. Take on foes across Competitive and Unranked modes as well as Deathmatch and Spike Rush.
          </p>
        </div>
      </div>

      <div ref={polygonRef} className="h-dvh w-screen " id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/entrance3.webp"
            alt="Background"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default About;