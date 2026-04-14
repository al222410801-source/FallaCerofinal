const fs = require('fs');
const { faker } = require('@faker-js/faker');
faker.locale = 'es';

const TOTAL_CIUDADANOS = 1000;
const TOTAL_DENUNCIAS = 2000;
const TOTAL_SERVIDORES = 200;
const TOTAL_EVIDENCIAS = 800;

const sqlPath = 'falla_cero.sql';
const sqlFile = fs.createWriteStream(sqlPath);

sqlFile.write(`-- Insert data para FallaCero (generado con faker v2)\n`);
sqlFile.write(`-- Tablas: ciudadanos, denuncias, servidores_publicos, evidencias, det_evidencias, historial_estados\n\n`);

console.log('Generando ciudadanos...');
for (let i = 1; i <= TOTAL_CIUDADANOS; i++) {
  const nombre = faker.person.firstName().replace(/'/g, "''");
  const apellido_p = faker.person.lastName().replace(/'/g, "''");
  const apellido_m = faker.person.lastName().replace(/'/g, "''");
  const correo = faker.internet.email().replace(/'/g, "''");
  const telefono = faker.phone.number('9########');
  const fecha = faker.date.past({years:2}).toISOString().slice(0,10);
  sqlFile.write(`INSERT INTO ciudadanos (id_ciudadano, nombre, apellido_p, apellido_m, correo, telefono, fecha_registro) VALUES (${i}, '${nombre}', '${apellido_p}', '${apellido_m}', '${correo}', '${telefono}', '${fecha}');\n`);
  if (i % 200 === 0) console.log(`${i} ciudadanos escritos`);
}

sqlFile.write('\n-- Servidores publicos\n');
for (let i = 1; i <= TOTAL_SERVIDORES; i++) {
  const nombre = faker.person.firstName().replace(/'/g, "''");
  const apellido_p = faker.person.lastName().replace(/'/g, "''");
  const apellido_m = faker.person.lastName().replace(/'/g, "''");
  const email = faker.internet.email().replace(/'/g, "''");
  const cargo = faker.person.jobTitle().replace(/'/g, "''");
  const telefono = faker.phone.number('9########');
  const dependencia = faker.company.name().replace(/'/g, "''");
  const fecha = faker.date.past({years:5}).toISOString().slice(0,10);
  const activo = faker.helpers.arrayElement([true, true, true, false]);
  sqlFile.write(`INSERT INTO servidores_publicos (id_servidor, nombre, apellido_p, apellido_m, email_personal, cargo, telefono, dependencia, fecha_ingreso, activo) VALUES (${i}, '${nombre}', '${apellido_p}', '${apellido_m}', '${email}', '${cargo}', '${telefono}', '${dependencia}', '${fecha}', ${activo});\n`);
}

sqlFile.write('\n-- Evidencias\n');
for (let i = 1; i <= TOTAL_EVIDENCIAS; i++) {
  const img = `/uploads/evidencia_${i}.jpg`;
  const obs = faker.lorem.sentence(8).replace(/'/g, "''");
  sqlFile.write(`INSERT INTO evidencias (id_evidencia, imagen, observaciones) VALUES (${i}, '${img}', '${obs}');\n`);
}

// Denuncias + mapa denuncia->ciudadano
sqlFile.write('\n-- Denuncias\n');
const categorias = ['Vandalismo','Iluminación pública','Residuos','Pavimento','Semáforo','Falta de agua','Ruido','Vegetación'];
const prioridades = ['Baja','Media','Alta'];
const denunciaToCiudadano = new Array(TOTAL_DENUNCIAS + 1);
for (let i = 1; i <= TOTAL_DENUNCIAS; i++) {
  const ciudadanoId = faker.number.int({min:1, max: TOTAL_CIUDADANOS});
  const titulo = faker.lorem.sentence(6).replace(/'/g, "''");
  const fecha = faker.date.between({from: new Date(new Date().setMonth(new Date().getMonth()-11)), to: new Date()}).toISOString().slice(0,10);
  const categoria = faker.helpers.arrayElement(categorias);
  const prioridad = faker.helpers.arrayElement(prioridades);
  sqlFile.write(`INSERT INTO denuncias (id_denuncia, ciudadano_id, titulo, fecha_denuncia, categoria, prioridad) VALUES (${i}, ${ciudadanoId}, '${titulo}', '${fecha}', '${categoria}', '${prioridad}');\n`);
  denunciaToCiudadano[i] = ciudadanoId;
  if (i % 500 === 0) console.log(`${i} denuncias escritas`);
}

// Detalle de evidencias (asegurar FK denuncia/evidencia válidos)
sqlFile.write('\n-- Detalle de evidencias\n');
let detId = 1;
for (let d = 1; d <= TOTAL_DENUNCIAS; d++) {
  const n = faker.number.int({min:0, max:2});
  for (let k = 0; k < n; k++) {
    const evidId = faker.number.int({min:1, max: TOTAL_EVIDENCIAS});
    const desc = faker.lorem.sentence(6).replace(/'/g, "''");
    sqlFile.write(`INSERT INTO det_evidencias (id_det_evidencia, denuncia_id, evidencia_id, descripcion) VALUES (${detId}, ${d}, ${evidId}, '${desc}');\n`);
    detId++;
  }
}

// Historiales de estado: usar ciudadano de la denuncia para FK
sqlFile.write('\n-- Historiales de estado\n');
const estados = ['RECIBIDO','EN_REVISION','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO','RECHAZADO'];
let histId = 1;
for (let d = 1; d <= TOTAL_DENUNCIAS; d++) {
  const pasos = faker.number.int({min:0, max:3});
  for (let p = 0; p < pasos; p++) {
    const fecha = faker.date.between({from: new Date(new Date().setMonth(new Date().getMonth()-11)), to: new Date()}).toISOString().slice(0,10);
    const obs = faker.lorem.sentence(10).replace(/'/g, "''");
    const estado = faker.helpers.arrayElement(estados);
    const servidorId = faker.number.int({min:1, max: TOTAL_SERVIDORES});
    // asignar el ciudadano asociado a la denuncia
    const ciudadanoId = denunciaToCiudadano[d] || faker.number.int({min:1, max: TOTAL_CIUDADANOS});
    sqlFile.write(`INSERT INTO historial_estados (id_historial, fecha, observaciones, estado, ciudadano_id, denuncia_id, servidor_publico_id) VALUES (${histId}, '${fecha}', '${obs}', '${estado}', ${ciudadanoId}, ${d}, ${servidorId});\n`);
    histId++;
  }
}

sqlFile.end(() => {
  console.log('Archivo falla_cero.sql regenerado por v2.');
  validarSQL(sqlPath);
});

function validarSQL(ruta) {
  const contenido = fs.readFileSync(ruta, 'utf8');
  const ciudadanosInsert = (contenido.match(/INSERT INTO ciudadanos/g) || []).length;
  const denunciasInsert = (contenido.match(/INSERT INTO denuncias/g) || []).length;
  console.log(`Inserts: ciudadanos=${ciudadanosInsert}, denuncias=${denunciasInsert}`);
}

console.log('Script listo: node 02-generar_sql_fallacero_v2.js');
