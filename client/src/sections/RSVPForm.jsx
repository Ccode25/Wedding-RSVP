import React, { useState } from "react";
import img from "../assets/background.jpg";
import { FaEnvelope, FaSearch, FaUser } from "react-icons/fa";
import RsvpHeader from "../components/RsvpHeader";
import InputForm from "../components/InputForm";
import Button from "../components/Button";
import axios from "axios";
import ResponseMessage from "../components/ResponseMessage";

const RSVPForm = () => {
  const [guestName, setGuestName] = useState("");
  const [guest, setGuest] = useState([]); // Holds the list of guests
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [responseReceived, setResponseReceived] = useState(false); // Track if response is received
  const [isAttending, setIsAttending] = useState(null); // Track if the guest is attending or not
  const [selectedGuestId, setSelectedGuestId] = useState(null); // Track selected guest for response

  const readOnly = true;

  const searchGuest = async () => {
    if (!guestName) {
      setError("Input name required");
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    try {
      const response = await axios.get(
        `https://wedding-rsvp-9ynq.vercel.app/guest?guestName=${guestName}`
      );

      if (response.data === 0) {
        // If no guest is found
        setError("No name found");
        setSearchPerformed(false);
        return;
      }
      if (response.data.message) {
        setSearchPerformed(false);
        setError(response.data.message);
        return;
      } else {
        console.log(response.data);
        setGuest(response.data);
        setSearchPerformed(true);
      }
    } catch (error) {
      console.error(error);
      setGuest([]);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setGuestName(e.target.value);
  };

  const handleGuestSelect = (id) => {
    setSelectedGuestId((prevId) => (prevId === id ? null : id)); // Toggle selection
  };

  const handleResponse = async (id, action) => {
    if (!selectedGuestId) {
      setError("Please select a guest before responding.");
      return;
    }

    const url =
      action === "accept"
        ? "https://wedding-rsvp-9ynq.vercel.app/guest/accept"
        : "https://wedding-rsvp-9ynq.vercel.app/guest/decline";

    try {
      const response = await axios.post(url, { guestId: id });
      console.log(response.data);

      setResponseReceived(true);
      setIsAttending(action === "accept");

      setGuest([]);
      setSearchPerformed(false);
    } catch (error) {
      console.error("Error occurred:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const resetSearch = () => {
    setGuest([]);
    setResponseReceived(false);
    setSearchPerformed(false);
    setGuestName("");
    setSelectedGuestId(null);
    setError(null); // Clear any errors
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${img})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Form Content */}
      <div className="relative z-10 w-full max-w-4xl text-white px-6 mt-10">
        <RsvpHeader />
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Conditional Rendering for Input and Search */}
          {!searchPerformed && !responseReceived && (
            <>
              <InputForm
                details="Enter Name"
                icon={FaSearch}
                placeholder="Search your name"
                type="text"
                id="search-name"
                htmlFor="search-name"
                value={guestName}
                className="w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                onChange={handleInputChange}
              />

              <Button
                label={loading ? "Searching..." : "Find"}
                onClick={searchGuest}
              />
            </>
          )}

          {error && <p className="mt-4 text-red-500 text-xl">{error}</p>}

          {guest.length > 0 && !responseReceived && (
            <div className="mt-6 p-8 rounded-lg shadow-xl space-y-8">
              <p className="text-4xl font-semibold text-white-800 font-greatVibes">
                We are thrilled to see you on our special day. Will you
                celebrate with us?
              </p>
              <div className="space-y-6">
                {guest.map((g) => (
                  <div
                    key={g.id}
                    className="flex flex-col sm:flex-row sm:items-start rounded-lg p-6 space-y-6 sm:space-x-8 sm:space-y-0"
                  >
                    <div className="flex justify-start items-center">
                      <input
                        type="checkbox"
                        id={`select-${g.id}`}
                        className="mr-4 flex-shrink-0"
                        onChange={() => handleGuestSelect(g.id)}
                        checked={selectedGuestId === g.id}
                      />
                      <label
                        htmlFor={`select-${g.id}`}
                        className="text-white text-xl font-greatVibes"
                      >
                        Select your name
                      </label>
                    </div>

                    <InputForm
                      icon={FaUser}
                      placeholder="Enter your full name"
                      type="text"
                      id={`guest-${g.id}`}
                      htmlFor={`guest-${g.id}`}
                      value={g.guest}
                      readOnly={readOnly}
                      className="text-xl sm:text-xl w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                    />

                    <InputForm
                      icon={FaEnvelope}
                      placeholder="Email Address"
                      type="email"
                      id="email-id"
                      htmlFor="email-id"
                      value={g.email}
                      className="text-xl sm:text-xl w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none"
                    />

                    <div className="flex space-x-4 w-full sm:w-auto">
                      <button
                        type="button"
                        className={`px-5 py-2 text-lg bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto ${
                          selectedGuestId === g.id
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => handleResponse(g.id, "accept")}
                        disabled={selectedGuestId !== g.id}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`px-5 py-2 text-lg bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition duration-300 w-full sm:w-auto ${
                          selectedGuestId === g.id
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() => handleResponse(g.id, "decline")}
                        disabled={selectedGuestId !== g.id}
                      >
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {responseReceived && (
            <ResponseMessage
              message="Thank you for your response!"
              isAttending={isAttending}
            />
          )}

          {responseReceived && (
            <div className="mt-6">
              <Button label="Search Again" onClick={resetSearch} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RSVPForm;
