import CouponModel from "../models/coupon.js";
import PanierModel from "../models/panier.js";
import ProduitModel from "../models/produits.js";

// ▶️ Obtenir le panier d’un utilisateur
export const GetpanierByUser = async (req, res) => {
  try {
    const cart = await PanierModel.findOne({ userId: req.params.userId })
      .populate("articles.produitId", "titre prix images");

    if (!cart) return res.status(404).json({ message: "Panier vide" });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Ajouter un produit au panier
export const AddToPanier = async (req, res) => {
  try {
    const { userId, produitId, quantité } = req.body;

    const produit = await ProduitModel.findById(produitId);
    if (!produit) return res.status(404).json({ message: "Produit introuvable" });

    let cart = await PanierModel.findOne({ userId });
    if (!cart) {
      // Créer un nouveau panier si inexistant
      cart = await PanierModel.create({
        userId,
        articles: [{ produitId, quantité, prix: produit.prix }],
        total: produit.prix * quantité
      });
    } else {
      // Vérifier si le produit existe déjà dans le panier
      const itemIndex = cart.items.findIndex(item => item.produitId.toString() === produitId);
      if (itemIndex > -1) {
        cart.articles[itemIndex].quantité += quantité;
        cart.articles[itemIndex].prix = produit.prix;
      } else {
        cart.articles.push({ produitId, quantité, prix: produit.prix });
      }

      // Recalculer le total
      cart.total = cart.articles.reduce((acc, item) => acc + item.quantité * item.prix, 0);
      await cart.save();
    }

    const updatedCart = await PanierModel.findById(cart._id).populate("articles.produitId", "titre prix images");
    res.status(200).json({ message: "Produit ajouté au panier", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Mettre à jour un item du panier (quantité)
export const UpdateCartItem = async (req, res) => {
  try {
    const { userId, produitId, quantité } = req.body;

    const cart = await PanierModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier introuvable" });

    const itemIndex = cart.items.findIndex(item => item.produitId.toString() === produitId);
    if (itemIndex === -1) return res.status(404).json({ message: "Produit introuvable dans le panier" });

    cart.articles[itemIndex].quantité = quantité;

    // Recalculer le total
    cart.total = cart.articles.reduce((acc, item) => acc + item.quantité * item.prix, 0);
    await cart.save();

    const updatedCart = await PanierModel.findById(cart._id).populate("articles.produitId", "titre prix images");
    res.status(200).json({ message: "Panier mis à jour", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Supprimer un produit du panier
export const RemoveCartItem = async (req, res) => {
  try {
    const { userId, produitId } = req.body;

    const cart = await PanierModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier introuvable" });

    cart.articles = cart.articles.filter(item => item.produitId.toString() !== produitId);

    // Recalculer le total
    cart.total = cart.articles.reduce((acc, item) => acc + item.quantité * item.prix, 0);
    await cart.save();

    const updatedCart = await PanierModel.findById(cart._id).populate("articles.produitId", "titre prix images");
    res.status(200).json({ message: "Produit supprimé du panier", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Vider le panier
export const ClearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await PanierModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier introuvable" });

    cart.articles = [];
    cart.total = 0;
    await cart.save();

    res.status(200).json({ message: "Panier vidé", cart });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const RemoveCoupon = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await PanierModel.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Panier introuvable" });

    // recalcul sans remise
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.quantité * item.prix,
      0
    );

    cart.coupon = null;
    cart.discount = 0;
    cart.total = subtotal;

    await cart.save();

    res.status(200).json({
      message: "Coupon retiré",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};


export const ApplyCoupon = async (req, res) => {
  try {
    const { userId, couponCode } = req.body;

    const cart = await PanierModel.findOne({ userId }).populate("items.produitId");
    if (!cart) return res.status(404).json({ message: "Panier introuvable" });

    // Vérifier si le coupon existe
    const coupon = await CouponModel.findOne({ code: couponCode.toUpperCase() });

    if (!coupon) return res.status(400).json({ message: "Coupon invalide" });

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ message: "Coupon expiré" });
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return res.status(400).json({ message: "Limite d’utilisation atteinte" });
    }

    // 🔢 Recalculer le prix total actuel
    const subtotal = cart.items.reduce(
      (acc, item) => acc + item.quantité * item.prix,
      0
    );

    // 🎟️ Calcul remise
    let discount = 0;

    if (coupon.type === "percentage") {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    discount = Math.min(discount, subtotal);

    // Mise à jour du panier
    cart.coupon = coupon._id;
    cart.discount = discount;
    cart.total = subtotal - discount;

    await cart.save();

    res.status(200).json({
      message: "Coupon appliqué",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
