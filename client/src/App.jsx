import React, { useEffect } from "react";
import RSVPForm from "./sections/RSVPForm";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import EventDetails from "./sections/EventDetails";
import Response from "./sections/Response";

const App = () => {
  useEffect(() => {
    // Prevent horizontal scrolling by applying styles to body
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto"; // Reset on component unmount
    };
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <div className="py-0 mb-0 shadow-lg shadow-[#d4af37]">
        <RSVPForm />
      </div>
      <div>
        <EventDetails />
      </div>
      <div>
        <Response />
      </div>
    </div>
  );
};

export default App;
