import React from "react";
import { FaHeart } from "react-icons/fa";
import bankGround from "../assets/Hero.jpg";

const HeroDesktop = () => {
  return (
    <section
      className="relative bg-cover bg-center sm:bg-left h-screen"
      style={{
        backgroundImage: `url(${bankGround})`,
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1919] via-transparent to-transparent opacity-80"></div>

      {/* Centered Content */}
      <div className="relative flex items-center justify-end text-end text-white h-full px-40">
        <div className="space-y-6 max-w-3xl">
          {/* Heading with Calligraphy Font */}
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold font-greatVibes tracking-wider leading-tight mb-4 text-[#8c7b53] text-shadow-md ">
            Celebrate with Us on Our Special Day
          </h1>

          {/* Subheading with Elegant Font */}

          {/* Icons - Adding Romantic Hearts */}
          {/* <div className="flex justify-center space-x-6 mt-8">
          <FaHeart className="text-4xl text-[#8c7b53] animate-pulse" />
          <FaHeart className="text-4xl text-[#8c7b53] animate-pulse" />
        </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroDesktop;
