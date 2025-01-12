import React from "react";

const Header = () => {
  return (
    <header className="bg-[#333333] text-white shadow-xl shadow-[#d4af37]">
      <nav className="flex justify-between p-6">
        {/* Wedding logo text */}
        <div className="font-extrabold text-3xl font-greatVibes text-[#d4af37]">
          Wedding
        </div>
        {/* Navigation links */}
        <div className="space-x-3">
          <a
            href="#rsvp"
            className="text-lg font-semibold hover:text-[#d4af37] transition-colors"
          >
            RSVP
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
