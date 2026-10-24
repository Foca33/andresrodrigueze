/**
 * HELA · Registro de pedidos del libro impreso (Google Apps Script)
 *
 * Recibe cada pedido desde la página (/api/order), lo guarda en la hoja "Pedidos"
 * y te avisa por correo. También le manda un correo de "pedido recibido" al comprador.
 *
 * Antes de implementar: Configuración del proyecto (engranaje) → Propiedades del script →
 *   SECRET       = una clave larga inventada por ti (la misma que pondrás en Netlify)
 *   OWNER_EMAIL  = (opcional) correo donde quieres recibir los avisos. Si no la pones, usa el de tu cuenta.
 */

var SHEET_NAME = 'Pedidos';
var HEADERS = ['Fecha', 'Pedido', 'Estado', 'Nombre', 'Correo', 'Celular', 'Ciudad', 'Departamento', 'Dirección', 'Indicaciones', 'Valor', 'Origen', 'Guía / Notas'];
var ESTADOS = ['Pendiente de pago', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];
var VALOR = 70000;

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || d.secret !== secret) return out_({ ok: false, error: 'unauthorized' });

    lock.waitLock(15000);
    var sheet = getSheet_();
    if (d.action === 'paid' || d.action === 'void') return out_(registrarPago_(sheet, d));
    var fecha = Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm');
    sheet.appendRow([
      fecha, d.orderId, 'Pendiente de pago',
      safe_(d.name), safe_(d.email), "'" + safe_(d.phone), safe_(d.city), safe_(d.dept),
      safe_(d.address), safe_(d.notes), VALOR, safe_(d.source), ''
    ]);
    SpreadsheetApp.flush();

    var owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || Session.getEffectiveUser().getEmail();
    try {
      MailApp.sendEmail({
        to: owner,
        subject: 'Nuevo pedido HELA ' + d.orderId + ' · ' + d.city,
        body: 'Pedido ' + d.orderId + ' (pendiente de pago)\n\n' +
          d.name + '\n' + d.email + ' · ' + d.phone + '\n' +
          d.address + '\n' + d.city + ', ' + d.dept + '\n' +
          (d.notes ? 'Indicaciones: ' + d.notes + '\n' : '') +
          '\nConfírmalo cuando veas el pago en Bold (Historial de ventas) y cambia el Estado en la hoja.'
      });
      MailApp.sendEmail({
        to: d.email,
        name: 'Andrés Rodríguez E. · HELA',
        replyTo: owner,
        subject: 'Recibimos tu pedido de HELA (' + d.orderId + ')',
        body: 'Hola ' + String(d.name).split(' ')[0] + ',\n\n' +
          'Registramos tu pedido ' + d.orderId + ' de HELA impresa ($70.000, envío incluido a ' + d.city + ').\n' +
          'Queda confirmado cuando se acredite el pago en la página de Bold. Si ya pagaste, no tienes que hacer nada más: te avisamos cuando salga el paquete.\n\n' +
          'Si algo está mal en tus datos, responde este correo.\n\nAndrés Rodríguez E.'
      });
    } catch (mailErr) {
      // El pedido ya quedó guardado; un fallo de correo no debe tumbarlo.
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

/**
 * Aviso de pago de Bold (llega desde /api/bold-webhook).
 * Busca el pedido por número, lo marca "Pagado" (o "Cancelado" si Bold anuló el pago), anota el id del pago
 * y te avisa. Es idempotente: si el id del pago ya está anotado, no repite nada.
 */
function registrarPago_(sheet, d) {
  var owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || Session.getEffectiveUser().getEmail();
  var last = sheet.getLastRow();
  var ids = last > 1 ? sheet.getRange(2, 2, last - 1, 1).getValues() : [];
  var row = -1;
  for (var i = 0; i < ids.length; i++) { if (ids[i][0] === d.orderId) { row = i + 2; break; } }

  if (row === -1) {
    MailApp.sendEmail(owner, 'HELA: pago sin pedido en la hoja (' + d.orderId + ')',
      'Bold aprobó un pago con referencia ' + d.orderId + ' (' + d.amount + ' COP, id ' + d.paymentId + ') que no está en la hoja. Revísalo en Bold → Historial de ventas.');
    return { ok: true, found: false };
  }
  var notes = String(sheet.getRange(row, 13).getValue());
  if (d.paymentId && notes.indexOf(d.paymentId) !== -1) return { ok: true, duplicate: true };

  var v = sheet.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  var nota = (d.action === 'paid' ? 'Bold pagó ' : 'Bold anuló ') + d.paymentId + ' · ' + (d.method || '') + ' · ' +
    Utilities.formatDate(new Date(), 'America/Bogota', 'yyyy-MM-dd HH:mm');
  sheet.getRange(row, 13).setValue(notes ? notes + ' | ' + nota : nota);

  if (d.action === 'void') {
    sheet.getRange(row, 3).setValue('Cancelado');
    MailApp.sendEmail(owner, 'HELA: pago ANULADO ' + d.orderId, 'Bold anuló el pago del pedido ' + d.orderId + ' (' + v[3] + '). Quedó como Cancelado en la hoja.');
    return { ok: true };
  }

  var estado = v[2];
  var montoOk = Number(d.amount) >= VALOR;
  // Solo un pedido "Pendiente de pago" pasa a "Pagado". Si ya estaba pagado/enviado/entregado (otro aviso del
  // mismo cobro) o el monto no corresponde, solo se anota y se te avisa, sin cambiar el estado.
  if (estado !== 'Pendiente de pago' || !montoOk) {
    MailApp.sendEmail(owner, 'HELA: revisa el pago de ' + d.orderId,
      'Bold aprobó un pago (' + d.amount + ' COP, id ' + d.paymentId + ') del pedido ' + d.orderId + ' que está en estado "' + estado + '"' +
      (montoOk ? '.' : ' y el monto no es ' + VALOR + '.') + ' No cambié el estado; revísalo en Bold → Historial de ventas.');
    return { ok: true, unchanged: true };
  }
  sheet.getRange(row, 3).setValue('Pagado');
  MailApp.sendEmail({
    to: owner,
    subject: 'PAGADO · HELA ' + d.orderId + ' · ' + v[6],
    body: 'Pago aprobado en Bold.\n\n' +
      'Pedido ' + d.orderId + '\n' + v[3] + '\n' + v[4] + ' · ' + String(v[5]).replace("'", '') + '\n' +
      v[8] + '\n' + v[6] + ', ' + v[7] + '\n' + (v[9] ? 'Indicaciones: ' + v[9] + '\n' : '') +
      '\nA despachar. Cuando lo envíes, cambia el Estado a "Enviado" y anota la guía.'
  });
  try {
    MailApp.sendEmail({
      to: v[4], name: 'Andrés Rodríguez E. · HELA', replyTo: owner,
      subject: 'Pago recibido: tu pedido de HELA (' + d.orderId + ')',
      body: 'Hola ' + String(v[3]).split(' ')[0] + ',\n\nRecibimos tu pago. Tu pedido ' + d.orderId + ' queda confirmado y lo despachamos a ' + v[6] + '. Te avisamos por este correo cuando salga.\n\nAndrés Rodríguez E.'
    });
  } catch (e) {}
  return { ok: true };
}

function doGet() {
  return out_({ ok: true, service: 'hela-pedidos' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.getRange(2, 3, 2000, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 6, 2000, 1).setNumberFormat('@');
  }
  return sheet;
}

// Evita que un texto que empiece con = + - @ se ejecute como fórmula en la hoja.
function safe_(v) {
  var s = String(v == null ? '' : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}


/**
 * Resumen diario: te escribe SOLO si hay algo pendiente.
 *  - Pedidos "Pendiente de pago": revisa el Historial de ventas de Bold y márcalos "Pagado" o "Cancelado".
 *  - Pedidos "Pagado" sin enviar: hay que despacharlos.
 * Se activa con un activador de tiempo (ver instrucciones). No se ejecuta solo al implementar.
 */
function resumenDiario() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getLastRow() < 2) return;
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  var pendientes = [], porEnviar = [];
  var ahora = new Date();
  rows.forEach(function (r) {
    var estado = r[2];
    if (!r[1]) return;
    var linea = r[1] + ' · ' + r[3] + ' · ' + r[6] + ' (' + r[0] + ')';
    if (estado === 'Pendiente de pago') pendientes.push(linea);
    else if (estado === 'Pagado') porEnviar.push(linea + ' · ' + r[8]);
  });
  if (!pendientes.length && !porEnviar.length) return;

  var owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') || Session.getEffectiveUser().getEmail();
  var cuerpo = '';
  if (porEnviar.length) cuerpo += 'POR ENVIAR (' + porEnviar.length + '):\n' + porEnviar.join('\n') + '\n\n';
  if (pendientes.length) cuerpo += 'PENDIENTES DE PAGO (' + pendientes.length + '): revisa Bold → Historial de ventas.\n' + pendientes.join('\n') + '\n\n';
  cuerpo += 'Hoja: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();
  MailApp.sendEmail({
    to: owner,
    subject: 'HELA pedidos · ' + porEnviar.length + ' por enviar · ' + pendientes.length + ' pendientes de pago',
    body: cuerpo
  });
}
