import Client from "../models/client.model.js";

export const addClient = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const { clientName, mobileNumber, email, gstNumber, address } = req.body;

    // Validate required fields
    if (!clientName || !clientName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number. It must be a 10-digit numeric value.",
      });
    }

    // Validate email if provided
    if (email && email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Check if client with same mobile number already exists for this user
    const existingClient = await Client.findOne({
      userId,
      mobileNumber,
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "A client with this mobile number already exists",
      });
    }

    // Create new client
    const newClient = await Client.create({
      userId,
      clientName: clientName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email ? email.trim() : "",
      gstNumber: gstNumber ? gstNumber.trim() : "",
      address: address ? address.trim() : "",
    });

    return res.status(201).json({
      success: true,
      message: "Client added successfully",
      data: newClient,
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const { clientId, clientName, mobileNumber, email, gstNumber, address } =
      req.body;

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Find client and verify ownership
    const client = await Client.findOne({
      _id: clientId,
      userId,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or unauthorized access",
      });
    }

    // Validate required fields
    if (!clientName || !clientName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number. It must be a 10-digit numeric value.",
      });
    }

    // Validate email if provided
    if (email && email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Check if new mobile number is already used by another client
    if (mobileNumber !== client.mobileNumber) {
      const existingClient = await Client.findOne({
        userId,
        mobileNumber,
        _id: { $ne: clientId },
      });

      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: "A client with this mobile number already exists",
        });
      }
    }

    // Update client
    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        clientName: clientName.trim(),
        mobileNumber: mobileNumber.trim(),
        email: email ? email.trim() : "",
        gstNumber: gstNumber ? gstNumber.trim() : "",
        address: address ? address.trim() : "",
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const { clientId } = req.body;

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Find client and verify ownership before deleting
    const client = await Client.findOne({
      _id: clientId,
      userId,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or unauthorized access",
      });
    }

    // Delete client
    await Client.findByIdAndDelete(clientId);

    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};

export const getClient = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const clientId = req.body.clientId;

    // Validate clientId
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Find client and verify ownership
    const client = await Client.findOne({
      _id: clientId,
      userId,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found or unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,

      data: client,
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};

export const getAllClients = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT middleware
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get all clients for the user with pagination
    const clients = await Client.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const totalClients = await Client.countDocuments({ userId });

    return res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      data: clients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalClients / limit),
        totalClients: totalClients,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error(error);
    const message = error.response
      ? error.response.data.message
      : error.message;
    return res.status(500).json({
      success: false,
      message: message,
    });
  }
};
