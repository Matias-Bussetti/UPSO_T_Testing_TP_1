//para hacer verificaciones dentro del formulario
var form = document.getElementById('form');
    nameUs = form.name;
    password = form.password;
    error = document.getElementById('error');

function validateName (e){
    if (nameUs.value == '' || nameUs.value == null){
        error.style.display = 'block';
        error.innerHTML += '<li> Por favor complete el nombre del usuario</li>';
        console.log('Por favor complete el nombre de usuario');

        e.preventDefault();
        
    } else{
        error.style.display= 'none';
    }
}

function validatePassword (e){
    if (password.value == '' || password.value == null){
        error.style.display='block';
        error.innerHTML += '<li>Por favor complete la contraseña';
        console.log('Por favor complete la contraseña');

        e.preventDefault();
    }
    else{
        error.style.display='none';
    }
}

//funcion que se encarga de validar los campos 
function  validateForm(e){
    //reinicio el error para que inicie sin mensaje
    error.innerHTML='';

    validateName(e);
    validatePassword(e);
}

form.addEventListener('submit',validateForm);