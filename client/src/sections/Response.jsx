import React, { useState, useEffect } from "react";
import img from "../assets/background.jpg";
import { FaEnvelope, FaUser } from "react-icons/fa";
import InputForm from "../components/InputForm";
import axios from "axios";

const Response = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true); // Simulate login
  };

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch guest list when logged in
      const fetchGuestList = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await axios.get(
            "https://wedding-rsvp-9ynq.vercel.app/response"
          );
          setGuestList(response.data); // Update state with fetched data
        } catch (err) {
          setError("Failed to fetch guest list.");
          console.error("API Error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchGuestList();
    }
  }, [isLoggedIn]);

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl text-white px-6">
        {!isLoggedIn ? (
          <form className="space-y-8" onSubmit={handleLogin}>
            {/* Email Input */}
            <InputForm
              details="Email"
              icon={FaEnvelope}
              placeholder="Enter your email address"
              type="email"
              id="email"
              htmlFor="email"
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
            />

            {/* Password Input */}
            <InputForm
              details="Password"
              icon={FaUser}
              placeholder="Enter Password"
              type="password"
              id="password"
              htmlFor="password"
              className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
            />

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
              >
                Log In
              </button>
            </div>
          </form>
        ) : loading ? (
          <div className="text-center text-2xl font-bold">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-bold">{error}</div>
        ) : (
          <div className="shadow-lg">
            <h2 className="text-center text-3xl font-bold mb-6">Guest List</h2>
            <div className="overflow-x-auto max-h-96">
              {" "}
              {/* Adding scrollable container */}
              <table className="w-full table-auto border-collapse text-white rounded-lg overflow-hidden shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-left text-black">
                    <th className="px-4 py-2 border border-gray-300">
                      Guest Name
                    </th>
                    <th className="px-4 py-2 border border-gray-300">Email</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {guestList.map((guest, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border border-gray-300">
                        {guest.guest}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {guest.email}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {guest.response || "No Response"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Response;
