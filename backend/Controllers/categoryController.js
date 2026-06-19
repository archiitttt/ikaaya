const Category = require('../Models/categoryModel');
const Product = require('../Models/productModel');
const { ExpressError } = require('../Utils/expressError');
const { StatusCodes } = require('http-status-codes');

// Get all categories
module.exports.getAllCategories = async (req, res) => {
  const categories = await Category.find({});

  res.status(StatusCodes.OK).json({
    message: 'Categories fetched successfully',
    success: true,
    data: categories
  });
};

// Get single category by ID
module.exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ExpressError('Category not found', StatusCodes.NOT_FOUND);
  }

  res.status(StatusCodes.OK).json({
    message: 'Category fetched successfully',
    success: true,
    data: category
  });
};

// Create category (Admin only)
module.exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim().length === 0) {
    throw new ExpressError('Category name is required', StatusCodes.BAD_REQUEST);
  }

  const existingCategory = await Category.findOne({ name: name.toLowerCase() });
  if (existingCategory) {
    throw new ExpressError('Category already exists', StatusCodes.CONFLICT);
  }

  const category = new Category({
    name: name.toLowerCase(),
    description: description || ''
  });

  const savedCategory = await category.save();

  res.status(StatusCodes.CREATED).json({
    message: 'Category created successfully',
    success: true,
    data: savedCategory
  });
};

// Update category (Admin only)
module.exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findById(id);

  if (!category) {
    throw new ExpressError('Category not found', StatusCodes.NOT_FOUND);
  }

  // Check if new name is unique (if name is being changed)
  if (name && name.toLowerCase() !== category.name) {
    const existingCategory = await Category.findOne({ name: name.toLowerCase() });
    if (existingCategory) {
      throw new ExpressError('Category name already exists', StatusCodes.CONFLICT);
    }
    category.name = name.toLowerCase();
  }

  if (description !== undefined) {
    category.description = description;
  }

  const updatedCategory = await category.save();

  res.status(StatusCodes.OK).json({
    message: 'Category updated successfully',
    success: true,
    data: updatedCategory
  });
};

// Delete category (Admin only)
module.exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ExpressError('Category not found', StatusCodes.NOT_FOUND);
  }

  // Check if any products use this category
  const productsInCategory = await Product.findOne({ category: category.name });

  if (productsInCategory) {
    throw new ExpressError(
      'Cannot delete category with existing products. Please reassign or delete products first.',
      StatusCodes.CONFLICT
    );
  }

  await category.deleteOne();

  res.status(StatusCodes.OK).json({
    message: 'Category deleted successfully',
    success: true
  });
};
