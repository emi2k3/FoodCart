var nameinput = document.getElementById('nombre');
var surnameinput = document.getElementById('apellido');
var emailinput = document.getElementById('email');
var passwordinput = document.getElementById('password');
var repeatPasswordinput = document.getElementById('repeatPassword');

function validarNombre(input) {
    const nombre = input.value;
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

function validarContraseña(input) {
    const password = input.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

    if (password === '') {
        error(input, 'La contraseña no puede estar vacía.');
        return false;
    } else if (!passwordRegex.test(password)) {
        error(input, 'Entre 8 y 20 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
        return false;
    } else {
        exito(input);
        return true;
    }
}

function validarRepetirContraseña(contraseñaPrincipal, contraseñaRepetida) {
    const password = contraseñaPrincipal.value;
    const repetirContraseña = contraseñaRepetida.value;

    if (!validarPassword(contraseñaPrincipal)) {
        error(repetirContraseña, 'La contraseña principal no es válida.');
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

function error(input, errormessage) {
    const div = input.parentElement;
    const small = div.querySelector('small');
    small.innerText = errormessage;
    div.className = "divinputerror";
}

function exito(input) {
    const div = input.parentElement;
    const small = div.querySelector('small');
    small.innerText = "";
    div.className = "divinputsuccess";
}

nameinput.addEventListener("blur", () => validarNombre(nameinput));
surnameinput.addEventListener("blur", () => validarApellido(surnameinput));
emailinput.addEventListener("blur", () => validarEmail(emailinput));
passwordinput.addEventListener("blur", () => validarContraseña(passwordinput));
repeatPasswordinput.addEventListener("blur", () => validarRepetirContraseña(passwordinput, repeatPasswordinput));

document.getElementById("RegistroForm").addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombreValido = validarNombre(nameinput);
    const apellidoValido = validarApellido(surnameinput);
    const emailValido = validarEmail(emailinput);
    const contraseñaValida = validarContraseña(passwordinput);
    const repetirContraseñaValida = validarRepetirContraseña(passwordinput, repeatPasswordinput);

    if (nombreValido && apellidoValido && emailValido && contraseñaValida && repetirContraseñaValida) {
        var formData = new FormData(document.getElementById("RegistroForm"));
        await fetchPost(formData);
        window.location.href = "../login/index.html";
    }
})

async function fetchPost(persona) {
    try {
        const response = await fetch("http://localhost/backend/personas", {
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