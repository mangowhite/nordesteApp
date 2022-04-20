// Script to show/hide selectors in the form.
const selectTransporte = document.querySelector("#select-transporte");
const inputHide = document.querySelectorAll(".input-hide")
document.querySelector("#select-mudanca").addEventListener(
  "change",
  (e) => {
    const isLocal = e.target.selectedOptions[0].textContent === "Local";

    selectTransporte.required = !isLocal;
    selectTransporte.parentElement.classList.toggle("hide", isLocal);
    inputHide.forEach(e => e.classList.toggle("input-hide", isLocal));

    if (isLocal) selectTransporte.options[0].selected = true;
  },
  { passive: true }
);

//GOOGLE DOCS API SCRIPT

const APIKEY = "AIzaSyAt8lfnPF6nwN9a02YWTzHWPQEtuY6ZRBU";
const CLIENTID = "729387998943-ii34osakf0qqa6qlcvn6f1dq9r5bov9r.apps.googleusercontent.com";
let MODELID = "1PeiHamkA9BRvEPTeIbQX_cb12UuOdq4wlMZAJfYqJV8";

// The Google API will be loaded once the windows is started.
window.addEventListener("load", () => {
  authenticate().then(loadClient);
});

// Inside the form I added an event listener to do all the necessary operations.
const form = document.querySelector("#form");
form.addEventListener("submit", (e) => {

  e.preventDefault();
  const formData = new FormData(form);
  const options = { year: "numeric", month: "long", day: "numeric" }
  const time = new Date().toLocaleString("pt-br", options);
  let titleObject;

  if (formData.get("mudanca") === "Local") {

    titleObject = {
      cliente: formData.get("nome"),
      tipo: "Local"
    };

    const requestArray = [
      formRequest(formData.get("nome"), "argumento1"),
      formRequest(formData.get("email"), "argumento2"),
      formRequest(formData.get("numero"), "argumento3"),
      formRequest(time, "argumento4"),
      formRequest(formData.get("valor"), "argumento5"),
      formRequest(formData.get("localDeEnvio"), "argumento7"),
      formRequest(formData.get('valor').extenso(true), "argumento8")
    ]
    execute(titleObject, requestArray);
  }
});

/**
 * Creates a json body with a Google API request body for batch update method.
 * 
 * @param {string} newText Text that will replace the old text.
 * @param {string} toReplace The old text.
 * @returns One replaceAllText kind request.
 */
function formRequest(newText, toReplace) {

  let request = {
    "replaceAllText": {
      "replaceText": newText,
      "containsText": {
        "text": `[${toReplace}]`,
        "matchCase": false
      }
    }
  }
  return request
}

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive" })
    .then(function () { console.log("Sign-in successful"); },
      function (err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey(APIKEY);
  gapi.client.load("https://content.googleapis.com/discovery/v1/apis/drive/v2/rest")
    .then(function () { console.log("GAPI client loaded for API (DRIVE)"); },
      function (err) { console.error("Error loading GAPI client for API", err); })
  return gapi.client.load("https://docs.googleapis.com/$discovery/rest?version=v1")
    .then(function () { console.log("GAPI client loaded for API (DOCS)"); },
      function (err) { console.error("Error loading GAPI client for API", err); });
}

async function execute(title, requestArray) {
  let copy = gapi.client.drive.files.copy({
    "fileId": MODELID,
    "resource": {}
  }).then((res) => res.result.id);

  const numbers = gapi.client.drive.files.list({
    "q": "title contains 'ORÇAMENTO'",
    "orderBy": "modifiedDate desc,title"
  }).then((res) => {
    return res.result.items
      .filter(e => e.title.match(/\d+/))
      .map(final => final.title.match(/\d+/g)[0])
      .sort((a, b) => a - b);
  });
  const lastSent = parseInt((await numbers).slice(-1), 10) + 1;
  requestArray.push(formRequest(lastSent.toString(), "argumento6"))
  gapi.client.drive.files.patch({
    "fileId": await copy,
    "resource": {
      "title": "ORÇAMENTO " + lastSent + " - " + title.cliente + " - " + title.tipo
    }
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
    },
      function (err) { console.error("Execute error", err); });
  const url = `https://docs.google.com/document/d/${await copy}/edit`
  return gapi.client.docs.documents.batchUpdate({
    "documentId": await copy,
    "resource": {
      "requests": requestArray
    }
  })
    .then(function (response) {
      console.log("Response", response);
      window.open(url, undefined, "popup");
    },
      function (err) { console.error("Execute error", err); });
}
//+ Carlos R. L. Rodrigues
//@ http://jsfromhell.com/string/extenso [rev. #3]
// Sinceramente, não perca seu tempo tentando entender isso. Está claro que o autor não quis criar algo fácil de ler, então só usa a função já que ela funciona.

String.prototype.extenso = function (c) {
  var ex = [
    ["zero", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez", "onze", "doze", "treze", "quatorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove"],
    ["dez", "vinte", "trinta", "quarenta", "cinqüenta", "sessenta", "setenta", "oitenta", "noventa"],
    ["cem", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"],
    ["mil", "milhão", "bilhão", "trilhão", "quadrilhão", "quintilhão", "sextilhão", "setilhão", "octilhão", "nonilhão", "decilhão", "undecilhão", "dodecilhão", "tredecilhão", "quatrodecilhão", "quindecilhão", "sedecilhão", "septendecilhão", "octencilhão", "nonencilhão"]
  ];
  var a, n, v, i, n = this.replace(c ? /[^,\d]/g : /\D/g, "").split(","), e = " e ", $ = "real", d = "centavo", sl;
  for (var f = n.length - 1, l, j = -1, r = [], s = [], t = ""; ++j <= f; s = []) {
    j && (n[j] = (("." + n[j]) * 1).toFixed(2).slice(2));
    if (!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
    for (a = -1, l = v.length; ++a < l; t = "") {
      if (!(i = v[a] * 1)) continue;
      i % 100 < 20 && (t += ex[0][i % 100]) ||
        i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ""));
      s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) +
        ((t = l - a - 2) > -1 ? " " + (i > 1 && t > 0 ? ex[3][t].replace("ão", "ões") : ex[3][t]) : ""));
    }
    a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(" ") + e + a) : s.join("") || ((!j && (n[j + 1] * 1 > 0) || r.length) ? "" : ex[0][0]));
    a && r.push(a + (c ? (" " + (v.join("") * 1 > 1 ? j ? d + "s" : (/0{6,}$/.test(n[0]) ? "de " : "") + $.replace("l", "is") : j ? d : $)) : ""));
  }
  return r.join(e);
}

gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: CLIENTID });
}); 