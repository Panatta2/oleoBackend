const express = require("express");
const router = express.Router();

module.exports = function (db) {
  // Método POST para crear una nueva finca
  router.post("/createFinca", (req, res) => {
    const { nombre } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El campo nombre es obligatorio" });
    }

    const sql = "INSERT INTO finca (nombre) VALUES (?)";
    db.run(sql, [nombre], function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al agregar finca" });
      }
      res.status(201).json({
        message: "Finca agregada exitosamente.",
        id: this.lastID,
      });
    });
  });

  // Método GET para obtener todas las fincas
  router.get("/getFincas", (req, res) => {
    const sql = "SELECT * FROM finca";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error al obtener las fincas" });
      }
      res.status(200).json({ fincas: rows });
    });
  });

  // Método PUT para actualizar una finca
  router.put("/finca/:id", (req, res) => {
    const { nombre } = req.body;
    const { id } = req.params;
    if (!nombre) {
      return res.status(400).json({ error: "El campo nombre es obligatorio" });
    }

    const sql = "UPDATE finca SET nombre = ? WHERE id = ?";
    db.run(sql, [nombre, id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar la finca" });
      }
      res.status(200).json({
        message: "Finca actualizada exitosamente.",
        changes: this.changes,
      });
    });
  });

  // Método DELETE para eliminar una finca
  router.delete("/finca/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM finca WHERE id = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar la finca" });
      }
      res.status(200).json({
        message: "Finca eliminada exitosamente.",
        changes: this.changes,
      });
    });
  });

  return router; // Retornamos el router configurado
};
