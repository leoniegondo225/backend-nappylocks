import EmployeeModel from "../models/employee.js";


// ✅ GET all employees
export async function getEmployees(req, res) {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ✅ CREATE
export async function createEmployee(req, res) {
  try {
    const employee = await EmployeeModel.create(req.body);
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ✅ UPDATE
export async function updateEmployee(req, res) {
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ✅ DELETE
export async function deleteEmployee(req, res) {
  try {
    await EmployeeModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
