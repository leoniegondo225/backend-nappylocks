import cron from "node-cron";
import Rdv from "../models/rdv.model.js";
import { sendEmail } from "./mailer.js";

cron.schedule("0 9 * * *", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().split("T")[0];

  const rdvs = await Rdv.find({ date, status: "CONFIRMED" }).populate("clientId");

  for (const rdv of rdvs) {
    if (rdv.clientId?.email) {
      await sendEmail(
        rdv.clientId.email,
        "Rappel RDV",
        `<p>Rappel de votre RDV demain à ${rdv.time}</p>`
      );
    }
  }
});
