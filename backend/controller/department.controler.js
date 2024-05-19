// Import necessary dependencies
const multer = require("multer");
const departmentService = require("../service/department.service");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/department");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.params.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const updateDepartmentPhoto = upload.single("photo");

// async function createDepartment(req, res, next) {
//   try {
//     // Generate the username automatically
//     const username = `dept.${department_name.replace(/\s+/g, "")}`;
//     // Check if department name already exists
//     const departmentExists = await departmentService.checkIfDepartmentExists(
//       username
//     );

//     if (departmentExists) {
//       return res.status(400).json({
//         error: "This department name already exists!",
//       });
//     }

//     // Create new department
//     const departmentId = await departmentService.createDepartment({
//       department_name: req.body.department_name,
//       phone_number: req.body.phone_number,
//       contact_email: req.body.contact_email,
//       office_location: req.body.office_location,
//       password: req.body.password,
//       photo: req.body.photo,
//     });

//     return res.status(200).json({
//       status: true,
//       message: "Department created successfully",
//       departmentId,
//     });
//   } catch (error) {
//     console.error("Error creating department:", error);
//     return res.status(500).json({
//       error: "Internal server error",
//     });
//   }
// }

async function createDepartment(req, res, next) {
  try {
    // Retrieve department name from request body
    const department_name = req.body.department_name;

    // Generate the username automatically
    let username = "";
    const spaceIndex = department_name.indexOf(" ");
    if (spaceIndex !== -1 && spaceIndex < department_name.length - 1) {
      const firstFourChars = department_name.substring(0, 4);
      const afterSpace = department_name.substring(spaceIndex + 1);
      username = `dept.${firstFourChars}${afterSpace}`;
    } else {
      username = `dept.${department_name}`;
    }

    // Remove any spaces from the username
    username = username.replace(/\s+/g, "");

    // Check if department name already exists
    const departmentExists = await departmentService.checkIfDepartmentExists(
      username
    );

    if (departmentExists) {
      return res.status(400).json({
        error: "This department name already exists!",
      });
    }

    // Create new department
    const departmentId = await departmentService.createDepartment({
      department_name: department_name,
      phone_number: req.body.phone_number,
      contact_email: req.body.contact_email,
      office_location: req.body.office_location,
      password: req.body.password,
      photo: req.body.photo,
      username: username, // Include the generated username in the department data
    });

    return res.status(200).json({
      status: true,
      message: "Department created successfully",
      departmentId,
    });
  } catch (error) {
    console.error("Error creating department:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function getDepartment(req, res, next) {
  try {
    const departmentId = req.params.id;
    const department = await departmentService.getDepartment(departmentId);

    if (!department) {
      return res.status(404).json({
        error: "Department not found",
      });
    }

    return res.status(200).json({
      status: true,
      department,
    });
  } catch (error) {
    console.error("Error getting department:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function getAllDepartments(req, res, next) {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const size = req.query.size ? parseInt(req.query.size) : 5;

    // Fetch the total count of departments
    const totalCount = await departmentService.getDepartmentCount();

    const departments = await departmentService.getAllDepartments(page, size);

    // Calculate total pages based on total count and page size
    const totalPages = Math.ceil(totalCount / size);

    return res.status(200).json({
      status: true,
      departments,
      totalCount,
      totalPages,
    });
  } catch (error) {
    console.error("Error getting departments:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function updateDepartment(req, res, next) {
  try {
    const departmentId = req.params.id;
    const updatedDepartment = await departmentService.updateDepartment(
      departmentId,
      req.body
    );

    if (!updatedDepartment) {
      return res.status(404).json({
        error: "Department not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function updateDepartmentProfile(req, res, next) {
  try {
    // Extract department ID from request parameters
    const departmentId = req.params.departmentId;

    // Check if a file was uploaded
    let photoFilename = null;
    if (req.file) {
      photoFilename = req.file.filename;
    }

    // Call the service to update the department profile
    const success = await departmentService.updateDepartmentProfile(
      departmentId,
      req.body,
      photoFilename
    );

    // Check if the department was successfully updated
    if (success) {
      // Retrieve the updated department details
      const department = await departmentService.getDepartment(departmentId);
      return res.status(200).json({
        status: true,
        department,
      });
    } else {
      // If update failed, return an error response
      return res.status(404).json({
        status: false,
        error: "Department not found",
      });
    }
  } catch (error) {
    console.error("Error updating department:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const departmentId = req.params.id;
    const deleted = await departmentService.deleteDepartment(departmentId);

    if (!deleted) {
      return res.status(404).json({
        error: "Department not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function getDepartmentPhoto(req, res, next) {
  try {
    // Extract admin ID from request parameters
    const departmentId = req.params.id;

    // Call the service function to get the admin photo filename
    const photoFilename = await departmentService.getDepartmentPhoto(
      departmentId
    );

    // If photo filename is not found or empty, send a 404 response
    if (!photoFilename) {
      return res.status(404).json({
        status: false,
        error: "Department photo not found",
      });
    }

    // Construct the photo URL based on the photo filename
    const photoUrl = `/public/images/department/${photoFilename}`;

    // Send the photo URL in the response
    return res.status(200).json({
      status: true,
      photoUrl,
    });
  } catch (error) {
    console.error("Error getting Department photo:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

const changePassword = async (req, res, next) => {
  try {
    const departmentId = req.params.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Call the service method to change the password
    const response = await departmentService.changePassword(
      departmentId,
      oldPassword,
      newPassword,
      confirmPassword
    );

    if (response) {
      return res.status(200).json({
        status: "success",
        message: "Password updated successfully",
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Failed to update password. The old password is incorrect.",
      });
    }
  } catch (error) {
    if (error.message === "Old password is incorrect") {
      return res.status(402).json({
        status: "fail",
        message: "Failed to update password. The old password is incorrect.",
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: "Failed to update password. Please try again later.",
      });
    }
  }
};

async function getDepartmentIds(req, res, next) {
  try {
    const departmentIds = await departmentService.getDepartmentIds();

    if (!departmentIds || departmentIds.length === 0) {
      return res.status(404).json({
        error: "Department IDs not found",
      });
    }

    return res.status(200).json({
      status: true,
      departmentIds,
    });
  } catch (error) {
    console.error("Error getting department IDs:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

module.exports = {
  createDepartment,
  getDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
  getDepartmentIds,
  updateDepartmentProfile,
  getDepartmentPhoto,
  changePassword,
  updateDepartmentPhoto,
};
