import { Auth } from "/app.js";

//para hacer verificaciones dentro del formulario
var form = document.getElementById("form");
var nameUs = form.name;
var password = form.password;
var error = document.getElementById("error");

// funcion que valida si se pusieron caracteres en el nombre
function validateName(e) {
  if (nameUs.value == "" || nameUs.value == null) {
    error.style.display = "block";
    error.innerHTML += "<li> Por favor complete el nombre del usuario</li>";
    console.log("Por favor complete el nombre de usuario");

    e.preventDefault();
  } else {
    error.style.display = "none";
  }
}

//Funcion que valida si se pusieron caracteres en la contraseña
function validatePassword(e) {
  if (password.value == "" || password.value == null) {
    error.style.display = "block";
    error.innerHTML += "<li>Por favor complete la contraseña";
    console.log("Por favor complete la contraseña");

    e.preventDefault();
  } else {
    error.style.display = "none";
  }
}

//funcion que se encarga de validar los campos
function validateForm(e) {
  e.preventDefault();
  //reinicio el error para que inicie sin mensaje
  error.innerHTML = "";

  //validateName(e);
  //validatePassword(e);

  //Validar contraseña o username
  if (Auth.login(nameUs.value, password.value)) {
    //Codigo Si sale ok
  }
}

form.addEventListener("submit", validateForm);
