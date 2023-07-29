// profileController.js

const WorkExperience = require("../models/workExperienceModel");

// ...

async function createWorkExperience(req, res) {
  try {
    const { company_name, designation, start_date, end_date } = req.body;

    // Get the professional_id from the authenticated user
    const user_id = req.user.user_id;

    // You can add additional validation here if required

    const newWorkExperience = {
        user_id,
      company_name,
      designation,
      start_date,
      end_date,
    };

    const createdWorkExperience = await WorkExperience.createWorkExperience(newWorkExperience);

    return res.status(201).json({ message: "Work experience created successfully", work_experience: createdWorkExperience });
  } catch (error) {
    console.error("Error creating work experience:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


// Update an existing work experience
async function updateWorkExperience(req, res) {
    try {
      const { work_experience_id } = req.params;
      const workExperienceDataToUpdate = req.body;
  
      // Ensure that only the user who created the work experience can update it
      const existingWorkExperience = await WorkExperience.getWorkExperienceById(work_experience_id);
      if (!existingWorkExperience) {
        console.log(existingWorkExperience);
        return res.status(404).json({ message: "Work experience not found" });
      }
  
      if (req.user.user_id !== existingWorkExperience.user_id) {
        return res.status(403).json({ message: "You do not have permission to update this work experience" });
      }
  
      const updatedWorkExperience = await WorkExperience.updateWorkExperience(work_experience_id, workExperienceDataToUpdate);
  
      return res.status(200).json({ message: "Work experience updated successfully", work_experience: updatedWorkExperience });
    } catch (error) {
      console.error("Error updating work experience:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
   
// Delete an existing work experience
async function deleteWorkExperience(req, res) {
    try {
      const { work_experience_id } = req.params;
      const user_id = req.user.user_id;
  
      // Check if the work experience belongs to the authenticated user
      const existingWorkExperience = await WorkExperience.getWorkExperienceById(work_experience_id);
      if (!existingWorkExperience || existingWorkExperience.user_id !== user_id) {
        return res.status(403).json({ message: "You do not have permission to delete this work experience" });
      }
  
      const deletedWorkExperience = await WorkExperience.deleteWorkExperience(work_experience_id);
  
      if (!deletedWorkExperience) {
        return res.status(404).json({ message: "Work experience not found" });
      }
  
      return res.status(200).json({ message: "Work experience deleted successfully", work_experience: deletedWorkExperience });
    } catch (error) {
      console.error("Error deleting work experience:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  
module.exports = { createWorkExperience, updateWorkExperience, deleteWorkExperience };
