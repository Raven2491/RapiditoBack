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

//Obtener Deparrtamentos
app.get("/dep", async (req, res) => {
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

//Obtener Provincias
app.get("/prov", async (req, res) => {
  const { idDep } = req.query;
  if (!idDep) {
    return res.status(400).send("Falta el parámetro departamento");
  }

  try {
    const snapshot = await db
      .collection("Departamentos")
      .doc(idDep)
      .collection("Provincias")
      .get();

    console.log(snapshot);

    const provincias = [];
    snapshot.forEach((doc) => {
      provincias.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(provincias);
  } catch (error) {
    console.log("Error obteniendo datos: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

// Obtener Distritos
app.get("/dist", async (req, res) => {
  const { idDep } = req.query;
  const { idProv } = req.query;
  if (!idDep || !idProv) {
    return res.status(400).send("Faltan los parámetros idDep o idProv");
  }
  try {
    const snapshot = await db
      .collection("Departamentos")
      .doc(idDep)
      .collection("Provincias")
      .doc(idProv)
      .collection("Distritos")
      .get();

    console.log(snapshot);

    const distritos = [];
    snapshot.forEach((doc) => {
      distritos.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(distritos);
  } catch (error) {
    console.log("Error obteniendo datos: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

//Obtener Ecsales
app.get("/ecsales", async (req, res) => {
  const { ubicacion } = req.query;
  if (!ubicacion) {
    return res.status(400).send("Falta el parámetro ubicacion");
  }
  try {
    const snapshot = await db
      .collection("Ecsales")
      .where("distrito", "==", distrito)
      .get();
    const ecsales = [];
    snapshot.forEach((doc) => {
      ecsales.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(ecsales);
  } catch (error) {
    console.log("Error obteniendo datos: ", error);
    res.status(500).send("Error al obtener los datos");
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
