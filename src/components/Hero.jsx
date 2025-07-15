import gsap from "gsap";

import { useGSAP } from "@gsap/react";
import { useState, useRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { ScrollTrigger } from "gsap/all";

import Button from "./Button";
import RoundedBorder from "./RoundedBorder"

gsap.registerPlugin(ScrollTrigger)
 
const Hero = () => {

	const [currentIndex, setCurrentIndex] = useState(1);
	const [hasClicked, setHasClicked] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [loadedVideos, setLoadedVideos] = useState(0);
	const [isScrolled, setIsScrolled] = useState(false); // State untuk tracking scroll
	const [isAnimating, setIsAnimating] = useState(false); // State untuk mencegah spam klik

	const totalVideos = 4;
	const nextVideoRef = useRef(null);

  const videoTitles = ["IGnITIOn", "REFLECTION", "REVELATION", "COLLISION"];
  const [videoTitle, setVideoTitle] = useState(videoTitles[0]);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  }

  // animasi tulisan bergerak kekanan
  useEffect(() => {
    if (!hasClicked) return;
    const titleEl = document.getElementById("video-title");
    if (!titleEl) return;

    gsap.to(titleEl, {
      x: 100,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        titleEl.innerHTML = videoTitles[currentIndex - 1]; // karena index mulai dari 1
        gsap.fromTo(
          titleEl,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  }, [currentIndex,hasClicked]);

  const maskRef = useRef(null);

  // Untuk animasi gerak mengikuti mouse
  useEffect(() => {
    const el = maskRef.current;
    let breathingTween = null;
    let lastMouseX = null;
    let lastMouseY = null;
    let isHovering = false;

    const startBreathing = () => {
      if (!breathingTween) {
        breathingTween = gsap.to(el, {
          scale: 0.85,
          duration: 0.65,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    };

    const stopBreathing = () => {
      if (breathingTween) {
        breathingTween.kill();
        breathingTween = null;
        gsap.to(el, { scale: 1, duration: 0.3 });
      }
    };

    const handleMouseMove = (e) => {
      // Jangan jalankan animasi mouse jika sudah scroll
      if (isScrolled) return;
      
      isHovering = true;
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = e.clientX - left - width / 2;
      const y = e.clientY - top - height / 2;

      lastMouseX = e.clientX;
      lastMouseY = e.clientY;

      stopBreathing();

      gsap.to(el, {
        x: x * 0.5,
        y: y * 0.5,
        rotateX: -y * 0.15,
        rotateY: x * 0.15,
        ease: "power2.out",
        duration: 1.7,
      });
    };

    const handleMouseLeave = () => {
      if (isScrolled) return;
      
      isHovering = false;
      stopBreathing();

      gsap.to(el, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        ease: "power2.out",
        duration: 0.5,
      });
    };

    // Cek setiap 1 detik apakah posisi mouse tetap (berarti idle)
    const interval = setInterval(() => {
      if (!isHovering || isScrolled) return;

      const currentMouseX = lastMouseX;
      const currentMouseY = lastMouseY;

      if (
        currentMouseX !== null &&
        currentMouseY !== null &&
        currentMouseX === lastMouseX &&
        currentMouseY === lastMouseY
      ) {
        startBreathing();
      }
    }, 300);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(interval);
      stopBreathing();
    };
  }, [isScrolled]);

  // animasi load video
  useEffect(() => {
    if(loadedVideos === totalVideos - 1){
      setIsLoading(false);
    }
  })
  // 0 % 4 = 0 + 1 = 1
  const upcomingVideoindex = (currentIndex % totalVideos) + 1;

  
	const handleMiniVdClick = () => {
    // Cegah klik jika sudah scroll atau sedang animasi
    if (isScrolled || isAnimating) return;
    
    if (nextVideoRef.current.readyState >= 3) {
      setIsAnimating(true); // Set animating ke true
      setHasClicked(true);
      setCurrentIndex(upcomingVideoindex);
      setVideoTitle(videoTitles[upcomingVideoindex - 1]);
    } else {
      // Tunggu sampai ready
      nextVideoRef.current.oncanplay = () => {
        setIsAnimating(true); // Set animating ke true
        setHasClicked(true);
        setCurrentIndex(upcomingVideoindex);
      };
    }
  };

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`
  
  useGSAP( () => {
      if(hasClicked){
        gsap.set('#next-video', {visibility: 'visible'});
        gsap.to('#next-video',{
          transformOrigin:  'center center',
          scale: 1,
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power2.out',
          onStart: () => nextVideoRef.current.play(),
          onComplete: () => {
            // Set animating ke false setelah animasi selesai
            setIsAnimating(false);
          }
        });
        gsap.from('#current-video',{
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: 'power2.out',
        });
      }
    },
    {
      dependencies: [currentIndex],
      revertOnUpdate: true,
    }
  );

  // SOLUSI 1: Menggunakan Timeline (Recommended)
  useGSAP(() => {
    // Buat timeline utama
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom top", // End point untuk keseluruhan animasi
        scrub: true,
        // markers: true, // Uncomment untuk debugging
        onUpdate: (self) => {
          // Set isScrolled ke true ketika scroll progress > 0
          if (self.progress > 0) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }
        }
      }
    });

    // Kondisi awal
    gsap.set("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });

    // Tahap 1: kotak -> bentuk pertama
    tl.to("#video-frame", {
      clipPath: "polygon(20% 0%, 80% 0%, 100% 95%, 0 100%)",
      ease: "power1.inOut",
      duration: 1,
    })
    
    // Tahap 2: bentuk pertama -> bentuk kedua
    .to("#video-frame", {
      clipPath: "polygon(28% 10%, 72% 9%, 84% 79%, 10% 83%)",
      ease: "power1.inOut",
      duration: 1,
    });
  });
  
  return (
    <div className="relative h-dvh w-screen overflow-x-hidden ">
      { isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>     
      )}
			<div 
        id="video-frame" 
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
      >
				<div>
					<div 
            ref={maskRef} 
            className={`mask-clip-path border-black absolute-center absolute z-50 size-64 overflow-hidden rounded-lg rounded-border ${
              isScrolled ? 'pointer-events-none' : 'cursor-pointer'
            }`}
          >
						<div 
              onClick={handleMiniVdClick} 
              className={`origin-center scale-50 opacity-0 transition-all duration-500 ease-in ${
                !isScrolled ? 'hover:scale-100 hover:opacity-100' : ''
              }`}
            >
							<video
                ref={nextVideoRef}
                src={getVideoSrc(upcomingVideoindex)}
                loop
                muted
                id="current-video"
                className="size-64 origin-center scale-80 object-cover object-center"
                onLoadedData={handleVideoLoad}
							/>
						</div>
          </div>
          <RoundedBorder />

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
          
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center"
            onLoadedData={handleVideoLoad}
          />
				</div>
        <h1 id="video-title" className="special-font hero-heading absolute bottom-5 right-5 z-40 text-white-100">
          IGnITIOn
        </h1>
        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-white-100">
              vALORanT
            </h1>
            <p className="mb-5 max-w-64 font-robert-regular text-white-100">
              Learn. Aim. Dominate the Game. <br /> Step into each match with skill and strategy.
            </p>
            <Button
              id="watch-trailer"
              title="Watch trailer"
              rightIcon={<TiLocationArrow />}
              containerClass="btn-clip bg-red-50 flex-center px-6 py-3 hover:bg-white-100"
            />
          </div>
        </div>
			</div>
      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        {videoTitle}
      </h1>
	  </div>
  )
}

export default Hero