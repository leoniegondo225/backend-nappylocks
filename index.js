import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./config/db.js";
import router from "./routes/route.js";
import { initSuperAdmin } from "./utils/initSuperAdmin.js";

dotenv.config();

// 🔥 Connexion à la DB UNE SEULE FOIS
ConnectDB();
await initSuperAdmin();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
