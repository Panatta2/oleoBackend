const express = require("express");
const router = express.Router();
module.exports = function (db) {
  router.get("/getEmpresas", (req, res) => {
    let sql = "SELECT * FROM EMPRESA";

    db.all(sql, [], (err, empresas) => {
      if (err) {
        console.error("Error al consultar la base de datos:", err);
        return res
          .status(500)
          .json({ error: "Error al consultar la base de datos" });
      }

      if (!empresas || empresas.length === 0) {
        return res.status(404).json({ error: "No se encontraron empresas" });
      }

      res.json({ empresas });
    });
  });

  return router; // Retornamos el router configurado
};
