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
        `http://localhost:5000/guest?guestName=${guestName}`
      );

      if (response.data.message) {
        setError(response.data.message);
        setGuest([]);
      } else {
        setGuest(response.data);
      }
    } catch (error) {
      setGuest([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setGuestName(e.target.value);
  };

  const handleGuestSelect = (id) => {
    setSelectedGuestId(id); // Set the selected guest ID
  };

  const handleResponse = async (id, action) => {
    if (!selectedGuestId) {
      setError("Please select a guest before responding.");
      return;
    }

    console.log(`Guest ID: ${id}, Action: ${action}`);

    // Determine the URL based on the action
    const url =
      action === "accept"
        ? "http://localhost:5000/guest/accept"
        : "http://localhost:5000/guest/decline";

    try {
      // Send the guest ID as data in the request body
      const response = await axios.post(url, { guestId: id });

      console.log(response.data);

      // Set the response state
      setResponseReceived(true);
      setIsAttending(action === "accept");

      // Reset the guest list without clearing the guestName
      setGuest([]);
      setSearchPerformed(false);
    } catch (error) {
      // Log the error or display a message to the user
      console.error("Error occurred:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  // Reset to allow another search
  const resetSearch = () => {
    setGuest([]);
    setResponseReceived(false);
    setSearchPerformed(false);
    setGuestName(""); // Optional: clear the guest name field
    setSelectedGuestId(null); // Reset the selected guest
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

          {/* Error Message */}
          {error && <p className="mt-4 text-red-500 text-xl">{error}</p>}

          {/* No Guest Found */}
          {searchPerformed && guest.length === 0 && !loading && !error && (
            <p className="text-yellow-500 mt-4">
              No guest found with this name.
            </p>
          )}

          {/* Guest List */}
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
                    {/* Checkbox on the left of the name */}
                    <div className="flex justify-start items-center">
                      <input
                        type="checkbox"
                        id={`select-${g.id}`}
                        className="mr-4 flex-shrink-0" // Prevent the checkbox from shrinking
                        onChange={() => handleGuestSelect(g.id)} // Set the selected guest ID
                        checked={selectedGuestId === g.id} // Ensure the selected checkbox stays checked
                      />
                      <label
                        htmlFor={`select-${g.id}`}
                        className="text-white text-xl font-greatVibes"
                      >
                        Select your name
                      </label>
                    </div>

                    {/* Name Input Form */}
                    <InputForm
                      icon={FaUser}
                      placeholder="Enter your full name"
                      type="text"
                      id={`guest-${g.id}`} // Unique id for each guest
                      htmlFor={`guest-${g.id}`} // Unique htmlFor to match the id
                      value={g.guestname}
                      readOnly={readOnly}
                      className="text-xl sm:text-xl w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none" // Increase font size for guest name
                    />

                    <InputForm
                      icon={FaEnvelope}
                      placeholder="Email Address"
                      type="email"
                      id="email-id"
                      htmlFor="email-id"
                      value={g.email}
                      className="text-xl sm:text-xl w-full bg-transparent border-none text-white placeholder-gray-400 focus:outline-none" // Increase font size for guest name
                      onChange={handleInputChange}
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
                        disabled={selectedGuestId !== g.id} // Enable only for selected guest
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
                        disabled={selectedGuestId !== g.id} // Enable only for selected guest
                      >
                        NO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Display Response Message */}
          {responseReceived && (
            <ResponseMessage
              message="Thank you for your response!"
              isAttending={isAttending}
            />
          )}

          {/* Button to allow another search */}
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
