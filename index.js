import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import { ConnectDB } from "./config/db.js";

import { initSuperAdmin } from "./utils/initSuperAdmin.js";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import router from "./Routes/route.js";

dotenv.config();

// 🔥 Connexion à la DB UNE SEULE FOIS
ConnectDB();
await initSuperAdmin();

const app = express();
// Nécessaire pour __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// DOSSIER UPLOADS + IMAGE PAR DÉFAUT
const uploadsDir = path.join(__dirname, "uploads");

// Crée le dossier s’il n’existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Dossier uploads créé automatiquement");
}

// Image par défaut si un fichier est manquant (plus jamais de crash ENOENT)
const defaultImagePath = path.join(uploadsDir, "default-product.jpg");
// Si default-product.jpg n’existe pas → on le crée automatiquement (placeholder gris)
if (!fs.existsSync(defaultImagePath)) {
  const placeholderBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
  fs.writeFileSync(defaultImagePath, Buffer.from(placeholderBase64, "base64"));
  console.log("Image par défaut (default-product.jpg) créée automatiquement");
}

app.get("/uploads/:filename", (req, res) => {
  const requestedFile = path.join(uploadsDir, req.params.filename);
  fs.access(requestedFile, fs.constants.F_OK, (err) => {
    if (err) {
      // Fichier manquant → on renvoie l’image par défaut
      return res.sendFile(defaultImagePath);
    }
    res.sendFile(requestedFile);
  });
});

// Middlewares

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// SERVE LE DOSSIER UPLOADS (À METTRE EN HAUT, AVANT TES ROUTES)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS autorisé selon tes domaines
const domaineAutorise = ["http://localhost:3500", "http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || domaineAutorise.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Domaine non autorisé par le CORS"));
    }
  },
};

// Utilisation du CORS
app.use(cors(corsOptions));

// Routes API
app.use("/api", router);




// Lancement serveur
app.listen(3500, () => console.log("Serveur lancé au port 3500"));
