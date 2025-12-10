import {imagekit} from "../config/imagekit.js"; // selon ton chemin

export const uploadImage = async (req, res) => {
  const { file, fileName } = req.body; // file = base64 ou fichier binaire

  try {
    const result = await imagekit.upload({
      file,
      fileName,
      folder: "nappylocks", // optionnel : dossier dans ImageKit
    });

    return res.status(200).json({ url: result.url });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json({ message: "Échec de l’upload" });
  }
};

export default uploadImage
