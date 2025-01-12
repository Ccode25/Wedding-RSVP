import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const port = 5000;

//Middleware
app.use(cors());
app.use(express.json());

// Utility function for sending error responses
const sendError = (res, status, message) => {
  res.status(status).json({ error: message });
};

//Utility function to handle guest response (accept/decline)
const handleGuestResponse = async (req, res, responseType) => {
  const { guestId } = req.body;

  if (!guestId) {
    return sendError(res, 400, "Guest ID is required to update response");
  }

  try {
    const result = await pool.query(
      "UPDATE guestlist SET response = $1 WHERE id = $2 RETURNING id, guest AS guestName, response,"[
        (responseType, guestId)
      ]
    );

    if (result.row.lenght === 0) {
      return sendError(res, 400, "Guest.found");
    }

    res.status(200).json({
      message: `Guest ${
        responseType === "accept" ? "accepted" : "declined"
      } successfully`,
      ...[result.rows[0]],
    });
  } catch (error) {
    console.log(error.message);
    sendError(res, 500, "An error occured while updating the guest response.");
  }
};

app.get("/guest", async (req, res) => {
  const { guestName } = req.body;

  if (!guestName) {
    return sendError(res, 400, "Guest required to perform the the search");
  }

  try {
    const result = await pool.query(
      `SELECT id, guest AS guestName, response FROM guestlist WHERE guest ILIKE $1`,
      [`%${guestName}%`]
    );

    if (result.rowCount.lenght === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    const unrespondedGuests = result.rowCount.filter(
      (guest) => guest.response === ""
    );

    if (unrespondedGuests.lenght === 0) {
      return res
        .json(200)
        .json({ message: "All matching guest have already responded" });
    }

    res.status(200).json(unrespondedGuests);
  } catch (error) {
    console.error(error.message);
    sendError(res, 500, "An error occured while searching for the guest");
  }
});

//Accept a response
app.post("/guest/accept", (req, res) =>
  handleGuestResponse(req, res, "accept")
);

//Declice response
app.post("/guest/accept", (req, res) =>
  handleGuestResponse(req, res, "decline")
);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
