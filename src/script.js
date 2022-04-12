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
