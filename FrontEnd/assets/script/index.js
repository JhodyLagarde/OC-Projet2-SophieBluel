/////// HOMEPAGE EDIT ////////

// const response = await fetch("http://localhost:5678/api/works");
// const works = await response.json(); 

// const gallery = document.querySelector(".gallery")

// for (let i = 0; i < works.length; i++){

//     const projets = works[i];
//     const figure = document.createElement("figure") 
//     const imageFigure = document.createElement("img");
//     imageFigure.src = projets.imageUrl;
//     imageFigure.alt = projets.title;
//     const titreFigure = document.createElement("figcaption");
//     titreFigure.innerText = projets.title;

//     gallery.appendChild(figure);
//     figure.appendChild(imageFigure);
//     figure.appendChild(titreFigure);
// }
const gallery = document.querySelector(".gallery")
const figure = document.querySelectorAll("figure")
const filter = document.querySelector(".filter")
// Récuperation des travaux via l'API
fetch("http://localhost:5678/api/works")

.then(function(response){
    if (response.ok){
        return response.json();
    }
})
// Affichage des figures
.then(function(data){
    const works = data;
    // creation des figures
    works.forEach((projets) => {
        const figure = document.createElement("figure"); 
        figure.classList.add("projets-figure", "category-0", `category-${projets.category.id}`);
        const imageFigure = document.createElement("img");
        imageFigure.src = projets.imageUrl;
        imageFigure.alt = projets.title;
        const titreFigure = document.createElement("figcaption");
        titreFigure.innerText = projets.title;
        gallery.appendChild(figure);
        figure.appendChild(imageFigure);
        figure.appendChild(titreFigure);
    })
})
// Recuperation des categories via l'API
fetch("http://localhost:5678/api/categories")
.then(function(response){
    if (response.ok){
        return response.json();
    }
})
// Affichage des boutons et filtre
.then(function(data){
    const categories = data
    
    // utilisation de unshift pour créer le bouton "Tous" qui n'est pas dans les données API
    categories.unshift({id: 0, name: "Tous"});
    // creation des boutons
    categories.forEach((category) => {
        const button = document.createElement("button");
        button.classList.add("bouton-filtre", `.bouton-filtre-${category.id}`);
        button.setAttribute("id", category.id)
        button.innerText = category.name;
        filter.appendChild(button);
        if(category.id === 0) button.classList.add("Bouton-actif")
        //filtre
        button.addEventListener('click', function(event) {
			event.preventDefault();
            //afficher les figures correspondantes a l'id du bouton cliqué
            let categoryId = button.getAttribute('id');
			document.querySelectorAll(".projets-figure").forEach(workFigure => {
				workFigure.style.display = 'none';
			});
			document.querySelectorAll(`.projets-figure.category-${categoryId}`).forEach(workFigure => {
				workFigure.style.display = 'block';
			});
            //changer la couleur du bouton filtre actif
            document.querySelectorAll(".bouton-filtre").forEach(boutonFiltre => {
                boutonFiltre.classList.remove("bouton-actif")
            });
            event.target.classList.add("bouton-actif")
        })
        
    })
   
});

