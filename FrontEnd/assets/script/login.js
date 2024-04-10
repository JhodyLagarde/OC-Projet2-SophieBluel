// /////// Page Login ///////

const email = document.querySelector("#email");
const password = document.querySelector("#password");
const sectionConnection = document.querySelector("#connection");
const form = document.querySelector("form");
const ErreurMdpEmail = document.createElement("p");

//eventListener sur le submit du formulaire 
form.addEventListener("submit", function(e){
	//preventDefault pour empecher le rechargement de la page sur le click
    e.preventDefault();
		//lecture des valeurs dans les input email et password
		const utilisateur = {
			email: document.querySelector('#email').value,
			password: document.querySelector('#password').value,
		};
	//envoie d'un demande avec valeurs "utilisateur" à l'API avec la method "POST"
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        //verifier si les données envoyé correspondes au données de l'API
        body: JSON.stringify(utilisateur),
    })
	//Lecture de la reponse de l'API et utilisation de switch pour traiter les differents resultats
    .then(function(response){
        switch(response.status) {
			//Message d'erreur pour Email ou password incorrect sur les cas 401 et 404
            case 401:
            case 404:
				ErreurMdpEmail.remove();
				ErreurMdpEmail.classList.add("err-message");
				sectionConnection.appendChild(ErreurMdpEmail);
				ErreurMdpEmail.innerText = "E-mail ou mot de passe incorrect.";
				sectionConnection.insertBefore(ErreurMdpEmail,form);
				email.classList.remove("input-form")
				password.classList.remove("input-form")
				email.classList.add("err-input");
				password.classList.add("err-input");
            throw new Error("E-mail ou mot de passe incorrect");
			//Si cas 200 alors retourner les données de l'API login
            case 200:
            return response.json();
            //Si cas inconnu (default)
            default:
            throw new Error("Erreur code inconnu");
        }
    })
	//localStorage pour stocker le token sur le navigateur et retour a la page principal
    .then(function(data) {
        localStorage.setItem("token", data.token);
        location.href = "index.html";
    })
});
