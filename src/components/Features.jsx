import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({ src, title, description, isComingSoon, videoStyle, isVideo = false }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      {/* PERUBAHAN: Conditional rendering untuk video atau image */}
      {isVideo ? (
        <video
          src={src}
          loop
          muted
          autoPlay
          className="absolute left-0 top-0 size-full object-cover"
          style={videoStyle}
        />
      ) : (
        <img
          src={src}
          alt="Bento card media"
          className="absolute left-0 top-0 size-full object-cover"
          style={videoStyle}
        />
      )}
      
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => (
  <section className="bg-black pb-35">
    <div className="container mx-auto px-3 md:px-30">
      <div className="px-5 py-20">
        <p className="font-circular-web text-lg text-blue-50">
          Into the Tactical Realm
        </p>
        <p className="max-w-md font-circular-web text-lg text-left text-blue-50 opacity-50">
          Immerse yourself in Valorant&rsquo;s shifting battlefield, where strategy, precision, and every decision shape your path to mastery.
          Each round is a story, written by your aim, your choices, and your growth as an agent.
        </p>
      </div>

      <BentoTilt className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src="videos/feature-1.mp4"
          title={
            <>
              n<b>e</b>ws
            </>
          }
          description="Stay updated with the latest Valorant patches, meta shifts, and global tournament highlights"
          isComingSoon
          isVideo={true} 
        />
      </BentoTilt>

      <div className="grid h-[170vh] grid-cols-2 grid-rows-5 gap-7 md:grid-rows-3 md:h-[140vh]">
        <BentoTilt className="bento-tilt_1 col-span-2 md:col-span-1 md:row-span-2">
          <BentoCard
            src="videos/feature-2.mp4"
            title={
              <>
                ag<b>e</b>nts
              </>
            }
            description="choose a unique Agent with swift, adaptive, and lethal abilities that amplify your gunplay"
            isComingSoon
            isVideo={true}
            videoStyle={{
              objectPosition: '47% center',
              transform: 'scale(1.4) translateY(14%)'
            }}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-2 ms-15 md:col-span-1 md:ms-0">
          <BentoCard
            src="img/feature-3.webp"
            title={
              <>
                <b>m</b>aps
              </>
            }
            description="Each map fuels strategy, creativity, and unforgettable clutch moments."
            isComingSoon
            isVideo={false}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-2 me-15 md:col-span-1 md:me-0">
          <BentoCard
            src="img/feature-2.gif"
            title={
              <>
                arsen<b>a</b>ls
              </>
            }
            description="From pistols to rifles, your weapon choice shapes every engagement"
            isComingSoon
            className=""
            isVideo={false}
            videoStyle={{
              transform: 'scale(0.7) translateX(8rem) translateY(7rem)'
            }}
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-2 ms-15 md:col-span-1 md:ms-0">
          {/* <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
            <h1 className="bento-title special-font max-w-64 text-black">
              M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
            </h1>

            <TiLocationArrow className="m-5 scale-[5] self-end" />
          </div> */}
          <BentoCard
            src="img/feature-5.jpg"
            title={
              <>
                <h1 className="bento-title special-font max-w-64 text-white-100">
                  ME<b>D</b>IA
                </h1>
              </>
            }
            description=""
            isComingSoon
            isVideo={false} 
          />
        </BentoTilt>

        <BentoTilt className="bento-tilt_1 col-span-2 me-15 md:col-span-1 md:me-0">
          <img
            src="img/feature-6.gif"
            loop
            muted
            autoPlay
            className="size-full object-cover object-center"
            isVideo={false}
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;