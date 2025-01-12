import React from "react";

const Button = ({ label, onClick }) => {
  return (
    <div>
      <button
        type="button" // Change type to "button"
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
