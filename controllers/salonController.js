import Salon from "../models/Salon.js";

// Créer un salon
export const createSalon = async (req, res) => {
  try {
    const { nom, address, telephone } = req.body;

    const salon = await Salon.create({
      nom,
      address,
      telephone,
      coiffeur: req.user._id,
      status: "en_attente",
    });

    res.status(201).json({
      message: "Salon créé et en attente de validation",
      salon,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SuperAdmin : approuver un salon
export const validerSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndUpdate(
      req.params.id,
      { status: "valide" },
      { new: true }
    );

    if (!salon) return res.status(404).json({ message: "Salon introuvable" });

    res.json({
      message: "Salon approuvé",
      salon,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SuperAdmin : rejeter un salon
export const rejectSalon = async (req, res) => {
  try {
    const salon = await Salon.findByIdAndUpdate(
      req.params.id,
      { status: "rejeté" },
      { new: true }
    );

    if (!salon) return res.status(404).json({ message: "Salon introuvable" });

    res.json({
      message: "Salon rejeté",
      salon,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMySalon = async (req, res) => {
  const salon = await Salon.findOne({ gerant: req.user._id });

  if (!salon) return res.status(404).json({ message: "Aucun salon trouvé" });

  res.json(salon);
};
