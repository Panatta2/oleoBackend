const { app, BrowserWindow } = require("electron");
const server = require("./server");
const server2 = require("./serverNode");
const {
  iniciarSincronizacionPeriodica,
} = require("./src/utils/sincronizacion");
const startServer = require("./serverNode");

const bdPath = "./oleoDavila.db";
const urlApiBase = "http://localhost:8181/ords/administracion/api";
const tablasParaSincronizar = [
  { ruta: "user", tabla: "usuarios" },
  { ruta: "empresa", tabla: "EMPRESA" },
  { ruta: "finca", tabla: "FINCA", empresa_id: true },
  { ruta: "proveedores", tabla: "PROVEEDORES", empresa_id: true },
  { ruta: "tablero_calidad", tabla: "TABLERO_CALIDAD", empresa_id: true },
  { ruta: "ticket", tabla: "TICKET_MP", empresa_id: true },
  { ruta: "transportistas", tabla: "TRANSPORTISTAS", empresa_id: true },
  { ruta: "vehiculo", tabla: "VEHICULO", empresa_id: true },
  // ... (añade aquí objetos similares para cada tabla y ruta de API correspondiente)
];

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false, // Desactiva las políticas de seguridad web
    },
  });
  // win.webContents.openDevTools();
  // win.loadFile("web/index.html");
  win.loadURL("http://localhost:8877");
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  // La tabla configuracion se creará automáticamente al iniciar el servidor, no es necesario llamar a CrearTablaConfiguracion aquí.
  iniciarSincronizacionPeriodica(bdPath, urlApiBase, tablasParaSincronizar);
  createWindow();
  startServer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
