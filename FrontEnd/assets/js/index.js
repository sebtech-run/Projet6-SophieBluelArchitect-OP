//Appel fetch de mon API

const works = []
fetch('http://localhost:5678/api/works')
.then((response) => response.json())
.then((data) => {
    data.forEach((work) => {
        works.push(work)
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



fetch('http://localhost:5678/api/categories')
.then((response) => response.json())
.then((data) => {
    data.forEach((categorie) => {
        const button = document.createElement('button')
        button.innerText = categorie.name
        button.classList.add('button-filter')
        button.addEventListener("click", function() {
            imagesContainer.innerHTML=""
            works.forEach(work => {
                if(work.category.id === categorie.id) {
                    const figure = createAllBalise(work)
                    imagesContainer.appendChild(figure)
                }
            })
        })
        document.querySelector('.filters').appendChild(button)
    })
}
)



