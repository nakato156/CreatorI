let check = document.getElementById("view_pass");
let password = document.getElementById("password");
const form = document.getElementById("formi");
function validar_form(form) {
    if (form.names.value && form.password.value) {
        return true;
    }
    return false;
}
function redirect(response) {
    if (response["response"]) {
        console.log(response["response"]);
    }
    else if (response["auth"] === true) {
        window.location.href = "/";
    }
    else {
        alert(response["error"]);
    }
}
check.addEventListener("change", () => {
    if (check.checked) {
        password.setAttribute("type", "text");
    }
    else {
        password.setAttribute("type", "password");
    }
});
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validar_form(form)) {
        const data = new FormData(form);
        let req = fetch("/login", {
            method: "POST",
            body: data
        })
            .then(res => res.json())
            .then(info => redirect(info))
            .catch(err => console.log(err));
    }
    else {
        alert("llene todos los campos");
    }
});
export {};
