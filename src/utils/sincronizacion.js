const sqlite3 = require("sqlite3").verbose();
const axios = require("axios");
const cron = require("node-cron");

async function obtenerEmpresaId(db) {
  return new Promise((resolve, reject) => {
    var local = db.get(
      "SELECT empresa FROM configuracion LIMIT 1",
      [],
      (error, row) => {
        console.log(local);
        if (error) {
          reject(error);
          return;
        }
        resolve(row ? row.empresa : null);
      }
    );
  });
}

async function obtenerDatosTabla(urlApi, empresaId, necesitaEmpresaId = false) {
  try {
    const urlConParametro =
      necesitaEmpresaId && empresaId
        ? `${urlApi}?empresa_id=${empresaId}`
        : urlApi;
    const response = await axios.get(urlConParametro);
    return response.data.items || [];
  } catch (error) {
    console.error(`Error al obtener datos de ${urlApi}:`, error);
    return [];
  }
}

async function obtenerRegistrosActualizados(db, tabla) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM ${tabla.tabla} WHERE actualizado IS NOT NULL`,
      [],
      (error, rows) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(rows);
      }
    );
  });
}

function borrarRegistros(db, tabla) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM ${tabla.tabla}`, [], (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function sincronizarTabla(bdPath, urlApiBase, tabla, empresaId) {
  const db = new sqlite3.Database(
    bdPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  );

  const registrosActualizados = await obtenerRegistrosActualizados(db, tabla);
  if (registrosActualizados.length > 0) {
    console.log(`Enviando registros actualizados de ${tabla.tabla} a Apex...`);
  }
  await borrarRegistros(db, tabla);

  try {
    const urlApi = `${urlApiBase}/${tabla.ruta}/${tabla.tabla}`;
    const datos = await obtenerDatosTabla(urlApi, empresaId, tabla.empresa_id);
    datos.forEach((dato) => {
      const columnas = Object.keys(dato).join(", ");
      const placeholders = Object.keys(dato)
        .map(() => "?")
        .join(", ");
      const valores = Object.values(dato);
      db.run(
        `INSERT INTO ${tabla.tabla} (${columnas}) VALUES (${placeholders})`,
        valores
      );
    });
  } catch (error) {
    console.error(`Error al sincronizar ${tabla.tabla}:`, error);
  }

  db.close();
}

function generarEsquemaDeTablaDesdeItems(items) {
  if (!items || items.length === 0) {
    console.warn(
      "No hay items para generar el esquema de la tabla. Creando tabla con esquema mínimo."
    );
    return "id TEXT, actualizado TEXT";
  }

  const sampleItem = items[0];
  const columnas = Object.keys(sampleItem)
    .map((key) => `${key} TEXT`)
    .join(", ");

  return columnas + ", actualizado TEXT";
}

async function crearTablaSiNoExiste(db, tabla, urlApiBase, empresaId) {
  const urlApi = `${urlApiBase}/${tabla.ruta}/${tabla.tabla}`;
  const datos = await obtenerDatosTabla(urlApi, empresaId, tabla.empresa_id);
  const esquema = generarEsquemaDeTablaDesdeItems(datos);
  const query = `CREATE TABLE IF NOT EXISTS ${tabla.tabla} (${esquema})`;
  db.run(query, (error) => {
    if (error) {
      console.error(`Error al crear la tabla ${tabla.tabla}:`, error);
    }
  });
}

async function iniciarSincronizacionPeriodica(bdPath, urlApiBase, tablas) {
  const db = new sqlite3.Database(
    bdPath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
  );

  let empresaId = await obtenerEmpresaId(db);
  console.log(empresaId);

  if (!empresaId) {
    console.error(
      "Es necesario configurar la empresa. Intentando nuevamente en 60 segundos."
    );
    setInterval(async () => {
      empresaId = await obtenerEmpresaId(db);
      if (empresaId) {
        console.log(
          "Configuración de empresa encontrada. Iniciando sincronización..."
        );
        iniciarSincronizacion(db, bdPath, urlApiBase, tablas, empresaId);
      }
    }, 60000); // Intenta cada 60 segundos
  } else {
    iniciarSincronizacion(db, bdPath, urlApiBase, tablas, empresaId);
  }
}

async function iniciarSincronizacion(
  db,
  bdPath,
  urlApiBase,
  tablas,
  empresaId
) {
  try {
    for (let tabla of tablas) {
      await crearTablaSiNoExiste(db, tabla, urlApiBase, empresaId);
    }

    await Promise.all(
      tablas.map((tabla) =>
        sincronizarTabla(bdPath, urlApiBase, tabla, empresaId)
      )
    );

    tablas.forEach((tabla) => {
      cron.schedule("* * * * *", () => {
        console.log(`Lector serial prueto COM3 30 40 50`);
        console.log(
          `Ejecutando tarea programada de sincronizacion para ${tabla.tabla}...`
        );
        sincronizarTabla(bdPath, urlApiBase, tabla, empresaId).catch((error) =>
          console.error(error)
        );
      });
    });
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
}

module.exports = {
  iniciarSincronizacionPeriodica,
};
