import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const port = 5000;

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL, // The URL from your Supabase project
  process.env.SUPABASE_API_KEY // Your Supabase API key
);

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
    // Query Supabase to update the guest response
    const { data, error } = await supabase
      .from("guestlist") // Table name updated to "guestlist"
      .update({ response: responseType })
      .eq("id", guestId)
      .select("id, guest, response");

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    res.status(200).json({
      message: `Guest ${
        responseType === "accept" ? "accepted" : "declined"
      } successfully.`,
      ...data[0], // Send the updated guest data
    });
  } catch (error) {
    console.error(error.message);
    sendError(res, 500, "An error occurred while updating the guest response.");
  }
};

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Search for guests by name, excluding those with a response
app.get("/guest", async (req, res) => {
  const { guestName } = req.query;

  if (!guestName) {
    return sendError(res, 400, "Guest name is required to perform the search.");
  }

  try {
    // Query Supabase to search guests in the "guestlist" table
    const { data, error } = await supabase
      .from("guestlist") // Table name updated to "guestlist"
      .select("id, guest, response")
      .ilike("guest", `%${guestName}%`);

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return res.status(200).json(0); // Send 0 if no matching guest found
    }

    const unrespondedGuests = data.filter((guest) => guest.response === "");

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
    // Query Supabase to get all guest names from the "guestlist" table
    const { data, error } = await supabase
      .from("guestlist") // Table name updated to "guestlist"
      .select("guest, email, response");

    if (error) {
      throw new Error(error.message);
    }

    // Send the names as a response
    res.status(200).json(data);
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
