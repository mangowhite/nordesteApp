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

const submit = document.querySelector('[type="form"]').addEventListener();
// Google docs API
import 'dotenv/config';
import gapi from "https://apis.google.com/js/api.js";

// Client ID and API key from the Developer Console
require("dotenv").config();
const CLIENT_ID = process.env.CLIENTID;
const API_KEY = process.env.APIKEY;

function authenticate() {
  return gapi.auth2.getAuthInstance()
      .signIn({scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file"})
      .then(function() { console.log("Sign-in successful"); },
            function(err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey("YOUR_API_KEY");
  return gapi.client.load("https://docs.googleapis.com/$discovery/rest?version=v1")
      .then(function() { console.log("GAPI client loaded for API"); },
            function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
  return gapi.client.docs.documents.create({
    "resource": {}
  })
      .then(function(response) {
              // Handle the results here (response.result has the parsed body).
              console.log("Response", response);
            },
            function(err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function() {
  gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
});
