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

const form = document.querySelector('#form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log(formData.get('nome'));
  execute(formData.get('nome'));      
});
