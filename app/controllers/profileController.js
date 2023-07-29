// profileController.js
const Profile = require("../models/profileModel");

// Create a new profile
async function createProfile(req, res) {
  try {
    const {
      full_name,
      profile_picture,
      title,
      about_me,
      gender,
      total_experience_years,
      consultation_fees,
      availability,
      contact_number,
      email,
      documents_verification_status,
      documents,
      showcase,
      latitude,
      longitude
    } = req.body;

    // Get the user_id from the authenticated user
    const user_id = req.user.user_id;

    // Convert the documents and showcase fields to JSON arrays
    const documentsArray = JSON.stringify(documents);
    const showcaseArray = JSON.stringify(showcase);

    const newProfile = {
      user_id,
      full_name,
      profile_picture,
      title,
      about_me,
      gender,
      total_experience_years,
      consultation_fees,
      availability,
      contact_number,
      email,
      documents_verification_status,
      documents: documentsArray,
      showcase: showcaseArray,
      latitude,
      longitude, points:0
    };

    const createdProfile = await Profile.createProfile(newProfile);

    return res.status(201).json({ message: "Profile created successfully", profile: createdProfile });
  } catch (error) {
    console.error("Error creating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function updateProfile(req, res) {
  try {
    const loggedInUserId = req.user.user_id;
    const profileDataToUpdate = req.body;

    const updatedProfile = await Profile.updateProfile(loggedInUserId, profileDataToUpdate);

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

  
  module.exports = { createProfile, updateProfile };
  