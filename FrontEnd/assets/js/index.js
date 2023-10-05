//Appel fetch de mon API

fetch('http://localhost:5678/api/works')
.then((response) => response.json())
.then((data) => {
    data.forEach((work) => {
        const figure = createAllBalise(work)
        imagesContainer.appendChild(figure)
    })
})

const imagesContainer = document.querySelector('.gallery')

//Function qui crée toutes les balises et cible des valeurs pour le DOM

function createAllBalise(work) {
    const figure = document.createElement('figure')
    const figureCaption = document.createElement('figcaption')
    const figureImage = document.createElement('img')

    figureImage.src = work.imageUrl
    figureCaption.innerHTML = work.title

    figure.appendChild(figureImage)
    figure.appendChild(figureCaption)

    return figure
}

