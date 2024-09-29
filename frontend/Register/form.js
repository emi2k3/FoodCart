var nameinput = document.getElementById('nombre');
var surnameinput = document.getElementById('apellido');
var emailinput = document.getElementById('email');
var telefonoinput = document.getElementById('telefono');
var calleinput = document.getElementById('calle');
var numeroinput = document.getElementById('numero');
var aptoinput = document.getElementById('apto');
var passwordinput = document.getElementById('password');
var repeatPasswordinput = document.getElementById('repeatedPassword');

function validarNombre(input) {
    const nombre = input.value;
    const regex = /\d/g;
    if (nombre === '') {
        error(input, 'Su nombre no puede estar vacío.');
        return false;
    } else if (regex.test(nombre)) {
        error(input, 'Su nombre no puede tener números.');
        return false;
    } else if (nombre.length < 3) {
        error(input, 'Su nombre no puede tener menos de 3 letras.');
        return false;
    } else if (nombre.length > 20) {
        error(input, 'Su nombre no puede tener más de 20 letras.');
        return false;
    } else {
        exito(input);
        return true;
    }
}

function validarApellido(input) {
    const apellido = input.value;
    const regex = /\d/g;
    if (apellido === '') {
        error(input, 'Su apellido no puede estar vacío.');
        return false;
    } else if (regex.test(apellido)) {
        error(input, 'Su apellido no puede tener números.');
        return false;
    } else if (apellido.length < 3) {
        error(input, 'Su apellido no puede tener menos de 3 letras.');
        return false;
    } else if (apellido.length > 20) {
        error(input, 'Su apellido no puede tener más de 20 letras.');
        return false;
    } else {
        exito(input);
        return true;
    }
}

function validarEmail(input) {
    const email = input.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email === '') {
        error(input, 'Su email no puede estar vacío.');
        return false;
    } else if (!emailRegex.test(email)) {
        error(input, 'El email ingresado no es correcto.');
        return false;
    } else {
        exito(input);
        return true;
    }
}

function validarTelefono(input) {
    const telefono = input.value;
    if (telefono === '') {
        error(input, 'Su telefono no puede estar vacío.');
        return false;
        // falta capaz alguna validación más específica    
    } else {
        exito(input);
        return true;
    }
}

function validarCalle(input) {
    const calle = input.value;
    if (calle === '') {
        error(input, 'El campo calle no puede estar vacío.');
        return false;
        // falta capaz alguna validación más específica    
    } else {
        exito(input);
        return true;
    }
}

function validarNumero(input) {
    const numero = input.value;
    if (numero === '') {
        error(input, 'El campo numero no puede estar vacío.');
        return false;
        // falta capaz alguna validación más específica    
    } else {
        exito(input);
        return true;
    }
}

function validarApto(input) {
    const apto = input.value;
    if (apto === '') {
        exito(input);
        return true;
    } else {
        exito(input);
        return true;
    }
}

function validarContraseña(input) {
    const password = input.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    if (password === '') {
        error(input, 'La contraseña no puede estar vacía.');
        return false;
    } else if (!passwordRegex.test(password)) {
        error(input, 'Entre 8 y 20 caracteres, incluyendo may, min, números y caracteres especiales.');
        return false;
    } else {
        exito(input);
        return true;
    }
}

function validarRepetirContraseña(contraseñaPrincipal, contraseñaRepetida) {
    const password = contraseñaPrincipal.value;
    const repetirContraseña = contraseñaRepetida.value;

    if (!validarContraseña(contraseñaPrincipal) || password === '') {
        error(contraseñaRepetida, 'La contraseña principal no es válida.');
        return false;
    }

    if (repetirContraseña === '') {
        error(contraseñaRepetida, "Debe completar el campo contraseña");
        return false;
    }
    if (repetirContraseña !== password) {
        error(contraseñaRepetida, "Las contraseñas no coinciden");
        return false;
    }
    exito(contraseñaRepetida);
    return true;
}

function error(input, errorMessage) {
    const containerform = input.closest('.containerform');
    const small = containerform.querySelector('small');
    small.innerText = errorMessage;
    containerform.classList.remove('exito');
    containerform.classList.add('error');
}


function exito(input) {
    const containerform = input.closest('.containerform');
    const small = containerform.querySelector('small');
    small.innerText = "";
    containerform.classList.remove('error');
    containerform.classList.add('exito');
}

nameinput.addEventListener("blur", () => validarNombre(nameinput));
surnameinput.addEventListener("blur", () => validarApellido(surnameinput));
emailinput.addEventListener("blur", () => validarEmail(emailinput));
telefonoinput.addEventListener("blur", () => validarTelefono(telefonoinput));
calleinput.addEventListener("blur", () => validarCalle(calleinput));
numeroinput.addEventListener("blur", () => validarNumero(numeroinput));
aptoinput.addEventListener("blur", () => validarApto(aptoinput));
passwordinput.addEventListener("blur", () => validarContraseña(passwordinput));
repeatPasswordinput.addEventListener("blur", () => validarRepetirContraseña(passwordinput, repeatPasswordinput));

document.getElementById("registroForm").addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombreValido = validarNombre(nameinput);
    const apellidoValido = validarApellido(surnameinput);
    const emailValido = validarEmail(emailinput);
    const telefonoValido = validarTelefono(telefonoinput);
    const calleValida = validarCalle(calleinput);
    const numeroValido = validarNumero(numeroinput);
    const aptoValido = validarApto(aptoinput);
    const contraseñaValida = validarContraseña(passwordinput);
    const repetirContraseñaValida = validarRepetirContraseña(passwordinput, repeatPasswordinput);

    if (nombreValido && apellidoValido && emailValido && telefonoValido && calleValida && numeroValido
        && aptoValido && contraseñaValida && repetirContraseñaValida) {

        var formData = new FormData(document.getElementById("registroForm"));
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });
        await fetchPost(formData);
        window.location.href = '../Login/index.html'
    } else {
        alert('Por favor, corrija los errores antes de enviar el formulario.');
    }
})

async function fetchPost(persona) {
    try {
        const response = await fetch("http://localhost/backend/usuarios", {
            method: 'POST',
            body: persona
        })
        if (!response.ok) {
            throw new Error("No funciona");
        }
    } catch (err) {
        console.log(err);
    }
}