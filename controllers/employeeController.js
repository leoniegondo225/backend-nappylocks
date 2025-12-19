import EmployeeModel from "../models/employee.js";
import SalonModel from "../models/Salon.js";

/**
 * GET all employees (avec infos salon peuplées)
 */
export async function getEmployees(req, res) {
  try {
    const employees = await EmployeeModel.find()
      .populate("salonId", "nom address ville telephone email"); // ← salonId + champs réels du modèle Salon

    res.json(employees);
  } catch (error) {
    console.error("Erreur getEmployees :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des employés" });
  }
}

/**
 * CREATE employee + assign salon
 */
export async function createEmployee(req, res) {
  try {
    const {
      name,
      email,
      phone,
      role,
      salonId,        // ← on garde salonId directement (plus clair)
      status = "active",
      specialties = [],
      joinDate,
    } = req.body;

    if (!salonId) {
      return res.status(400).json({ error: "Le salon est requis" });
    }

    // Vérifier que le salon existe
    const salonExists = await SalonModel.findById(salonId);
    if (!salonExists) {
      return res.status(404).json({ error: "Salon introuvable" });
    }

    const employee = await EmployeeModel.create({
      name,
      email,
      phone,
      role,
      salonId,        // ← champ correct dans le schéma
      status,
      specialties,
      joinDate,
    });

    // Optionnel : repopuler pour renvoyer les infos du salon
    const populatedEmployee = await EmployeeModel.findById(employee._id)
      .populate("salonId", "nom ville");

    res.status(201).json(populatedEmployee || employee);
  } catch (error) {
    console.error("Erreur createEmployee :", error);
    // Erreur de validation Mongoose (ex: email déjà utilisé)
    if (error.code === 11000) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }
    res.status(400).json({ error: error.message });
  }
}

/**
 * UPDATE employee
 */
export async function updateEmployee(req, res) {
  try {
    const updates = req.body;

    // Si on met à jour le salonId, on revérifie son existence
    if (updates.salonId) {
      const salonExists = await SalonModel.findById(updates.salonId);
      if (!salonExists) {
        return res.status(404).json({ error: "Salon introuvable" });
      }
    }

    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate("salonId", "nom ville");

    if (!employee) {
      return res.status(404).json({ error: "Employé introuvable" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Erreur updateEmployee :", error);
    res.status(400).json({ error: error.message });
  }
}

/**
 * DELETE employee
 */
export async function deleteEmployee(req, res) {
  try {
    const employee = await EmployeeModel.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ error: "Employé introuvable" });
    }

    res.json({ success: true, message: "Employé supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteEmployee :", error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET employees by salon
 */
export async function getEmployeesBySalon(req, res) {
  try {
    const { salonId } = req.params;

    if (!salonId) {
      return res.status(400).json({ error: "salonId requis" });
    }

    const employees = await EmployeeModel.find({ salonId }) // ← champ correct
      .populate("salonId", "nom ville address");

    res.json(employees);
  } catch (error) {
    console.error("Erreur getEmployeesBySalon :", error);
    res.status(500).json({ error: error.message });
  }
}