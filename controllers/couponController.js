import CouponModel from "../models/coupon.js";


export const CreateCoupon = async (req, res) => {
  try {
    const { code, type, value, expiresAt, usageLimit } = req.body;

    if (!code || !type || !value || !expiresAt) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" });
    }

    const exists = await CouponModel.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "Ce code existe déjà" });
    }

    const coupon = await CouponModel.create({
      code,
      type,
      value,
      expiresAt,
      usageLimit,
    });

    res.status(201).json({ message: "Coupon créé avec succès", coupon });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const GetAllCoupons = async (req, res) => {
  try {
    const coupons = await CouponModel.find().sort({ createdAt: -1 });

    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const GetCouponByID = async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon introuvable" });
    }

    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const UpdateCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: "Coupon introuvable" });
    }

    res.status(200).json({ message: "Coupon mis à jour", coupon });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const DeleteCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon introuvable" });
    }

    res.status(200).json({ message: "Coupon supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const ValidateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await CouponModel.findOne({ code: code.toUpperCase() });

    if (!coupon) return res.status(404).json({ message: "Coupon invalide" });

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon expiré" });
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon déjà utilisé au maximum" });
    }

    res.status(200).json({ valid: true, coupon });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
