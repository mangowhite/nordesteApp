// Script to show/hide selector.
const selectTransporte = document.querySelector("#select-transporte");

document.querySelector("#select-mudanca").addEventListener(
  "change",
  (e) => {
    const isLocal = e.target.selectedOptions[0].textContent === "Local";

    selectTransporte.required = !isLocal;
    selectTransporte.parentElement.classList.toggle("hide", isLocal);
    if (isLocal) selectTransporte.options[0].selected = true;
  },
  { passive: true }
);
// Google docs API

import data from './local.json' assert {type: "json"};

const CLIENT_ID = '921739400001-b0pee66k2t6d4ngjfdm186h64ns2fisl.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAVyCKXswoOC-JM_bc8uILkHyAebDz5bLg';

const form = document.querySelector("form")
var formData;
form.addEventListener(
  "submit", () => {
    formData = new FormData(form)
    authenticate().then(loadClient).then(execute);
  }
);

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file" })
    .then(function () { console.log("Sign-in successful"); },
      function (err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey(API_KEY);
  return gapi.client.load("https://docs.googleapis.com/$discovery/rest?version=v1")
    .then(function () { console.log("GAPI client loaded for API"); },
      function (err) { console.error("Error loading GAPI client for API", err); });
}
function execute() {
  const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' }
  const creationDate = new Date()
  const creationDateFormatted = creationDate.toLocaleDateString('pt-br', dateOptions);
  return gapi.client.docs.documents.create({
    "resource": {
      "title": formData.get('name') + " " + formData.get('origem') + " X " + formData.get('destino'),
      "body": data.body
    },
  })
    .then(function (response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
    },
      function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
  gapi.auth2.init({ client_id: CLIENT_ID });
});