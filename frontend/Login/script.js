const email = document.getElementById("email");
const contraseña = document.getElementById("contraseña");

function validarEmail(input) {
    const email = input.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
    if (email === '') {
        error(input, "Debe completar el campo email");
        return false;
    }
    else if (!emailRegex.test(email)) {
        error(input, "Su email no cumple con el formato");
        return false;
    }
    return true;
}

function validarContraseña(input) {
    const password = input.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    if (password === '') {
        error(input, "Debe completar el campo contraseña");
        return false;
    }
    if (!passwordRegex.test(password)) {
        error(input, "Su contraseña no cumple con el formato");
        return false;
    }
    return true;
}

function error(input, errormessage) {
    const div = input.parentElement;
    const small = div.querySelector('small');
    small.innerText = errormessage;
    div.className = "divinputerror";
}

document.getElementById("LogInForm").addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailValido = validarEmail(email);
    const contraseñaValida = validarContraseña(contraseña);

    if (emailValido && contraseñaValida) {
        var formData = new FormData(document.getElementById("LogInForm"));
        await fetchPost(formData);

        if (localStorage.getItem("token" != null) || localStorage.getItem("token") != undefined) {
            window.location.href = "../principal/index.html"
        }
    }
});

async function fetchPost(persona) {
    try {
        const response = await fetch("http://localhost/backend/auth/login", {
            method: 'POST',
            body: persona
        })

        if (response.status === 400) {
            error(email, "");
            error(contraseña, "Su email o contraseña no es válido");
            email.value = "";
            contraseña.value = "";
            return;
        }

        if (!response.ok) {
            throw new Error("No funciona");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token)

    } catch (err) {
        console.log(err);
    }
}