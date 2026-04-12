const prisma = require('../prisma/client');

const getAllProjects = async (filters = {}) => {
  const where = {};

  if (filters.difficulty) {
    where.difficulty = filters.difficulty;
  }

  if (filters.categoryId) {
    where.categoryId = parseInt(filters.categoryId);
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return await prisma.project.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
};

const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { category: true },
  });
};

const createProject = async (data) => {
  return await prisma.project.create({
    data,
    include: { category: true },
  });
};

const updateProject = async (id, data) => {
  return await prisma.project.update({
    where: { id: parseInt(id) },
    data,
    include: { category: true },
  });
};

const deleteProject = async (id) => {
  return await prisma.project.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};