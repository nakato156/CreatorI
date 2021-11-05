let form_video = document.getElementById("form_video");
form_video.addEventListener("submit", function (e) {
    e.preventDefault();
    let data = new FormData(form_video);
    let req = fetch("/upload", {
        method: "POST",
        body: data
    })
        .then(res => res.json())
        .then(data => {
        if (data["response"]) {
            if (data["response"] == "ok") {
                form_video.reset();
            }
            else {
                console.log(data["response"]);
            }
        }
        else {
            console.error(data);
        }
    })
        .catch(err => console.error(`has ocurred error: ${err}`));
});
