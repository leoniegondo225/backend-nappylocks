import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { createSalon, deleteSalon, getAllSalons, updateSalon,} from "../controllers/salonController.js";
// import { DeleteUtilisateur, GetAllUtilisateurs, GetByIDUtilisateur, UpdateUtilisateur } from "../controllers/usersController.js";
import {roleMiddleware} from "../middlewares/roles.js";
import { CreateProduit, DeleteProduit, GetAllProduits, GetProduit, UpdateProduit } from "../controllers/produitController.js";
import upload from "../middlewares/upload.js";
import { CreerCategory, DeleteCategory, GetAllCategories, GetCategoryByID, UpdateCategory } from "../controllers/categoryController.js";
import { CreerCommande, DeleteCommande, GetAllCommandes, GetCommandeByID, UpdateCommandeStatus } from "../controllers/commandeController.js";
import { AddToPanier, ApplyCoupon, ClearCart, GetpanierByUser, RemoveCartItem, RemoveCoupon, UpdateCartItem } from "../controllers/panierController.js";
import { CreerService, DeleteService, GetAllServices, GetServiceByID, UpdateService } from "../controllers/servicesController.js";
import { CreeRendezvous, DeleteRendezvous, GetAllRendezvouss, GetRendezvousByID, UpdateRendezvous } from "../controllers/rendez_vousController.js";
import { CreateCoupon, DeleteCoupon, GetAllCoupons, GetCouponByID, UpdateCoupon, ValidateCoupon } from "../controllers/couponController.js";
import { CreateNotification, DeleteNotification, GetAllNotifications, GetNotificationByID, UpdateNotification } from "../controllers/notificationController.js";
import { getAllGerants, getAllUsers, Login, Register } from "../controllers/authController.js";
import { changePassword, getProfile, updateProfile } from "../controllers/profileController.js";
import { initSuperAdmin } from "../utils/initSuperAdmin.js";
import SalonModel from "../models/Salon.js";
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "../controllers/employeeController.js";
import { CreateClient, DeleteClient, GetClientById, GetClients, UpdateClient } from "../controllers/clientController.js";
import { CreateRdv, DeleteRdv, GetRdvById, GetRdvs, UpdateRdv } from "../controllers/rdvController.js";
import { CreerCategoryPrestation, DeleteCategoryPrestation, GetAllCategoriesPrestation, GetCategoryPrestationByID, UpdateCategoryPrestation } from "../controllers/categoryPrestationController.js";
import { CreatePrestation, DeletePrestation, GetPrestations, TogglePrestation, UpdatePrestation } from "../controllers/prestationController.js";


const router = express.Router();

// Route de test
router.get("/", (req, res) => {
    res.send("Route nappyloks OK");
});



router.get("/me2", authMiddleware, getProfile);
router.put("/me1", authMiddleware, updateProfile);
router.patch("/me/password", authMiddleware, changePassword);



// routes utilisateurs
router.post("/register",Register);
router.post("/login", Login);
router.post("/admin/create-user", authMiddleware,roleMiddleware("superadmin"),Register);
router.get("/admin/users", authMiddleware, roleMiddleware("superadmin"), getAllUsers);

// SuperAdmin uniquement : CRUD complet
router.post("/salons", authMiddleware,  createSalon);
router.put("/salons/:id", authMiddleware, initSuperAdmin, updateSalon);
router.delete("/deletesalons/:id", authMiddleware, initSuperAdmin, deleteSalon);
router.get("/getallsalons", getAllSalons);
router.get("/users/gerants", getAllGerants);
// AJOUTE ÇA ICI (dans le bon ordre !)
router.patch("/salons/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide. Utilisez 'active' ou 'inactive'" });
  }

  try {
    const salon = await SalonModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!salon) {
      return res.status(404).json({ message: "Salon non trouvé" });
    }

    res.json({ 
      message: "Statut mis à jour avec succès",
      salon 
    });
  } catch (error) {
    console.error("Erreur update status salon:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// router.get("/getAllUsers", authMiddleware, GetAllUtilisateurs);
// router.get("/getUser/:id", authMiddleware, GetByIDUtilisateur);
// router.put("/updateUser/:id", authMiddleware, UpdateUtilisateur);
// router.delete("/deleteUser/:id", authMiddleware, DeleteUtilisateur)
// seule l'admin et le superadmin peuvent voir tous les utilisateurs et supprimer un utilisateur
// router.get( "/getAllUsers",authMiddleware,roleMiddleware ("admin", "superadmin"), GetAllUtilisateurs);
// router.delete( "/deleteUsers/:id", authMiddleware,roleMiddleware("superadmin"), DeleteUtilisateur);

// Création avec image possible
router.post("/createcategory", authMiddleware, CreerCategory);
// Routes publiques
router.get("/allcategory", GetAllCategories);
router.get("/getcategory/:id", GetCategoryByID);
// Mise à jour (optionnel upload image)
router.put("/updatecategory/:id", authMiddleware,  UpdateCategory);
router.delete("/deletecategory/:id", authMiddleware, DeleteCategory);

// Routes Produits
// Upload multiple images: "images" est le nom du champ dans le formulaire
router.get("/imagekit-auth", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: "Impossible de générer l'auth ImageKit" });
  }
});
router.post("/produits", authMiddleware, CreateProduit);
// GET tous les produits
router.get("/getAllproduit", GetAllProduits);
// GET produit par ID
router.get("/getproduit/:id", GetProduit);
router.put("/produits/:id", authMiddleware, UpdateProduit);
router.delete("/produits/:id", authMiddleware, DeleteProduit);

//personnelle
router.post("/createemployee", createEmployee);
router.get("/getallemployee", getEmployees);
router.patch("/update/:id", updateEmployee);
router.delete("/delete/:id", deleteEmployee);

//presation et ces category

router.post("/addcategory", CreerCategoryPrestation)
router.get("/allcategory", GetAllCategoriesPrestation)
router.get("/get/:id", GetCategoryPrestationByID)
router.put("/putcategory/:id", UpdateCategoryPrestation)
router.delete("/delete/:id", DeleteCategoryPrestation)

//prestation
router.post("/addprestation", CreatePrestation)
router.get("/allprestations", GetPrestations )
router.put("/putprestation/:id", UpdatePrestation)
router.delete("/delete/:id", DeletePrestation)
router.patch("/toggleprestation/:id/toggle", TogglePrestation)


router.post("/createclient", authMiddleware, CreateClient);
router.get("/allclient",authMiddleware, GetClients);
router.get("/getclient/:id", authMiddleware,GetClientById);
router.put("/updateclient/:id",authMiddleware, UpdateClient);
router.delete("/deleteclient/:id",authMiddleware, DeleteClient);

router.post("/createrdv", CreateRdv);
router.get("/allrdv", GetRdvs);
router.get("/rdv/:id", GetRdvById);
router.put("/updaterdv/:id", UpdateRdv);
router.delete("/deleterdv/:id", DeleteRdv);

//routes pour les commandes
router.post("/addCommande", authMiddleware, CreerCommande);
router.get("/allCommande", authMiddleware, GetAllCommandes);
router.get("/getCommande/:id", authMiddleware, GetCommandeByID);
router.put("/updateCommande/:id", authMiddleware, UpdateCommandeStatus);
router.delete("/deleteCommande/:id", authMiddleware, DeleteCommande)

//route pour le panier
router.post("/addpanier", authMiddleware, AddToPanier);
router.get("/getpanier/:userId", authMiddleware, GetpanierByUser);
router.put("/updatepanier", authMiddleware, UpdateCartItem);
router.delete("/deletepanier/:userId", authMiddleware, RemoveCartItem);
router.delete("/clear", authMiddleware, ClearCart);

//Route pour les services 
router.post("/createservice", CreerService);
router.get("/getAllservice", GetAllServices);
router.get("/getservice/:id", GetServiceByID);
router.put("/updateservice/:id", UpdateService);
router.delete("/deleteservice/:id", DeleteService);


//route rendez-
router.post("/create", CreeRendezvous);
router.get("/getAll", GetAllRendezvouss);
router.get("/get/:id", GetRendezvousByID);
router.put("/update/:id", UpdateRendezvous);
router.delete("/delete/:id", DeleteRendezvous);

//coupon 
router.post("/create", CreateCoupon);
router.get("/getAll", GetAllCoupons);
router.get("/get/:id", GetCouponByID);
router.put("/update/:id", UpdateCoupon);
router.delete("/delete/:id", DeleteCoupon);

// Endpoint pour vérifier un coupon
router.post("/validate", ValidateCoupon);
router.post("/apply-coupon", ApplyCoupon);
router.post("/remove-coupon", RemoveCoupon);


// ROUTES PROPRIETAIRE



//route pour les notification 
router.post("/create", CreateNotification);
router.get("/all", GetAllNotifications);
router.get("/:id", GetNotificationByID);
router.put("/:id", UpdateNotification);
router.delete("/:id", DeleteNotification);


export default router;