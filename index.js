const express = require("express");
const cors = require("cors"); // Agrega esto
const admin = require("firebase-admin");
const dotenv = require("dotenv");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

// Configurar CORS para permitir todas las solicitudes
app.use(cors());

const firebaseConfig = JSON.parse(process.env.FIREBASE_ADMIN_SDK_CONFIG);

admin.initializeApp({
  credential: cert(firebaseConfig),
});

const db = getFirestore();

app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor express!");
});

app.get("/data", async (req, res) => {
  try {
    const snapshot = await db.collection("Departamentos").get();
    const departamentos = [];
    snapshot.forEach((doc) => {
      departamentos.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(departamentos);
  } catch (error) {
    console.log("Error obteniendo datos: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
