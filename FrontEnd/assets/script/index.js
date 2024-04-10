/////////////////////////////
///////PAGE PRINCIPALE///////
/////////////////////////////

const gallery = document.querySelector(".gallery");
const figure = document.querySelectorAll("figure");
const filter = document.querySelector(".filter");

///////////////////////////////////////
///////PRESENTATION DES TRAVAUX//////// 
///////////////////////////////////////

// Récuperation des travaux via l'API

fetch("http://localhost:5678/api/works")
.then(function(response){
    if (response.ok){
        return response.json();
    };
})

// Affichage des figures

.then(function(data){
    const works = data;
    // creation des figures
    works.forEach((projets) => {
        const figure = document.createElement("figure"); 
        figure.classList.add("projets-figure", "category-0", `category-${projets.category.id}`);
        figure.setAttribute("id", `projet-figure-${works.id}`)
        const imageFigure = document.createElement("img");
        imageFigure.src = projets.imageUrl;
        imageFigure.alt = projets.title;
        const titreFigure = document.createElement("figcaption");
        titreFigure.innerText = projets.title;
        gallery.appendChild(figure);
        figure.appendChild(imageFigure);
        figure.appendChild(titreFigure);
    });

    // affichage des figures dans la modale galerie avec un seul fetch

    modalGalerie (works);
});

// Recuperation des categories via l'API

fetch("http://localhost:5678/api/categories")
.then(function(response){
    if (response.ok){
        return response.json();
    };
})

// Affichage des boutons et filtre

.then(function(data){
    const categories = data;
    
    // utilisation de unshift pour créer le bouton "Tous" qui n'est pas dans le tableau des données categories de l'API
    categories.unshift({id: 0, name: "Tous"});
    // creation des boutons
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.classList.add("bouton-filtre", `.bouton-filtre-${category.id}`);
        button.setAttribute("id", category.id);
        button.innerText = category.name;
        filter.appendChild(button);
        //changer la couleur du bouton "Tous" par defaut actif
        if(category.id === 0) button.classList.add("bouton-actif")
        const mesFigures = document.querySelectorAll(".projets-figure");
        //filtre
        button.addEventListener('click', function(event) {
			event.preventDefault();
            
            //Caché toutes les figures
			document.querySelectorAll(".projets-figure").forEach(workFigure => {
				workFigure.classList.add("figure-cache");
			});
            //N'affiché que les figures correspondant avec l'id du bouton cliqué 
			document.querySelectorAll(`.projets-figure.category-${category.id}`).forEach(workFigure => {
				workFigure.classList.remove("figure-cache");
			});

            //changer la couleur du bouton filtre actif
            document.querySelectorAll(".bouton-filtre.bouton-actif").forEach(boutonFiltre => {
                boutonFiltre.classList.remove("bouton-actif");
            });
            event.target.classList.add("bouton-actif");
        });
        
    });

    // affichage des categories dans la modale photo avec un seul fetch

    modalAjoutPhoto (categories);
   
});

///////////////////////////////////////////////////////
///////COMPORTEMENTS DE CONNECTION/DECONNECTION//////// 
///////////////////////////////////////////////////////

// Changement quand connecté

if (localStorage.getItem("token") != null) {
    document.querySelector(".mode-edition").classList.remove("deconnecte");
    document.querySelector(".logout").classList.remove("deconnecte");
    document.querySelector(".modifier-projet").classList.remove("deconnecte");
    document.querySelector(".login").classList.add("connecte");
    document.querySelector(".filter").classList.add("connecte");
};

// Déconnection

document.getElementById("logout").addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    document.querySelector(".mode-edition").classList.add("deconnecte");
    document.querySelector(".logout").classList.add("deconnecte");
    document.querySelector(".modifier-projet").classList.add("deconnecte");
    document.querySelector(".login").classList.remove("connecte");
    document.querySelector(".filter").classList.remove("connecte");
});

/////////////////////////////////////////////////////////////
///////COMPORTEMENTS D'OUVERTURE/FERMETURE DES MODALES/////// 
/////////////////////////////////////////////////////////////

// Ouverture et fermeture de la modale galerie

let modal = null;
let modalPhoto = null;

//fonction d'ouverture de la modale galerie

const ouvrirModaleGalerie = function(e) {
    e.preventDefault()
    modal = document.querySelector("#modal1")
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", fermerModaleGallerie)    
    modal.querySelector("#modal-1-croix-fermer").addEventListener("click", fermerModaleGallerie);
    document.querySelector(".js-modale-stop").addEventListener("click", stopPropagation);
    
    let btnModalPhoto = document.getElementById("btn-ajouter-photo")
    btnModalPhoto.addEventListener("click", fermerModaleGallerie);
    btnModalPhoto.addEventListener("click", ouvrirModalePhoto);
};

//fonction de fermeture de la modale galerie

const fermerModaleGallerie = function(e) {
    if (modal === null) return
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", fermerModaleGallerie)
    modal.querySelector("#modal-1-croix-fermer").removeEventListener("click", fermerModaleGallerie);
    modal = null
};

// Ouverture et fermeture de la modale Photo
//fonction d'ouverture de la modale photo

const ouvrirModalePhoto = function(e) {
    e.preventDefault()
    modalPhoto = document.querySelector("#modal2")
    modalPhoto.style.display = null
    modalPhoto.removeAttribute("aria-hidden")
    modalPhoto.setAttribute("aria-modal", "true")
    modalPhoto.addEventListener("click", fermerModalePhoto)    
    modalPhoto.querySelector("#modal-2-croix-fermer").addEventListener("click", fermerModalePhoto);
    document.querySelector(".js-modale-stop2").addEventListener("click", stopPropagation);
    document.getElementById("fleche-retour").addEventListener("click", flecheRetour)
};

//fonction de fermeture de la modale photo

const fermerModalePhoto = function(e) {
    if (modalPhoto === null) return
    document.getElementById("modal-form-ajout-photo").reset();
    modalPhoto.style.display = "none"
    modalPhoto.setAttribute("aria-hidden", "true")
    modalPhoto.removeAttribute("aria-modal")
    modalPhoto.removeEventListener("click", fermerModaleGallerie)
    modalPhoto.querySelector("#modal-2-croix-fermer").removeEventListener("click", fermerModaleGallerie);
    modalPhoto = null
    //reset de la previsualisation de l'image dans la modale photo lorsque l'on ferme la modale
    resetPrevisu ();
};

// fonction de retour en arriere avec la fleche de la modale photo

const flecheRetour = function(e) {
    e.preventDefault()
    if (modalPhoto === null) return
    modalPhoto.style.display = "none"
    modalPhoto.setAttribute("aria-hidden", "true")
    modalPhoto.removeAttribute("aria-modal")
    modalPhoto.querySelector("#modal-2-croix-fermer").removeEventListener("click", fermerModaleGallerie);
    modalPhoto = null
    //reset de la previsualisation de l'image dans la modale photo lorsque l'on ferme la modale
    resetPrevisu ();
    ouvrirModaleGalerie(e)
};

//Stop propagation pour eviter que la modale se ferme si clic a l'interieur des modales

const stopPropagation = function(e) {
    e.stopPropagation()
};

//addEventListener sur le bouton modifier pour ouvrir la premiere modale

document.getElementById("ouvrir-modal").addEventListener("click", ouvrirModaleGalerie);

///////////////////////////////////////////////////////////////
///////COMPORTEMENTS DE SUPPRESSION DE TRAVAUX EXISTANTS/////// 
///////////////////////////////////////////////////////////////

//afficher et gérer le contenue dans la modale "Galerie photo"

const galleryModal = document.querySelector(".modal-contenu-work")

//fonction d'affichage des figures dans la modale

function modalGalerie (works) {
    // creation des figures et icone poubelle
    works.forEach((projets) => {
        const figure = document.createElement("figure"); 
        figure.classList.add("modal-projets-figure", "category-0", `category-${projets.category.id}`);
        figure.setAttribute("id", `modal-projet-figure-${projets.id}`);
        const imageFigure = document.createElement("img");
        imageFigure.src = projets.imageUrl;
        imageFigure.alt = projets.title;
        const iconTrash = document.createElement('i');
        iconTrash.classList.add('fa-solid', 'fa-trash-can', 'trash');
        galleryModal.appendChild(figure);
        figure.appendChild(imageFigure);
        figure.appendChild(iconTrash);
        //supprimer les projets en cliquant sur la poubelle
        iconTrash.addEventListener('click', function(event) {
            event.preventDefault();
            if(confirm("Voulez-vous supprimer cet élément ?")) {
                fetch(`http://localhost:5678/api/works/${projets.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('token')
                    }
                })
                .then(function(response) {
                    switch(response.status) {
                        case 500:
                        case 503:
                            alert("Unexpected Behaviour");
                        break;
                        case 401:
                            alert("Unauthorized");
                        break;
                        case 200:
                        case 204:
                            document.getElementById(`projet-figure-${projets.id}`).remove();
                            document.getElementById(`modal-projet-figure-${projets.id}`).remove();
                        break;
                        default:
                        throw new Error("Erreur code inconnu");
                    }
                })
            };
        });
    });
};

/////////////////////////////////////////////////////
///////COMPORTEMENT D'ENVOI DE NOUVEAUX PROJET///////
///////AU BACK-END VIA LE FORMULAIRE DE MODALE///////
/////////////////////////////////////////////////////

//Fonction d'ajout des categories dans les options de la modale ajout photo

function modalAjoutPhoto (data) {
	const categories = data;
    //Shift pour enlever la categorie "Tous"
    categories.shift()
    categories.forEach((category) => {
        const choixCategorie = document.createElement("option");
        choixCategorie.setAttribute("value", category.id);
		choixCategorie.textContent = category.name;
        document.querySelector("select").appendChild(choixCategorie);
	});
};

//Verifier la taille de l'image envoyé

document.getElementById("modal-input-ajouter-nouvelle-photo").addEventListener("change", () => {
    const fileInput = document.getElementById("modal-input-ajouter-nouvelle-photo");
    const tailleMaxImage = 4 * 1024 * 1024;
    if(fileInput.files[0].size > tailleMaxImage) {
        alert("Fichier trop volumineux.");
        document.getElementById("modal-input-ajouter-nouvelle-photo").value = '';
    }
    else {
        if(fileInput.files.length > 0) {
            // Création de la prévisualisation
            let previsuImage = document.createElement("img");
            previsuImage.setAttribute("id","modal-previsu-image");
            previsuImage.src = URL.createObjectURL(fileInput.files[0]);
            document.querySelector(".form-modal-ajout-photo").appendChild(previsuImage);
            document.querySelector("#modal-icone-ajout-photo").style.display = "none"
            document.querySelector(".modal-ajouter-nouvelle-photo").classList.add("modal-previsu-photo-actif");
            document.querySelector("#modal-input-ajouter-nouvelle-photo").classList.add("modal-previsu-photo-actif");
            document.querySelector(".modal-format-taille-photo").classList.add("modal-previsu-photo-actif");
            let modalAjoutPhoto = document.querySelector(".form-modal-ajout-photo");
            modalAjoutPhoto.style.padding = "0";
        }
    };
});

//Fonction de reset de la previsualisation de l'image dans la modale photo

function resetPrevisu () {
    const previsu = document.getElementById("modal-previsu-image")
    if (previsu) {
        previsu.remove();
        document.querySelector("#modal-icone-ajout-photo").style.display = null;
        document.querySelector(".modal-ajouter-nouvelle-photo").classList.remove("modal-previsu-photo-actif");
        document.querySelector("#modal-input-ajouter-nouvelle-photo").classList.remove("modal-previsu-photo-actif");
        document.querySelector(".modal-format-taille-photo").classList.remove("modal-previsu-photo-actif");
        document.querySelector(".form-modal-ajout-photo").style.padding = "22.5px 0 19px 0";
    }
};

//Changement de l'aspect du btn Valider sur le form d'ajout de projets
//fonction pour verifier si les 3 inputs sont remplis et modifier l'aspect du btn 

function verifierNouveauContenue() {
	let image = document.getElementById("modal-input-ajouter-nouvelle-photo");
	let titre = document.getElementById("modal-input-titre-photo");
	let categorie = document.getElementById("modal-input-categorie-photo");
	if(image.files.length === 0 || categorie.value.trim() === "" || titre.value.trim() === "" ) {
        document.getElementById("modal-valider-nouveau-projet").className = "inactif";

	} else {
		document.getElementById("modal-valider-nouveau-projet").className = "actif";
	};
};

//addEventListener sur chaque input pour verifier à chaque ajout d'une donnée que tout les inputs soient remplis avec la fonction "verifierNouveauContenue"

document.getElementById("modal-input-ajouter-nouvelle-photo").addEventListener("input", verifierNouveauContenue);
document.getElementById("modal-input-titre-photo").addEventListener("input", verifierNouveauContenue);
document.getElementById("modal-input-categorie-photo").addEventListener("input", verifierNouveauContenue);

//Ajouter des projets
//Lire le form pour récuperer les datas

document.getElementById("modal-form-ajout-photo").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", document.getElementById("modal-input-ajouter-nouvelle-photo").files[0]);
    formData.append("title", document.getElementById("modal-input-titre-photo").value);
    formData.append("category", document.getElementById("modal-input-categorie-photo").value);
    //fetch pour envoyer les datas à l'API 
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: formData
    })
    .then(function(response) {
        switch(response.status) {
            case 500:
            case 503:
                alert("Unexpected Error");
            break;
            case 400:
            case 404:
                alert("Bad Request");
            break;
            case 200:
            case 401:
                alert("Unauthorized");
            break;
            case 201:
                console.log("Nouveau projet créé");
            return response.json();
            default:
            throw new Error("Erreur code inconnu");
        }
    })
    //Creer les figures une fois le nouveau projet envoyé a l'API
    .then(function(json) {
        fermerModalePhoto ();
        const figure = document.createElement("figure"); 
        figure.classList.add("projets-figure", "category-0", `category-${json.categoryId}`);
        figure.setAttribute("id", `projet-figure-${json.id}`)
        const imageFigure = document.createElement("img");
        imageFigure.src = json.imageUrl;
        imageFigure.alt = json.title;
        const titreFigure = document.createElement("figcaption");
        titreFigure.innerText = json.title;
        gallery.appendChild(figure);
        figure.appendChild(imageFigure);
        figure.appendChild(titreFigure);
        document.querySelector(".gallery").appendChild(figure);
    })
});