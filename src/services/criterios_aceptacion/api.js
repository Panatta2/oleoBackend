const express = require("express");
const router = express.Router();

module.exports = function (db) {
  // Método POST para crear un nuevo criterio de aceptación
  router.post("/createCriterioAceptacion", (req, res) => {
    const { nombre, criterio, valor, producto_id, empresa_id } = req.body;
    if (!nombre || !criterio || !valor || !producto_id || !empresa_id) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      INSERT INTO TABLERO_CALIDAD (nombre, criterio, valor, producto_id, empresa_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [nombre, criterio, valor, producto_id, empresa_id],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al agregar criterio de aceptación" });
        }
        res.status(201).json({
          message: "Criterio de aceptación agregado exitosamente.",
          id: this.lastID,
        });
      }
    );
  });

  // Método GET para obtener todos los criterios de aceptación
  router.get("/getCriteriosAceptacion", (req, res) => {
    const sql = "SELECT * FROM TABLERO_CALIDAD WHERE empresa_id = ?";
    db.all(sql, [req.query.empresa_id], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener los criterios de aceptación" });
      }
      res.status(200).json({ TABLERO_CALIDAD: rows });
    });
  });

  // Método PUT para actualizar un criterio de aceptación
  router.put("/criterioAceptacion/:id", (req, res) => {
    const { nombre, criterio, valor, producto_id, empresa_id } = req.body;
    const { id } = req.params;
    if (!nombre || !criterio || !valor || !producto_id || !empresa_id) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      UPDATE TABLERO_CALIDAD 
      SET nombre = ?, criterio = ?, valor = ?, producto_id = ?, empresa_id = ? 
      WHERE ID = ?
    `;
    db.run(
      sql,
      [nombre, criterio, valor, producto_id, empresa_id, id],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al actualizar el criterio de aceptación" });
        }
        res.status(200).json({
          message: "Criterio de aceptación actualizado exitosamente.",
          changes: this.changes,
        });
      }
    );
  });

  // Método DELETE para eliminar un criterio de aceptación
  router.delete("/criterioAceptacion/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM TABLERO_CALIDAD WHERE ID = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al eliminar el criterio de aceptación" });
      }
      res.status(200).json({
        message: "Criterio de aceptación eliminado exitosamente.",
        changes: this.changes,
      });
    });
  });

  return router; // Retornamos el router configurado
};
