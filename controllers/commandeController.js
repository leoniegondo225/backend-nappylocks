import CommandeModel from "../models/commande.js";
import NotificationModel from "../models/notification.js";
import ProduitModel from "../models/produits.js";
import UserModel from "../models/users.js";


// ▶️ Créer une commande
export const CreerCommande = async (req, res) => {
  try {
    const { userId, articles, shippingAddress, paymentMethod, tax = 0, shipping = 0 ,  couponCode} = req.body;

    if (!userId || !articles || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "userId, articles, shippingAddress et paymentMethod sont obligatoires" });
    }

       // Récupérer données utilisateur
    const User = await UserModel.findById(order.userId);

const notif = await NotificationModel.create({
  userId: user._id,
  channel: "email",
  message: "Votre commande a été enregistrée",
  meta: { orderId: order._id }
});
    // Envoi notification
    await createNotification({
      userId: user._id,
      channel: "sms",
      message: `Votre commande #${order._id} a été enregistrée avec succès.`,
      meta: { phone: user.phone }
    });



await SendNotification(notif);
    // Vérifier l'utilisateur
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Calcul du subtotal et total
    let subtotal = 0;
    for (const item of articles) {
      const produit = await ProduitModel.findById(item.produitId);
      if (!produit) return res.status(404).json({ message: `Produit introuvable: ${item.produitId}` });
      subtotal += produit.prix * item.quantité;
      item.prix = produit.prix; // sauvegarder prix actuel
    }

     // ------------------------------
    // 🎟️ APPLICATION COUPON
    // ------------------------------

    let discount = 0;
    let coupon = null;

    if (couponCode) {
      coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (!coupon) {
        return res.status(400).json({ message: "Coupon invalide" });
      }

      if (coupon.expiresAt < new Date()) {
        return res.status(400).json({ message: "Coupon expiré" });
      }

        if (coupon.timesUsed >= coupon.usageLimit) {
        return res.status(400).json({ message: "Coupon usage limité atteint" });
      }

      // 💰 Calcul de la réduction
      if (coupon.type === "percentage") {
        discount = (subtotal * coupon.value) / 100;  // % de réduction
      } else {
        discount = coupon.value;  // montant fixe
      }

      // Empêcher discount > subtotal
      discount = Math.min(discount, subtotal);
    }

 // ------------------------------
    // 💲 TOTAL FINAL
    // ------------------------------
    const total = subtotal - discount + tax + shipping;

    const commande = await CommandeModel.create({
      userId,
      articles,
      subtotal,
      tax,
      shipping,
      total,
      discount,
       coupon: coupon ? coupon._id : null,
      paymentMethod,
    shippingAddress
    });

     // ------------------------------
    // 🔄 Mise à jour du coupon (si utilisé)
    // ------------------------------
    if (coupon) {
      coupon.timesUsed += 1;
      await coupon.save();
    }

    res.status(201).json({ message: "Commande créée avec succès", commande });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir toutes les commandes
export const GetAllCommandes = async (req, res) => {
  try {
    const commande = await CommandeModel.find()
      .populate("userId", "username email")
      .populate("articles.produitId", "titre prix images");
    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Obtenir une commande par ID
export const GetCommandeByID = async (req, res) => {
  try {
    const commande = await CommandeModel.findById(req.params.id)
      .populate("userId", "username email")
      .populate("articles.produitId", "titre prix images");

    if (!commande) return res.status(404).json({ message: "Commande introuvable" });

    res.status(200).json(commande);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Mettre à jour le statut d’une commande
export const UpdateCommandeStatus = async (req, res) => {
  try {
    const { commandeStatus, paymentStatus, transactionId } = req.body;

    const commande = await CommandeModel.findByIdAndUpdate(
      req.params.id,
      { commandeStatus, paymentStatus, transactionId },
      { new: true, runValidators: true }
    );

    if (!commande) return res.status(404).json({ message: "Commande introuvable" });

    res.status(200).json({ message: "Commande mise à jour", commande });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// ▶️ Supprimer une commande
export const DeleteCommande = async (req, res) => {
  try {
    const commande = await CommandeModel.findByIdAndDelete(req.params.id);
    if (!commande) return res.status(404).json({ message: "Commande introuvable" });

    res.status(200).json({ message: "Commande supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};





