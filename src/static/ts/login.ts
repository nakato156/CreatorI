export {};

let check = document.getElementById("view_pass") as HTMLFormElement;
let password = document.getElementById("password") as HTMLFormElement;
const form = document.getElementById("formi") as HTMLFormElement;

function validar_form(form:HTMLFormElement){
    if(form.names.value && form.password.value){
        return true
    }
    return false
}

function redirect(response:object){
    if(response["response"]){
        console.log(response["response"])
    }else if(response["auth"]===true){
        window.location.href = "/";
    }else{
        alert(response["error"])
    }
}

check.addEventListener("change", ()=>{
    if(check.checked){
        password.setAttribute("type","text");
    }else{
        password.setAttribute("type","password");
    }
});

form.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(validar_form(form)){
        const data:FormData = new FormData(form);
        let req:Promise<void> = fetch("/login",{
            method:"POST",
            body: data
        })
        .then(res=>res.json())
        .then(info=>redirect(info))
        .catch(err=>console.log(err))
        
    }else{
        alert("llene todos los campos")
    }
})