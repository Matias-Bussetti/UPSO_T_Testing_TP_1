import { Auth } from "../app.js";

window.onload = () => {
  var btnLogout = document.querySelector(".btn-selector-logout");

  if (btnLogout) {
    btnLogout.onclick = () => Auth.logout();
  }
};
