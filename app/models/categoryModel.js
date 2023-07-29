const pool = require('../../config/db');

// Helper function to update the lft and rgt values of categories
async function updateLftRgt() {
  return new Promise((resolve, reject) => {
    pool.query(
      'UPDATE categories AS c, (SELECT category_id, @left := @left + 1 as lft, @right := @left + 1 as rgt FROM categories, (SELECT @left := 0, @right := 0) as t ORDER BY category_id) AS temp SET c.lft = temp.lft, c.rgt = temp.rgt WHERE c.category_id = temp.category_id',
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

// Create a new category
async function createCategory(categoryData) {
  try {
    const { category_name, parent_category_id } = categoryData;

    // Calculate the lft and rgt values
    await updateLftRgt();

    // Insert the new category
    const result = await pool.query('INSERT INTO categories (category_name, parent_category_id) VALUES (?, ?)', [
      category_name,
      parent_category_id,
    ]);

    // Get the newly inserted category
    const newCategory = await getCategoryById(result.insertId);
    return newCategory;
  } catch (error) {
    throw error;
  }
}



// Get all categories with their subcategories using the MPTT algorithm
function getAllCategories() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM categories ORDER BY lft', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

  function getCategoryById(category_id) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM categories WHERE category_id = ?', [category_id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          if (results.length === 0) {
            resolve(null); // Category not found
          } else {
            resolve(results[0]);
          }
        }
      });
    });
  }
  
  
  async function deleteCategory(category_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const category = await getCategoryById(category_id);
        if (!category) {
          resolve(null); // Category not found
          return;
        }
  
        // Delete subcategories first (recursive call)
        if (category.rgt > category.lft + 1) {
          const subcategories = await getSubcategories(category.lft, category.rgt);
          for (const subcategory of subcategories) {
            await deleteCategory(subcategory.category_id);
          }
        }
  
        // Delete the category
        pool.query('DELETE FROM categories WHERE lft >= ? AND rgt <= ?', [category.lft, category.rgt], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.affectedRows);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  
  
  
module.exports = { createCategory, getCategoryById, getAllCategories, deleteCategory };
