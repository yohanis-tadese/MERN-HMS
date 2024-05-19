// Import necessary dependencies
const { query } = require("../config/db.config");
const bcrypt = require("bcrypt");

// Function to hash the password using bcrypt
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Function to check if the department exists in the database
async function checkIfDepartmentExists(username) {
  const sql = "SELECT * FROM departments WHERE username = ?";
  const rows = await query(sql, [username]);
  return rows.length > 0;
}

async function createDepartment(department) {
  try {
    // Generate the username automatically
    let username = "";
    const spaceIndex = department.department_name.indexOf(" ");
    if (
      spaceIndex !== -1 &&
      spaceIndex < department.department_name.length - 1
    ) {
      const firstFourChars = department.department_name.substring(0, 4);
      const afterSpace = department.department_name.substring(spaceIndex + 1);
      username = `dept.${firstFourChars}${afterSpace}`;
    } else {
      username = `dept.${department.department_name}`;
    }

    // Remove any spaces from the username
    username = username.replace(/\s+/g, "");

    // Hash the password before storing it
    const hashedPassword = await hashPassword(department.password);

    // Check if the department already exists
    const departmentExists = await checkIfDepartmentExists(username);
    if (departmentExists) {
      throw new Error("Department already exists.");
    }

    // Insert department details into the departments table
    const insertDepartmentSql = `
        INSERT INTO departments (
          department_name,
          username,
          phone_number,
          contact_email,
          office_location,
          password
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;
    const result = await query(insertDepartmentSql, [
      department.department_name,
      username,
      department.phone_number,
      department.contact_email,
      department.office_location,
      hashedPassword,
    ]);
    const departmentId = result.insertId;

    return departmentId;
  } catch (error) {
    console.error("Error creating department:", error.message);
    throw new Error("Failed to create department");
  }
}

async function getDepartment(departmentId) {
  try {
    const sql = `
      SELECT * 
      FROM departments
      WHERE department_id = ?
    `;
    const [department] = await query(sql, [departmentId]);
    return department;
  } catch (error) {
    throw new Error(`Error getting department: ${error.message}`);
  }
}

// Function to get the total count of departments
async function getDepartmentCount() {
  try {
    const sql = `SELECT COUNT(*) AS total FROM departments`;
    const [{ total }] = await query(sql);

    return total;
  } catch (error) {
    throw new Error(
      `Error getting total count of departments: ${error.message}`
    );
  }
}

async function getAllDepartments(page, size) {
  try {
    // Calculate offset based on page number and page size
    const offset = (page - 1) * size;

    // Modify the SQL query to include LIMIT and OFFSET clauses
    const sql = `
      SELECT * 
      FROM departments
      ORDER BY department_id ASC
      LIMIT ? OFFSET ?
    `;

    // Execute the query with parameters for LIMIT and OFFSET
    const rows = await query(sql, [size, offset]);

    return rows;
  } catch (error) {
    throw new Error(`Error fetching departments: ${error.message}`);
  }
}

async function updateDepartment(departmentId, departmentData) {
  try {
    const { department_name, phone_number, contact_email, office_location } =
      departmentData;

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

    const updateSql = `
      UPDATE departments
      SET department_name = ?,
          username = ?,
          phone_number = ?,
          contact_email = ?,
          office_location = ?
      WHERE department_id = ?
    `;

    const params = [
      department_name,
      username,
      phone_number,
      contact_email,
      office_location,
      departmentId,
    ];

    const result = await query(updateSql, params);

    // Check if the update was successful
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating department: ${error.message}`);
  }
}

async function deleteDepartment(departmentId) {
  try {
    // Check if departmentId is undefined
    if (departmentId === undefined) {
      throw new Error("Department ID is undefined");
    }

    const deleteSql = "DELETE FROM departments WHERE department_id = ?";
    const result = await query(deleteSql, [departmentId]);
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error deleting department: ${error.message}`);
  }
}

async function updateDepartmentProfile(
  departmentId,
  departmentData,
  photoFilename
) {
  try {
    const { department_name, phone_number, contact_email, office_location } =
      departmentData;

    // Check if department_name exists before accessing its properties
    if (!department_name) {
      throw new Error("Department name is required");
    }

    // Check if a photo filename is provided and update the department accordingly
    if (photoFilename) {
      departmentData.photo = photoFilename;
    }

    const username = `dept.${department_name.replace(/\s+/g, "")}`;

    // Construct the update SQL query
    let updateSql = `
      UPDATE departments
      SET department_name = ?,
          username = ?,
          phone_number = ?,
          contact_email = ?,
          office_location = ?,
          photo = ?
     WHERE department_id = ?   
    `;

    const params = [
      department_name,
      username,
      phone_number,
      contact_email,
      office_location,
      departmentData.photo,
      departmentId,
    ];

    const result = await query(updateSql, params);

    // Check if the update was successful
    return result.affectedRows > 0;
  } catch (error) {
    throw new Error(`Error updating department profile: ${error.message}`);
  }
}

async function getDepartmentPhoto(departmentId) {
  try {
    // Fetch department data by ID
    const department = await getDepartment(departmentId);

    // Return department's photo filename
    return department.photo;
  } catch (error) {
    console.error("Error getting department photo:", error);
    throw new Error("Failed to get department photo");
  }
}

async function changePassword(departmentId, oldPassword, newPassword) {
  try {
    // Retrieve the hashed password from the database
    const sql = `SELECT password FROM departments WHERE department_id = ?`;
    const [department] = await query(sql, [departmentId]);

    // Compare the provided old password with the stored hashed password
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      department.password
    );

    // If passwords match, hash the new password and update it in the database
    if (passwordMatch) {
      const hashedNewPassword = await hashPassword(newPassword);
      const updateSql = `UPDATE departments SET password = ? WHERE department_id = ?`;
      const result = await query(updateSql, [hashedNewPassword, departmentId]);

      // Check if the update was successful
      return result.affectedRows > 0;
    } else {
      return false; // Old password does not match
    }
  } catch (error) {
    throw new Error(`Error changing password: ${error.message}`);
  }
}

// Function to retrieve distinct department IDs from the departments table
async function getDepartmentIds() {
  try {
    const sql = "SELECT department_id FROM departments";
    const rows = await query(sql);
    return rows.map((row) => row.department_id);
  } catch (error) {
    console.error("Error getting department IDs:", error.message);
    throw new Error("Failed to retrieve department IDs");
  }
}

// Export the functions
module.exports = {
  checkIfDepartmentExists,
  createDepartment,
  getDepartment,
  getAllDepartments,
  getDepartmentCount,
  updateDepartment,
  deleteDepartment,
  getDepartmentIds,
  updateDepartmentProfile,
  getDepartmentPhoto,
  changePassword,
};
