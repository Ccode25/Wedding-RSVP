import React, { useState } from "react";
import axios from "axios";

function GuestSearch() {
  const [state, setState] = useState({
    guestName: "",
    guests: [],
    error: "",
    loading: false,
    confirmation: null,
    selectedGuestId: null,
    email: "",
    emailError: "",
  });

  const updateState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  const isValidGmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

  // Search for guests by name
  const searchGuest = async () => {
    const { guestName } = state;

    if (!guestName) {
      updateState({ error: "Please enter a guest name." });
      return;
    }

    updateState({ loading: true, error: "" });

    try {
      const response = await axios.get(
        `http://localhost:5000/guest?guestName=${guestName}`
      );

      if (response.data.message) {
        updateState({ error: response.data.message });
      } else {
        updateState({ guests: response.data });
      }
    } catch (error) {
      if (err.response && err.response.status === 404) {
        updateState({ error: "Guest not found." });
      } else {
        updateState({
          error: "An error occurred while searching for the guest.",
        });
      }
    } finally {
      updateState({ loading: false });
    }
  };

  // Handle Accept/Decline actions
  const handleResponse = (guestId, action) => {
    updateState({
      selectedGuestId: guestId,
      confirmation: { action, guestId },
      email: "", // Reset email when selecting a new guest
      emailError: "", // Reset email error
    });
  };

  // Confirm the action
  const confirmResponse = async (confirmed) => {
    const { confirmation, email, selectedGuestId } = state;

    if (!confirmed || !confirmation) {
      updateState({ confirmation: null });
      return;
    }

    if (!email) {
      updateState({ emailError: "Please enter an email address." });
      return;
    }

    if (!isValidGmail(email)) {
      updateState({ emailError: "Please enter a valid Gmail address." });
      return;
    } else {
      updateState({ emailError: "" });
    }

    const url =
      confirmation.action === "accept"
        ? "http://localhost:5000/guest/accept"
        : "http://localhost:5000/guest/decline";

    try {
      const response = await axios.post(url, {
        guestId: selectedGuestId,
        email,
      });
      console.log(response.data);

      // Clear states after submission
      updateState({
        guests: [],
        guestName: "",
        email: "",
        error: "",
        confirmation: null,
      });
    } catch (err) {
      console.error(
        `An error occurred while trying to ${confirmation.action} the guest.`,
        err.message
      );
      updateState({
        error: `An error occurred while trying to ${confirmation.action} the guest.`,
        confirmation: null,
      });
    }
  };

  return (
    <div>
      <h1>Search for Guests</h1>
      <input
        type="text"
        value={state.guestName}
        onChange={(e) => updateState({ guestName: e.target.value })}
        placeholder="Enter guest name"
      />
      <button onClick={searchGuest}>Search</button>

      {state.loading && <p>Loading...</p>}

      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      <h2>Guest List</h2>
      <ul>
        {state.guests.length > 0 ? (
          state.guests.map((guest, index) => (
            <li key={index}>
              {guest.guestname}

              {/* Only show buttons if guest is selected */}
              <button onClick={() => handleResponse(guest.id, "accept")}>
                Accept
              </button>
              <button onClick={() => handleResponse(guest.id, "decline")}>
                Decline
              </button>
            </li>
          ))
        ) : (
          <p>No guests to display.</p>
        )}
      </ul>

      {/* Confirmation Modal */}
      {state.confirmation && (
        <div style={styles.confirmationModal}>
          <p>
            Are you sure you want to{" "}
            {state.confirmation.action === "accept" ? "accept" : "decline"} this
            guest?
          </p>

          {/* Email input within the modal */}
          <input
            type="email"
            placeholder="Enter email"
            value={state.email}
            onChange={(e) => updateState({ email: e.target.value })}
          />
          {state.emailError && (
            <p style={{ color: "red" }}>{state.emailError}</p>
          )}

          <button onClick={() => confirmResponse(true)}>Yes</button>
          <button onClick={() => confirmResponse(false)}>No</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  confirmationModal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    zIndex: 1000,
  },
};

export default GuestSearch;
