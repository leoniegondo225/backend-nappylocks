import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { createSalon, getMySalon, rejectSalon, validerSalon } from "../controllers/salonController.js";
// import { DeleteUtilisateur, GetAllUtilisateurs, GetByIDUtilisateur, UpdateUtilisateur } from "../controllers/usersController.js";
import {roleMiddleware} from "../middlewares/roles.js";
import { CreerProduit, DeleteProduit, GetAllProduits, GetProduitByID, UpdateProduit } from "../controllers/produitController.js";
import upload from "../middlewares/upload.js";
import { CreerCategory, DeleteCategory, GetAllCategories, GetCategoryByID, UpdateCategory } from "../controllers/categoryController.js";
import { CreerCommande, DeleteCommande, GetAllCommandes, GetCommandeByID, UpdateCommandeStatus } from "../controllers/commandeController.js";
import { AddToPanier, ApplyCoupon, ClearCart, GetpanierByUser, RemoveCartItem, RemoveCoupon, UpdateCartItem } from "../controllers/panierController.js";
import { CreerService, DeleteService, GetAllServices, GetServiceByID, UpdateService } from "../controllers/servicesController.js";
import { CreeRendezvous, DeleteRendezvous, GetAllRendezvouss, GetRendezvousByID, UpdateRendezvous } from "../controllers/rendez_vousController.js";
import { CreateCoupon, DeleteCoupon, GetAllCoupons, GetCouponByID, UpdateCoupon, ValidateCoupon } from "../controllers/couponController.js";
import { CreateNotification, DeleteNotification, GetAllNotifications, GetNotificationByID, UpdateNotification } from "../controllers/notificationController.js";
import { getAllUsers, Login, Register } from "../controllers/authController.js";
import { changePassword, getProfile, updateProfile, uploadAvatar } from "../controllers/profileController.js";



const router = express.Router();

// Route de test
router.get("/", (req, res) => {
    res.send("Route nappyloks OK");
});

router.get("/me2", authMiddleware, getProfile);
router.put("/me1", authMiddleware, updateProfile);
router.patch("/me/password", authMiddleware, changePassword);
router.patch("/me/avatar", authMiddleware, upload.single("avatar"), uploadAvatar);


// routes utilisateurs
router.post("/register", Register);
router.post("/login", Login);
router.post("/admin/create-user", authMiddleware,roleMiddleware("superadmin"),Register);
router.get("/admin/users", authMiddleware, roleMiddleware("superadmin"), getAllUsers);


// router.get("/getAllUsers", authMiddleware, GetAllUtilisateurs);
// router.get("/getUser/:id", authMiddleware, GetByIDUtilisateur);
// router.put("/updateUser/:id", authMiddleware, UpdateUtilisateur);
// router.delete("/deleteUser/:id", authMiddleware, DeleteUtilisateur)
// seule l'admin et le superadmin peuvent voir tous les utilisateurs et supprimer un utilisateur
// router.get( "/getAllUsers",authMiddleware,roleMiddleware ("admin", "superadmin"), GetAllUtilisateurs);
// router.delete( "/deleteUsers/:id", authMiddleware,roleMiddleware("superadmin"), DeleteUtilisateur);

// Création avec image possible
router.post("/createcategory", authMiddleware, upload.single("image"), CreerCategory);
// Routes publiques
router.get("/allcategory", GetAllCategories);
router.get("/getcategory/:id", GetCategoryByID);
// Mise à jour (optionnel upload image)
router.put("/updatecategory/:id", authMiddleware, upload.single("image"), UpdateCategory);
router.delete("/deletecategory/:id", authMiddleware, DeleteCategory);

// Routes Produits
// Upload multiple images: "images" est le nom du champ dans le formulaire
router.post("/create", authMiddleware, upload.array("images", 5), CreerProduit);
router.get("/getAllproduit", GetAllProduits);
router.get("/getproduit/:id", GetProduitByID);
router.put("/updateproduit/:id", authMiddleware, upload.array("images", 5), UpdateProduit);
router.delete("/deleteproduit/:id", authMiddleware, DeleteProduit);

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

// Créer un salon
router.post("/creat", authMiddleware, createSalon);
router.put("/:id/valide", authMiddleware, validerSalon);
router.put("/:id/rejete", authMiddleware, rejectSalon);
//  voir SON salon
router.get("/me", authMiddleware, getMySalon);


//route pour les notification 
router.post("/create", CreateNotification);
router.get("/all", GetAllNotifications);
router.get("/:id", GetNotificationByID);
router.put("/:id", UpdateNotification);
router.delete("/:id", DeleteNotification);


export default router;