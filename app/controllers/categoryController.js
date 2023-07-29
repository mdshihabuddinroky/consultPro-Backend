const Category = require('../models/categoryModel');

// Create a new category
async function createCategory(req, res) {
  try {
    const { category_name, parent_category_id } = req.body;

    const newCategory = {
      category_name,
      parent_category_id,
    };

    const createdCategory = await Category.createCategory(newCategory);

    return res.status(201).json({ message: 'Category created successfully', category: createdCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

// In the getCategories function
async function getCategories(req, res) {
    try {
      const categories = await Category.getAllCategories();
      const categoryTree = buildCategoryTree(categories, null);
  
      return res.status(200).json({ categories: categoryTree });
    } catch (error) {
      console.error('Error retrieving categories:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  

  async function deleteCategory(req, res) {
    try {
      const { category_id } = req.params;
  
      // Check if the category exists
      const existingCategory = await Category.getCategoryById(category_id);
      if (!existingCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      // Perform the delete operation
      await Category.deleteCategory(category_id);
  
      return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error deleting category:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  
function buildCategoryTree(categories, parentCategoryId) {
    const categoryTree = [];
  
    categories.forEach((category) => {
      if (category.parent_category_id === parentCategoryId) {
        const childCategories = buildCategoryTree(categories, category.category_id);
  
        const newCategory = {
          category_id: category.category_id,
          category_name: category.category_name,
          subcategories: childCategories.length > 0 ? childCategories : [],
        };
  
        categoryTree.push(newCategory);
      }
    });
  
    return categoryTree;
  }
  

module.exports = { createCategory, getCategories, deleteCategory, buildCategoryTree };
