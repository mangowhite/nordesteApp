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

//GOOGLE DOCS API
window.addEventListener('load', () => {
  authenticate().then(loadClient)
});

const form = document.querySelector('#form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log(formData.get('nome'));
  execute(formData.get('nome'), data.body);
});

function authenticate() {
  return gapi.auth2.getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file" })
    .then(function() { console.log("Sign-in successful"); },
      function(err) { console.error("Error signing in", err); });
}
function loadClient() {
  gapi.client.setApiKey(process.env.APIKEY);
  return gapi.client.load("https://docs.googleapis.com/$discovery/rest?version=v1")
    .then(function() { console.log("GAPI client loaded for API"); },
      function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(title, body) {

  let copy = gapi.client.drive.files.copy({
    "fileId": process.env.MODELID,
    "resource": {}
  });

  function renameRequest() {
    const init = {
      method: 'PATCH',
      headers: {
        "Authorization": `Bearer  [YOUR_ACCESS_TOKEN]`,
      }
    }
  }
  let id = copy.id
  return gapi.client.docs.documents.batchUpdate({
    "documentId": id,
    "resource": {}
  })
    .then(function(response) {
      // Handle the results here (response.result has the parsed body).
      console.log("Response", response);
    },
      function(err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function() {
  gapi.auth2.init({ client_id: process.env.APICLIENT });
});