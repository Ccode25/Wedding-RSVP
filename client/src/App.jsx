import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import routing components
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
    <Router>
      <div className="scroll-smooth">
        <Header />

        {/* Define routes */}
        <Routes>
          {/* Route for home page */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <div id="rsvp" className="py-0 mb-0 shadow-lg shadow-[#d4af37]">
                  <RSVPForm />
                </div>
                <div>
                  <EventDetails />
                </div>
              </>
            }
          />

          {/* Route for the response page */}
          <Route path="/response" element={<Response />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
