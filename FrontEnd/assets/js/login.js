const element = {
password: document.querySelector('#password'),
email: document.querySelector('#email'),
submit: document.querySelector('#submitUserInfo'),

}
const boutonLogin = element.submit.addEventListener("click", (a) => {
    a.preventDefault()

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: element.email.value,
            password: element.password.value,
        })
    })
    .then((response) => response.json())
    .then((data) => {
        localStorage.setItem("token", data.token)

        if(data.message || data.error) {
            alert("Erreur dans l\'identifiant ou le mot de passe")
        } else {
            localStorage.setItem("isConnected", JSON.stringify(true))
            window.location.replace("index.html")
        }
    })

})