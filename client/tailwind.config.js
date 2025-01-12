// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        greatVibes: ["Great Vibes", "cursive"], // Adding the Great Vibes font
      },
      boxShadow: {
        "header-shadow": "0 4px 15px rgba(212, 175, 55, 0.6)", // Custom gold shadow
      },
    },
  },
  plugins: [],
};
