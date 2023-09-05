const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
function crearTablaConfiguracion(db) {
  db.get(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='configuracion'",
    (err, row) => {
      if (err) {
        console.error(
          "Error al verificar la existencia de la tabla:",
          err.message
        );
        return;
      }

      if (!row) {
        db.run(
          "CREATE TABLE configuracion (id INTEGER PRIMARY KEY AUTOINCREMENT, empresa TEXT, puerto_serial TEXT, expresion_regular TEXT, url TEXT)",
          (err) => {
            if (err) {
              console.error(
                "Error al crear la tabla configuracion:",
                err.message
              );
            } else {
              console.log("Tabla configuracion creada exitosamente.");
            }
          }
        );
      } else {
        console.log("La tabla configuracion ya existe.");
      }
    }
  );
}

try {
  let db = new sqlite3.Database("./oleoDavila.db", (err) => {
    if (err) {
      console.error("Error al conectar con la base de datos:", err.message);
      return;
    }
    console.log("Conectado a la base de datos SQLite.");

    crearTablaConfiguracion(db); // Llamamos la función aquí para crear la tabla si no existe

    // Cargar dinámicamente las rutas desde los archivos de servicios
    const servicesDir = path.join(__dirname, "src", "services");
    fs.readdir(servicesDir, (err, files) => {
      if (err) {
        console.error("Error al leer el directorio de servicios:", err);
        return;
      }

      files.forEach((file) => {
        const servicePath = path.join(servicesDir, file);
        if (fs.statSync(servicePath).isDirectory()) {
          const apiPath = path.join(servicePath, "api.js");
          if (fs.existsSync(apiPath)) {
            const routes = require(apiPath)(db);
            app.use(`/${file}`, routes);
          }
        }
      });

      // Manejar cierre de conexión a la base de datos en caso de interrupción
      process.on("SIGINT", () => {
        db.close((err) => {
          if (err) {
            console.error("Error al cerrar la base de datos:", err.message);
          } else {
            console.log("Cerrando la conexión a la base de datos.");
          }
          process.exit(0);
        });
      });

      // Iniciar el servidor
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
      });
    });
  });
} catch (ex) {
  console.error("Error en el proceso principal:", ex);
}
