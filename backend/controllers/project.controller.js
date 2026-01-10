import Project from "../models/project.model.js";
import Client from "../models/client.model.js";

// Helper function to generate unique project ID
const generateProjectId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PROJ-${timestamp}-${random}`;
};

export const addProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      projectName,
      clientId,
      projectDescription,
      status,
      deadline,
      logs,
    } = req.body;

    // Validate required fields
    if (!projectName || !projectName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: "Deadline is required",
      });
    }

    // Verify client exists and belongs to user
    const client = await Client.findOne({ _id: clientId, userId });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or unauthorized access",
      });
    }

    // Validate deadline is a future date
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be a future date",
      });
    }

    // Generate unique project ID
    let projectId;
    let existingProject;
    do {
      projectId = generateProjectId();
      existingProject = await Project.findOne({ projectId });
    } while (existingProject);

    // Create new project
    const newProject = await Project.create({
      userId,
      projectId,
      projectName: projectName.trim(),
      clientId,
      projectDescription: projectDescription ? projectDescription.trim() : "",
      status: status || "pending",
      deadline: deadlineDate,
      logs: logs || [],
    });

    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      data: newProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      projectId,
      projectName,
      clientId,
      projectDescription,
      status,
      deadline,
      logs,
    } = req.body;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized access",
      });
    }

    // Validate required fields
    if (!projectName || !projectName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: "Deadline is required",
      });
    }

    // Verify client exists and belongs to user
    const client = await Client.findOne({ _id: clientId, userId });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or unauthorized access",
      });
    }

    // Validate deadline is a future date
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be a future date",
      });
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(
      project._id,
      {
        projectName: projectName.trim(),
        clientId,
        projectDescription: projectDescription ? projectDescription.trim() : "",
        status: status || project.status,
        deadline: deadlineDate,
        logs: logs || project.logs,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.body;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find project and verify ownership before deleting
    const project = await Project.findOne({
      projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized access",
      });
    }

    // Delete project
    await Project.findByIdAndDelete(project._id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProject = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.body;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      projectId,
      userId,
    }).populate("clientId", "clientName email mobileNumber");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all projects for the user with pagination and populate client info
    const projects = await Project.find({ userId })
      .populate("clientId", "clientName email mobileNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalProjects = await Project.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      data: projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProjects / limit),
        totalProjects: totalProjects,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addProjectLog = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId, description } = req.body;

    // Validate inputs
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Log description is required",
      });
    }

    // Find project and verify ownership
    const project = await Project.findOne({
      projectId,
      userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or unauthorized access",
      });
    }

    // Add new log entry
    const newLog = {
      timestamp: new Date(),
      description: description.trim(),
    };

    project.logs.push(newLog);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Log added successfully",
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublicProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate projectId
    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    // Find project and populate client info (public view)
    const project = await Project.findOne({
      projectId,
    }).populate("clientId", "clientName email mobileNumber");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
