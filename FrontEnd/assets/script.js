const works =[]
const imagesContainer = document.querySelector('.gallery') // Récupération de l'élément DOM qui accueillera la galerie d'image

fetch('http://localhost:5678/api/works')  // Recupération des données WORKS de l'API via fetch
  .then((response) => response.json())  
  .then((data) => {
    data.forEach((work) => {
      works.push(work)
      const figure = createAllBalise(work)
      imagesContainer.appendChild(figure)
     document.getElementById('modal-container').appendChild(createAllBalise(work, true))
    })
  })

  //CREATION DE LA GALLERIE 

function createAllBalise(work, modal=false) {     
  const figure = document.createElement('figure')  
  const figureImage = document.createElement('img')
  
  figureImage.src = work.imageUrl
  
  figure.appendChild(figureImage)
  figure.setAttribute('data-id', work.id)
  if(modal === false) {
    const figureCaption = document.createElement('figcaption')  
    figureCaption.innerHTML = work.title
    figure.appendChild(figureCaption)
   
  }else {
    const deleteIcon = document.createElement('i')
    deleteIcon.className = "fa-regular fa-trash-can"
    figure.appendChild(deleteIcon)
   

    deleteIcon.addEventListener('click', (event) => {
      event.preventDefault()
      deleteWorkById(work.id)
    })
    
  }
  return figure;
}



fetch('http://localhost:5678/api/categories')
  .then((response) => response.json()) 
  .then((data) => {

      const btnAll = document.getElementById('btnTous')
       btnAll.addEventListener("click", function(){
         imagesContainer.innerHTML=""
        works.forEach(work =>{
            const figure = createAllBalise(work)
            imagesContainer.appendChild(figure)
          }
        )
       })
       document.querySelector('.filters').appendChild(btnAll)
     
    data.forEach((categorie) => {
     const button = document.createElement('button') 
     button.innerText = categorie.name
     button.classList.add('button-filter')
     button.addEventListener("click", function(){
      imagesContainer.innerHTML=""
      works.forEach(work =>{
        if(work.category.id === categorie.id) {
          const figure = createAllBalise(work)
          imagesContainer.appendChild(figure)
        }
      })
     })
     document.querySelector('.filters').appendChild(button)
    })

    //GESTION DU BTN-SELECTED

    const boutons = document.querySelectorAll('.button-filter')
    boutons.forEach((bouton) => {
        bouton.addEventListener('click', function() {
          boutons.forEach((bouton) => {
            bouton.classList.remove('btn-selected')
          })
            bouton.classList.add('btn-selected')
        })
      })
  })

  //GESTION DE LA PARTIE LOGIN

const loginStatus = document.getElementById("login")
const logoutStatus = document.getElementById("logout")
const portfolioModify = document.getElementById("portfolio-filter-modify")
const filtreModify = document.querySelector('.filters')
const modeEdition = document.getElementById("admin-logged")

if (JSON.parse(localStorage.getItem("isConnected"))) {
  modeEdition.style.display = "flex"
  loginStatus.style.display = 'none'
  logoutStatus.style.display = 'block'
  portfolioModify.style.display = 'flex'
  filtreModify.style.display = 'none'   
} else {
  modeEdition.style.display = "none"
  loginStatus.style.display = 'block'
  logoutStatus.style.display = 'none'
  portfolioModify.style.display = 'none'
  filtreModify.style.display = 'flex'
}

logoutStatus.addEventListener("click", (event) => {
  event.preventDefault();
  localStorage.removeItem("Token")
  localStorage.removeItem("isConnected")
  window.location.replace("index.html")
})

//GESTION MODAL

const modal = document.querySelector('#myModal')
const modalContent = document.querySelector('#modal-content')
const modalClose = document.querySelector('#modal-close')
const modalPhoto = document.querySelector('#modal-photo')

//fonction show-hide modal

function showModal() {
  modal.style.display = 'block'
}

function hideModal() {
  modal.style.display = 'none'
}

modalContent.addEventListener('click', function(e) {
  e.stopPropagation()
})
modalPhoto.addEventListener('click', function(e) {
  e.stopPropagation()
})

modalClose.addEventListener('click', hideModal)
modal.addEventListener('click', hideModal)



const ajoutButton = document.querySelector('#modal-ajout')
const returnBtn = document.querySelector('#modal-return')
const modalPhotoClose = document.querySelector("#modal-photo-close")

ajoutButton.addEventListener('click', function() {
  modalContent.style.display = 'none'
  modalPhoto.style.display = 'block'
})
returnBtn.addEventListener('click', function(){
  modalContent.style.display = 'flex'
  modalPhoto.style.display = 'none'
})

modalPhotoClose.addEventListener('click', hideModal)



//Gestion des categories pour l'ajout

const selectCategory = document.getElementById('modal-photo-category')

const reponseCategory = fetch('http://localhost:5678/api/categories')
.then((response) => response.json())
.then((data) => {
  data.forEach((category) => {
    const categoryOption = document.createElement('option')
    const categoryLabel = document.createElement('label')

    categoryOption.setAttribute('value', category.id)
    categoryLabel.innerHTML = category.name

    selectCategory.appendChild(categoryOption)
    categoryOption.appendChild(categoryLabel)
  })
})

// suppression d'un work

function deleteWorkById(workId) {
  const token = localStorage.getItem("Token")
  const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce travail ?")
  if (confirmation) {
    fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        "Accept" : 'application/json',
        "Authorization" : `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok){
      throw new error ('La supression du travai à echoué.')
    }
    const WorksToRemove = document.querySelectorAll(`figure[data-id="${workId}"]`)
    WorksToRemove.forEach (work => {
      work.remove()
    })
  })
  }    
} 

// Ajout d'un nouveau work

const btnValider = document.getElementById("modal-valider")
btnValider.addEventListener("click", addNewWork)

function addNewWork(event) {
  event.preventDefault()

  const token = localStorage.getItem("Token")

  const title = document.getElementById("modal-photo-title").value
  const category = document.getElementById("modal-photo-category").value
  const image = document.getElementById("image").files[0]
  const messageAlert = document.querySelector('.alert-add-work')
  
  if(!title || !category || !image) {
    messageAlert.textContent='Veuillez remplir tous les champs du formulaire.'
    return
  }

  const formData = new FormData()
  formData.append("title", title)
  formData.append("category", category)
  formData.append("image", image)

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      "Authorization" : `Bearer ${token}`
    }
  })
  .then(response => response.json()) 
  .then(work => {

    //Ajout du work dans la galerie
    const figure = createAllBalise(work)
    const gallery = document.querySelector('.gallery')
    gallery.appendChild(figure)
  
    //Ajout du work dans la galerie du modal
    const figureModal = createAllBalise(work, true)
    const galleryModal = document.getElementById('modal-container')
    galleryModal.appendChild(figureModal)
  
    alert('Le nouveau work a été ajouté avec succés.')

    document.getElementById("image").style.display= "none"
    document.getElementById('modal-photo-title').value=""
    document.getElementById('modal-photo-category').value=""
    labelImage.style.display = "initial"
    pImage.style.display = "initial"
    
    iModalImage.style.display = "initial"
    document.getElementById("imgUpload").remove() 
  
    submitButton.style.backgroundColor = ''
  })
  .catch(error => console.error(error))
}

// Gestion de la preview pour l'ajout d'une image

const inputImage = document.getElementById("image");
const labelImage = document.getElementById("label-image");
const pImage = document.querySelector("#form-photo-div > p");
const iconeImage = document.querySelector("#iModalImage");

inputImage.addEventListener("change", function () {
  const selectedImage = inputImage.files[0];

  const imgPreview = document.createElement("img");
  imgPreview.src = URL.createObjectURL(selectedImage);
  imgPreview.style.maxHeight = "100%";
  imgPreview.style.width = "auto";
  imgPreview.id = "imgUpload"

  labelImage.style.display = "none";
  pImage.style.display = "none";
  inputImage.style.display = "none";
  iModalImage.style.display = "none";
  document.getElementById("form-photo-div").appendChild(imgPreview);
});

// chargement de la couleur du boutton 

const titleInput = document.getElementById('modal-photo-title')
const categorySelect = document.getElementById('modal-photo-category')
const imageInput = document.getElementById('image')
const submitButton = document.getElementById('modal-valider')

function checkForm() {
  if (titleInput.value !== '' && categorySelect.value !== '' && imageInput.value !== '') {
    submitButton.style.backgroundColor = '#1D6154'
  } else {
    submitButton.style.backgroundColor = ''
    }
  }

titleInput.addEventListener('input', checkForm)
categorySelect.addEventListener('change', checkForm)
imageInput.addEventListener('change', checkForm)
















 






  
 
 
 
