import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Resend } from "resend";
import sendEmail from "./sendEmail.js";

// Load environment variables
dotenv.config();

const app = express();
const port = 5000;

// Supabase client initialization
const supabase = createClient(
  process.env.SUPABASE_URL, // The URL from your Supabase project
  process.env.SUPABASE_API_KEY // Your Supabase API key
);

// Allow CORS from the specific frontend domain
const allowedOrigins = [
  "https://wedding-rsvp-blond.vercel.app", // Add your frontend URL here
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow request from this origin
      } else {
        callback(new Error("Not allowed by CORS")); // Reject request from other origins
      }
    },
  })
);

// Middleware
// app.use(cors());
app.use(express.json());

// Utility function for sending error responses
const sendError = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Utility function to handle guest response (accept/decline)
// // Utility function to handle guest response (accept/decline)
const handleGuestResponse = async (req, res, responseType) => {
  const { guestId, email } = req.body;

  if (!guestId) {
    return sendError(res, 400, "Guest ID is required to update the response.");
  }

  if (!email || email.trim() === "") {
    return sendError(res, 400, "Email is required and cannot be empty.");
  }

  try {
    // Update the guest response and email in the database first
    const { data, error } = await supabase
      .from("guestlist")
      .update({ response: responseType, email: email })
      .eq("id", guestId)
      .select("id, guest, email, response");

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return sendError(res, 404, "Guest not found.");
    }

    const { guest } = data[0];
    console.log(guest, responseType, email);

    // Ensure the email is sent only after the guest is successfully updated in the database
    const emailResult = await sendEmail(guest, email, responseType);

    if (!emailResult.success) {
      const emailErrorLog = {
        error: "Email sending failed",
        guestId: guestId,
        action: responseType,
        email: email,
        reason: emailResult.reason || "Unknown error",
      };
      console.error("Email Error Log:", JSON.stringify(emailErrorLog));
      return sendError(
        res,
        500,
        "Failed to send email. Please check the server logs."
      );
    }

    // Send response after successfully sending the email
    return res.status(200).json({
      message: `Guest ${
        responseType === "accept" ? "accepted" : "declined"
      } successfully.`,
      ...data[0],
    });
  } catch (error) {
    console.error("Error updating guest response:", error);
    return sendError(
      res,
      500,
      "An error occurred while updating the guest response."
    );
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
    sendError(res, 500, "Internal Server Error");
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
