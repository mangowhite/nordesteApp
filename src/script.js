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

// Client ID and API key from the Developer Console
var CLIENT_ID = process.env.CLIENTID
var API_KEY = process.env.APIKEY;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ['https://docs.googleapis.com/$discovery/rest?version=v1'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.

var SCOPES = "https://www.googleapis.com/auth/documents.readonly https://www.googleapis.com/auth/drive.file" ;

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function() {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    handleAuth();

  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    console.log(printDocTitle());
  } else {
    console.log('error')
  }
}

/**
 *  Sign in the user.
 */
function handleAuth() {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/1mer0H2a4yuMWLaRP8vW4x42MLEkI_FTe6xw3HDyxMdU/edit
 */
function printDocTitle() {
  gapi.client.docs.documents.create({
}).then(function(response) {
  var doc = response.result;
  var title = doc.title;
  appendPre('Documento "' + title + '" criado com sucesso.\n');
}, function(response) {
  appendPre('Error: ' + response.result.error.message);
});
}
console.log('Script iniciada.');
