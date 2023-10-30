const element = {
    password: document.querySelector("#password"),
    email: document.querySelector("#email"),
    submit: document.querySelector("#submitUserInfo"),
};

const messageAlert = document.querySelector('.alert')
let boutonLogin = element.submit.addEventListener("click", (a) => {
    a.preventDefault();

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
        email: element.email.value,
        password: element.password.value,
        }),
        })
        .then((response) => response.json())
        .then((data) => {
           
            if (data.message || data.error) {
               messageAlert.textContent='Identifiant ou mot de passe incorrect'
            } else {
                localStorage.setItem("Token", data.token);
                localStorage.setItem("isConnected", JSON.stringify(true))
                window.location.replace("index.html");
            }
        })
});

