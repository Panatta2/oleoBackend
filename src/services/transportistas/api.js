const express = require("express");
const router = express.Router();

module.exports = function (db) {
  // Método POST para crear un nuevo transportista
  router.post("/createTransportista", (req, res) => {
    const { empresa_id, razon_social } = req.body;
    if (!empresa_id || !razon_social) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      INSERT INTO transportistas (empresa_id, razon_social) 
      VALUES (?, ?)
    `;
    db.run(sql, [empresa_id, razon_social], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al agregar transportista" });
      }
      res.status(201).json({
        message: "Transportista agregado exitosamente.",
        id: this.lastID,
      });
    });
  });

  // Método GET para obtener todos los transportistas
  router.get("/getTransportistas", (req, res) => {
    const sql = "SELECT * FROM transportistas WHERE empresa_id = ?";
    db.all(sql, [req.query.empresa_id], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener los transportistas" });
      }
      res.status(200).json({ transportistas: rows });
    });
  });

  // Método PUT para actualizar un transportista
  router.put("/transportista/:id", (req, res) => {
    const { empresa_id, razon_social } = req.body;
    const { id } = req.params;
    if (!empresa_id || !razon_social) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      UPDATE transportistas 
      SET empresa_id = ?, razon_social = ? 
      WHERE ID = ?
    `;
    db.run(sql, [empresa_id, razon_social, id], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al actualizar el transportista" });
      }
      res.status(200).json({
        message: "Transportista actualizado exitosamente.",
        changes: this.changes,
      });
    });
  });

  // Método DELETE para eliminar un transportista
  router.delete("/transportista/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM transportistas WHERE ID = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al eliminar el transportista" });
      }
      res.status(200).json({
        message: "Transportista eliminado exitosamente.",
        changes: this.changes,
      });
    });
  });

  return router; // Retornamos el router configurado
};
