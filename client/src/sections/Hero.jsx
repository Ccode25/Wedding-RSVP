import React from "react";
import { FaHeart } from "react-icons/fa";
import bankGround from "../assets/Hero.jpg";

const Hero = () => {
  return (
    <section
      className="relative bg-cover bg-center h-screen"
      style={{
        backgroundImage: `url(${bankGround})`,
      }}
    >
      {/* Gradient Overlay for Elegance */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#f5e1e1] via-transparent to-transparent opacity-80"></div>

      {/* Centered Content */}
      <div className="relative flex items-center justify-center text-center text-white h-full px-6">
        <div className="space-y-6 max-w-3xl">
          {/* Heading with Calligraphy Font */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold font-greatVibes tracking-wider leading-tight mb-4 text-[#8c7b53]">
            Join us for the Big Day
          </h1>

          {/* Subheading with Elegant Font */}
          <p className="text-xl sm:text-2xl md:text-3xl italic text-[#b0b68c]">
            We're getting married!
          </p>

          {/* Icons - Adding Romantic Hearts */}
          <div className="flex justify-center space-x-6 mt-8">
            <FaHeart className="text-4xl text-[#a5b68d] animate-pulse" />
            <FaHeart className="text-4xl text-[#c1cfa1] animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
