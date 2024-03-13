/////// HOMEPAGE EDIT ////////

// Récuperation des projets sur l'API

const response = await fetch("http://localhost:5678/api/works");
const works = await response.json(); 

for (let i = 0; i < works.length; i++){

    const gallery = document.querySelector(".gallery")
    const projets = works[i];
    const figure = document.createElement("figure") 
    const imageFigure = document.createElement("img");
    imageFigure.src = projets.imageUrl;
    imageFigure.alt = projets.title;
    const titreFigure = document.createElement("figcaption");
    titreFigure.innerText = projets.title;

    gallery.appendChild(figure);
    figure.appendChild(imageFigure);
    figure.appendChild(titreFigure);
}