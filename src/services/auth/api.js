const express = require("express");
const crypto = require("crypto");
const router = express.Router();

// Función para realizar el hash SHA-1
function sha1(input) {
  return crypto.createHash("sha1").update(input, "utf8").digest("hex");
}

// Función para convertir el hash hexadecimal a una representación RAW
function hashToRaw(hex) {
  const raw = [];
  for (let i = 0; i < hex.length; i += 2) {
    raw.push(String.fromCharCode(parseInt(hex.substr(i, 2), 16)));
  }
  return raw.join("");
}

module.exports = function (db) {
  router.post("/login", (req, res) => {
    const { usuario, contrasena } = req.body;

    // console.log("Datos recibidos:", { usuario, contrasena });

    let sql = "SELECT * FROM usuarios WHERE usuario = ?";
    db.get(sql, [usuario], (err, user) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res
          .status(500)
          .json({ error: "Error al consultar la base de datos" });
      }
      if (!user) {
        console.log(`No se encontró el usuario: ${usuario}`);
        return res
          .status(401)
          .json({ error: "Usuario o contraseña incorrecta" });
      }

      // Por el momento, no validaremos el hash de la contraseña.
      // Solo devolvemos un 200 para indicar un inicio de sesión exitoso.
      // TODO: Descomentar y solucionar la validación cuando estés listo.
      /*
      const passwordHash = sha1(contrasena);
      const passwordRawHash = hashToRaw(passwordHash);

      console.log("Hash calculado:", passwordHash);
      console.log("Hash convertido a RAW:", passwordRawHash);
      console.log("Hash en la base de datos:", user.contrasena);

      if (passwordRawHash !== user.contrasena) {
        return res.status(401).json({ error: "Usuario o contraseña incorrecta" });
      }
      */

      res.json({ message: "Inicio de sesión exitoso!" });
    });
  });

  router.post("/register", (req, res) => {
    // Tu lógica de registro aquí
    // ...
  });

  return router; // Retornamos el router configurado
};
