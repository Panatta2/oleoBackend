const express = require("express");
const router = express.Router();

module.exports = function (db) {
  router.post("/createConfiguracion", (req, res) => {
    const { empresa, puerto_serial, expresion_regular, url } = req.body;
    if (!empresa || !puerto_serial || !expresion_regular || !url) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql =
      "INSERT INTO configuracion (empresa, puerto_serial, expresion_regular, url) VALUES (?, ?, ?, ?)";
    db.run(
      sql,
      [empresa, puerto_serial, expresion_regular, url],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al agregar configuración" });
        }
        res.status(201).json({
          message: "Configuración agregada exitosamente.",
          id: this.lastID,
        });
      }
    );
  });

  // Método GET para obtener todas las configuraciones
  router.get("/getConfiguracion", (req, res) => {
    const sql = "SELECT * FROM configuracion";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener las configuraciones" });
      }
      res.status(200).json({ configuraciones: rows });
    });
  });

  // Método PUT para actualizar una configuración
  router.put("/configuracion/:id", (req, res) => {
    const { empresa, puerto_serial, expresion_regular, url } = req.body;
    const { id } = req.params;
    const sql =
      "UPDATE configuracion SET empresa = ?, puerto_serial = ?, expresion_regular = ?, url = ? WHERE id = ?";
    db.run(
      sql,
      [empresa, puerto_serial, expresion_regular, url, id],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al actualizar la configuración" });
        }
        res.status(200).json({
          message: "Configuración actualizada exitosamente.",
          changes: this.changes,
        });
      }
    );
  });

  return router; // Retornamos el router configurado
};
