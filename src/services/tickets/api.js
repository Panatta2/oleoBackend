const express = require("express");
const router = express.Router();

module.exports = function (db) {
  // Método POST para crear un nuevo ticket
  router.post("/createTicket", (req, res) => {
    const {
      esta_eliminado,
      ip_estacion,
      fecha_peso_bruto,
      peso_tara,
      peso_bruto,
      foto_peso_bruto,
      foto_entrada_camion,
      foto_peso_tara,
      foto_salida_camion,
      fecha_peso_tara,
      estado,
      comentario,
      precio_compra,
      empresa_id,
      producto_id,
      finca_id,
      proveedor_id,
      chofer_id,
      vehiculo_id,
      transportista_id,
      id_cap,
      trabajador_id,
      orden_compra_id,
      recepcion_id,
    } = req.body;
    if (
      !ip_estacion ||
      !fecha_peso_bruto ||
      !peso_tara ||
      !peso_bruto ||
      !fecha_peso_tara ||
      !estado ||
      !comentario ||
      !precio_compra
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      INSERT INTO TICKET_MP (esta_eliminado, ip_estacion, fecha_peso_bruto, peso_tara, peso_bruto,fecha_peso_tara, estado, comentario, precio_compra, empresa_id, producto_id, finca_id, proveedor_id, chofer_id, vehiculo_id, transportista_id, id_cap, trabajador_id, orden_compra_id, recepcion_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
      sql,
      [
        esta_eliminado,
        ip_estacion,
        fecha_peso_bruto,
        peso_tara,
        peso_bruto,
        fecha_peso_tara,
        estado,
        comentario,
        precio_compra,
        empresa_id,
        producto_id,
        finca_id,
        proveedor_id,
        chofer_id,
        vehiculo_id,
        transportista_id,
        id_cap,
        trabajador_id,
        orden_compra_id,
        recepcion_id,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Error al agregar ticket" });
        }
        res.status(201).json({
          message: "Ticket agregado exitosamente.",
          id: this.lastID,
        });
      }
    );
  });

  // Método GET para obtener todos los tickets
  router.get("/getTickets", (req, res) => {
    const sql = "SELECT * FROM TICKET_MP";
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error al obtener los tickets" });
      }
      res.status(200).json({ tickets: rows });
    });
  });

  // Método PUT para actualizar un ticket
  router.put("/ticket/:id", (req, res) => {
    const {
      esta_eliminado,
      ip_estacion,
      fecha_peso_bruto,
      peso_tara,
      peso_bruto,
      foto_peso_bruto,
      foto_entrada_camion,
      foto_peso_tara,
      foto_salida_camion,
      fecha_peso_tara,
      estado,
      comentario,
      precio_compra,
      empresa_id,
      producto_id,
      finca_id,
      proveedor_id,
      chofer_id,
      vehiculo_id,
      transportista_id,
      id_cap,
      trabajador_id,
      orden_compra_id,
      recepcion_id,
    } = req.body;
    const { id } = req.params;
    if (
      !ip_estacion ||
      !fecha_peso_bruto ||
      !peso_tara ||
      !peso_bruto ||
      !fecha_peso_tara ||
      !estado ||
      !comentario ||
      !precio_compra
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
      UPDATE TICKET_MP 
      SET esta_eliminado = ?, ip_estacion = ?, fecha_peso_bruto = ?, peso_tara = ?, peso_bruto = ?, foto_peso_bruto = ?, foto_entrada_camion = ?, foto_peso_tara = ?, foto_salida_camion = ?, fecha_peso_tara = ?, estado = ?, comentario = ?, precio_compra = ?, empresa_id = ?, producto_id = ?, finca_id = ?, proveedor_id = ?, chofer_id = ?, vehiculo_id = ?, transportista_id = ?, id_cap = ?, trabajador_id = ?, orden_compra_id = ?, recepcion_id = ? 
      WHERE ID = ?
    `;
    db.run(
      sql,
      [
        esta_eliminado,
        ip_estacion,
        fecha_peso_bruto,
        peso_tara,
        peso_bruto,
        foto_peso_bruto,
        foto_entrada_camion,
        foto_peso_tara,
        foto_salida_camion,
        fecha_peso_tara,
        estado,
        comentario,
        precio_compra,
        empresa_id,
        producto_id,
        finca_id,
        proveedor_id,
        chofer_id,
        vehiculo_id,
        transportista_id,
        id_cap,
        trabajador_id,
        orden_compra_id,
        recepcion_id,
        id,
      ],
      function (err) {
        if (err) {
          return res
            .status(500)
            .json({ error: "Error al actualizar el ticket" });
        }
        res.status(200).json({
          message: "Ticket actualizado exitosamente.",
          changes: this.changes,
        });
      }
    );
  });

  // Método DELETE para eliminar un ticket
  router.delete("/ticket/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM TICKET_MP WHERE ID = ?";
    db.run(sql, [id], function (err) {
      if (err) {
        return res.status(500).json({ error: "Error al eliminar el ticket" });
      }
      res.status(200).json({
        message: "Ticket eliminado exitosamente.",
        changes: this.changes,
      });
    });
  });

  return router; // Retornamos el router configurado
};
