// workExperienceModel.js
const pool = require("../../config/db");

// Function to create a new work experience
function createWorkExperience(workExperienceData) {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO work_experience SET ?", workExperienceData, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve({ ...workExperienceData, work_experience_id: results.insertId });
      }
    });
  });
}

// Function to update an existing work experience
function updateWorkExperience(work_experience_id, workExperienceDataToUpdate) {
  return new Promise((resolve, reject) => {
    pool.query("UPDATE work_experience SET ? WHERE work_experience_id = ?", [workExperienceDataToUpdate, work_experience_id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows > 0 ? { ...workExperienceDataToUpdate, work_experience_id: work_experience_id } : null);
      }
    });
  });
}

// Function to delete a work experience
function deleteWorkExperience(work_experience_id) {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM work_experience WHERE work_experience_id = ?", work_experience_id, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.affectedRows > 0 ? { work_experience_id: work_experience_id } : null);
      }
    });
  });
}
function getWorkExperienceById(workExperienceId) {
    return new Promise((resolve, reject) => {
      pool.query(
        "SELECT * FROM work_experience WHERE work_experience_id = ?",
        [workExperienceId],
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        }
      );
    });
  }
module.exports = { createWorkExperience, updateWorkExperience, deleteWorkExperience,  getWorkExperienceById };
