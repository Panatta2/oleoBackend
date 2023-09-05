const express = require("express");
const router = express.Router();

module.exports = function (db) {
  // Método POST para crear un nuevo vehículo
  router.post("/createVehiculo", (req, res) => {
    const {
      placa,
      modelo,
      tipo_vehiculo,
      tipo_licencia,
      color_cabezal,
      color_remolque,
      foto_peso_tara,
      peso_tara,
      foto_matricula,
      foto_frontal,
      foto_posterior,
      foto_lateral,
      estado_v,
      vetado,
      chofer_id,
      transportista_id,
    } = req.body;
    if (
      !placa ||
      !modelo ||
      !tipo_vehiculo ||
      !tipo_licencia ||
      !color_cabezal ||
      !color_remolque ||
      !foto_peso_tara ||
      !peso_tara ||
      !foto_matricula ||
      !foto_frontal ||
      !foto_posterior ||
      !foto_lateral ||
      !estado_v ||
      !vetado ||
      !chofer_id ||
      !transportista_id
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      INSERT INTO vehiculos (placa, modelo, tipo_vehiculo, tipo_licencia, color_cabezal, color_remolque, foto_peso_tara, peso_tara, foto_matricula, foto_frontal, foto_posterior, foto_lateral, estado_v, vetado, chofer_id, transportista_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [
        placa,
        modelo,
        tipo_vehiculo,
        tipo_licencia,
        color_cabezal,
        color_remolque,
        foto_peso_tara,
        peso_tara,
        foto_matricula,
        foto_frontal,
        foto_posterior,
        foto_lateral,
        estado_v,
        vetado,
        chofer_id,
        transportista_id,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error al agregar vehículo" });
        }
        res.status(201).json({
          message: "Vehículo agregado exitosamente.",
          id: this.lastID,
        });
      }
    );
  });

  // Método GET para obtener todos los vehículos
  router.get("/getVehiculos", (req, res) => {
    const sql = "SELECT * FROM vehiculos";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener los vehículos" });
      }
      res.status(200).json({ vehiculos: rows });
    });
  });

  // Método PUT para actualizar un vehículo
  router.put("/vehiculo/:id", (req, res) => {
    const {
      placa,
      modelo,
      tipo_vehiculo,
      tipo_licencia,
      color_cabezal,
      color_remolque,
      foto_peso_tara,
      peso_tara,
      foto_matricula,
      foto_frontal,
      foto_posterior,
      foto_lateral,
      estado_v,
      vetado,
      chofer_id,
      transportista_id,
    } = req.body;
    const { id } = req.params;
    if (
      !placa ||
      !modelo ||
      !tipo_vehiculo ||
      !tipo_licencia ||
      !color_cabezal ||
      !color_remolque ||
      !foto_peso_tara ||
      !peso_tara ||
      !foto_matricula ||
      !foto_frontal ||
      !foto_posterior ||
      !foto_lateral ||
      !estado_v ||
      !vetado ||
      !chofer_id ||
      !transportista_id
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      UPDATE vehiculos 
      SET placa = ?, modelo = ?, tipo_vehiculo = ?, tipo_licencia = ?, color_cabezal = ?, color_remolque = ?, foto_peso_tara = ?, peso_tara = ?, foto_matricula = ?, foto_frontal = ?, foto_posterior = ?, foto_lateral = ?, estado_v = ?, vetado = ?, chofer_id = ?, transportista_id = ? 
      WHERE ID = ?
    `;
    db.run(
      sql,
      [
        placa,
        modelo,
        tipo_vehiculo,
        tipo_licencia,
        color_cabezal,
        color_remolque,
        foto_peso_tara,
        peso_tara,
        foto_matricula,
        foto_frontal,
        foto_posterior,
        foto_lateral,
        estado_v,
        vetado,
        chofer_id,
        transportista_id,
        id,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al actualizar el vehículo" });
        }
        res.status(200).json({
          message: "Vehículo actualizado exitosamente.",
          changes: this.changes,
        });
      }
    );
  });

  // Método DELETE para eliminar un vehículo
  router.delete("/vehiculo/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM vehiculos WHERE ID = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar el vehículo" });
      }
      res.status(200).json({
        message: "Vehículo eliminado exitosamente.",
        changes: this.changes,
      });
    });
  });

  return router; // Retornamos el router configurado
};
