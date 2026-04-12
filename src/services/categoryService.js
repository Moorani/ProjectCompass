const prisma = require('../prisma/client');

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: { projects: true },
    orderBy: { name: 'asc' },
  });
};

const getCategoryById = async (id) => {
  return await prisma.category.findUnique({
    where: { id: parseInt(id) },
    include: { projects: true },
  });
};

const createCategory = async (data) => {
  return await prisma.category.create({
    data,
  });
};

const updateCategory = async (id, data) => {
  return await prisma.category.update({
    where: { id: parseInt(id) },
    data,
  });
};

const deleteCategory = async (id) => {
  return await prisma.category.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};