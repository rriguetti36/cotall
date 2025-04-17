const ftp = require("basic-ftp");
const path = require("path");

async function uploadToHostinger(localPath, remoteFileName, idcia) {
  console.log("entra en funcion para carga de archivo Hostinger");
  const client = new ftp.Client();
  client.ftp.verbose = true; // Puedes quitar esto luego
  
  try {
    await client.access({
      host: "185.245.180.75",   
      user: "u959681907.usercotall",           
      password: "Cotall1$",    
      secure: false                      // Cambia a true si tienes SSL configurado
    });
    //const currentDir = await client.pwd();
    //console.log("Directorio actual:", currentDir);

    await client.ensureDir("uploads/" + idcia); // Ruta remota
    await client.uploadFrom(localPath, `/uploads/${idcia}/${remoteFileName}`);
    console.log("✅ Archivo subido a Hostinger");
  } catch (err) {
    console.error("❌ Error al subir archivo:", err);
  } finally {
    client.close();
  }
}

module.exports = uploadToHostinger;