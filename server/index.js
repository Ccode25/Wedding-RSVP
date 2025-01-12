import express from "express";
import cors from "cors";
import pool from "./db.js"; // Database connection

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Utility function for sending error responses
const sendError = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Utility function to handle guest response (accept/decline)
const handleGuestResponse = async (req, res, responseType) => {
  const { guestId } = req.body;

  if (!guestId) {
    return sendError(res, 400, "Guest ID is required to update the response.");
  }

  try {
    const result = await pool.query(
      `UPDATE guestList SET response = $1 WHERE id = $2 RETURNING id, guest AS guestName, response`,
      [responseType, guestId]
    );

    if (result.rows.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    res.status(200).json({
      message: `Guest ${
        responseType === "accept" ? "accepted" : "declined"
      } successfully.`,
      ...result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    sendError(res, 500, "An error occurred while updating the guest response.");
  }
};

// Search for guests by name, excluding those with a response
app.get("/guest", async (req, res) => {
  const { guestName } = req.query;

  if (!guestName) {
    return sendError(res, 400, "Guest name is required to perform the search.");
  }

  try {
    const result = await pool.query(
      `SELECT id, guest AS guestName, response FROM guestList WHERE guest ILIKE $1`,
      [`%${guestName}%`]
    );

    if (result.rows.length === 0) {
      return res.status(200).json(0); // Send 0 if no matching guest found
    }

    const unrespondedGuests = result.rows.filter(
      (guest) => guest.response === ""
    );

    if (unrespondedGuests.length === 0) {
      return res
        .status(200)
        .json({ message: "All matching guests have already responded." });
    }

    res.status(200).json(unrespondedGuests);
  } catch (error) {
    console.error(error.message);
    sendError(res, 500, "An error occurred while searching for the guest.");
  }
});

app.get("/response", async (req, res) => {
  try {
    // Query the database to get all guest names
    const result = await pool.query(
      "SELECT guest, email, response FROM guestlist"
    );
    const guestNames = result.rows; // Extract the rows (guest names)

    // Send the names as a response
    res.status(200).json(guestNames);
  } catch (error) {
    console.error("Error fetching guest names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Accept a guest
app.post("/guest/accept", (req, res) =>
  handleGuestResponse(req, res, "accept")
);

// Decline a guest
app.post("/guest/decline", (req, res) =>
  handleGuestResponse(req, res, "decline")
);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
