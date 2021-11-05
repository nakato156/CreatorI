let check = document.getElementById("view_pass");
let password = document.getElementById("password");
let confir = document.getElementById("confirm");
const form = document.getElementById("formi");
function validar_form(form) {
    if (form.names.value && form.email.value && form.phone.value && form.password.value && form.confirm.value) {
        return true;
    }
    return false;
}
function redirect(response) {
    if (response["response"]) {
        console.log(response["response"]);
    }
    else {
        alert(response["error"]);
    }
}
check.addEventListener("change", () => {
    if (check.checked) {
        password.setAttribute("type", "text");
        confir.setAttribute("type", "text");
    }
    else {
        password.setAttribute("type", "password");
        confir.setAttribute("type", "password");
    }
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validar_form(form)) {
        if (password.value != "" && (password.value === confir.value)) {
            const data = new FormData(form);
            let req = fetch("/register", {
                method: "POST",
                body: data
            })
                .then(res => res.json())
                .then(info => redirect(info))
                .catch(err => console.log(err));
        }
        else {
            alert("Las contraseñas no coinciden o estan vacías");
        }
    }
    else {
        alert("llene todos los campos");
    }
});
export {};
