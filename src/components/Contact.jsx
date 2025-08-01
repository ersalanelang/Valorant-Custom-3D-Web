import React from 'react'
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";

const ImageClipBox = ({src, clipClass }) => (
  <div className={clipClass}>
    <img  src={src}/>
  </div>
)

const Contact = () => {
  return (
    <div id="contact" className="mt-20 mb-10 min-h-96 w-screen px-10">
      <div className="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
        <div className="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
          <ImageClipBox 
            clipClass="contact-clip-path-1"
            src="img/contact-1.webp"
          />
          <ImageClipBox 
            clipClass="contact-clip-path-2 lg:translate-y-55 translate-y-60"
            src="img/contact-2.webp"
          />
        </div>
        <div className="absolute -top-45 left-5 scale-[0.8] w-60 sm:top-1/2 md:scale-[1] md:left-auto md:right-10 lg:top-20 lg:w-80">
          <ImageClipBox 
            clipClass="absolute md:scale-125"
            src="img/swordman-partial.webp"
          /><ImageClipBox 
            clipClass="sword-man-clip-path md:scale-125"
            src="img/swordman.webp"
          />
        </div>
        <div className="flex flex-col items-center text-center">
          <p className="font-general text-[10px] uppercase"> 
            JOIN THE BATTLE
          </p>
          <p className="special-font text-white-100 mt-10 w-full font-zentry text-5xl  leading-[0.9] md:text-[6rem]"> 
            SIGN UP AND<br />Play Like a<br /> Champion
          </p>
          <Button 
            title="Download" 
            containerClass="btn-clip bg-white-100 mt-10 flex-center items-center justify-center hover:bg-red-50" 
            rightIcon={<TiLocationArrow />}
          />
        </div>
      </div>
    </div>
  )
}

export default Contact