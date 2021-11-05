export {};
let check = document.getElementById("view_pass") as HTMLFormElement;
let password = document.getElementById("password") as HTMLFormElement;
let confir = document.getElementById("confirm") as HTMLFormElement;
const form = document.getElementById("formi") as HTMLFormElement;

function validar_form(form:HTMLFormElement){
    if(form.names.value && form.email.value && form.phone.value && form.password.value && form.confirm.value){
        return true
    }
    return false
}

function redirect(response:object){
    if(response["response"]){
        console.log(response["response"])
    }else{
        alert(response["error"])
    }
}

check.addEventListener("change", ()=>{
    if(check.checked){
        password.setAttribute("type","text");
        confir.setAttribute("type","text");
    }else{
        password.setAttribute("type","password");
        confir.setAttribute("type","password");
    }
});

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(validar_form(form)){
        if(password.value!="" && (password.value  === confir.value)){
            const data:FormData = new FormData(form);
            let req:Promise<void> = fetch("/register",{
                method:"POST",
                body: data
            })
            .then(res=>res.json())
            .then(info=>redirect(info))
            .catch(err=>console.log(err))
        }else{
            alert("Las contraseñas no coinciden o estan vacías");
        }
    }else{
        alert("llene todos los campos")
    }
})