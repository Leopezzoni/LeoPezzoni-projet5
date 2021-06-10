/// Gestion du panier ///

//recuperation du panier dans le local storage//
let cameras = JSON.parse(localStorage.getItem("panier")) ? JSON.parse(localStorage.getItem("panier")) : [];

//emplacement du html//
let container = document.getElementById("container");

//initialise le prix total du panier a 0//
let prixPanier = 0;

//recuperation id produit//
let addIdBasket = [];

//fonction calcul prix total du panier et envoie au local storage//
function priceTotalBasket(camera){
    prixPanier += camera.quantity * camera.price / 100;
    //affiche le prix total du panier//envoi au localstorage//
    let prixTotal = document.getElementById('prixTotal').textContent = prixPanier + "€";
    localStorage.setItem('prixtotal', JSON.stringify(prixTotal));
};

//boucle sur le panier//
cameras.forEach((camera, i) => {
    container.innerHTML += `
      <tr>
          <td class="srcimage"><img src=${camera.imageUrl} alt="" /></td>
          <td>${camera.name}</td>
          <td>${camera.price / 100} €</td>
          <td>${camera.quantity}</td>
          <td><a href="#" class="deleteCamera" data-id="${i}"> <i class="fas fa-trash-alt"></i></a></td>
          <td >${camera.quantity * camera.price / 100} €</td>
      </tr>
    `;
    //appel fonction//
    priceTotalBasket(camera)
   
   //boucle increment id produit//
    for (let i = 0; i < camera.quantity; i++) {
      addIdBasket.push(camera.id);
    }
  });

  function deleteCamera(id) {
      let camera = (id);
      if (camera > 1) {
          camera--;
      } else {
          cameras.splice(id, 1);
      }
      localStorage.setItem('panier', JSON.stringify(cameras));
      window.location.reload();
  }

  //supprimer 1 produit du panier//
  document.querySelectorAll(".deleteCamera").forEach(delBtn => {
      delBtn.addEventListener('click', () => deleteCamera(delBtn.CDATA_SECTION_NODE.id))
  });

  let viderPanier = document.getElementById('viderPanier')
  viderPanier.addEventListener('click', deleteBasket);

  //fonction supprime tout le panier//
  function deleteBasket() {
      if (cameras == null) {
      } else {
          container.remove();
          localStorage.clear();
          window.location.reload();
      }
  };

  ///gestion du formulaire///
  function sendOrder() {
      let form = document.getElementById("form");
      if (form.reportValidity() == true && addIdBasket.length>0) {
          let contact = {
              'firstName': document.getElementById("nom").value,
              'lastName' : document.getElementById("prenom").value,
              'adress' : document.getElementById("adresse").value,
              'city' : document.getElementById("ville").value,
              'email' : document.getElementById("email").value
          };

          let products = addIdBasket;

          let formulaireClient = JSON.stringify({
              contact,
              products,
          });
          
          //appel API avec FETCH// envoie des donnees avec POST//
          fetch('http://localhost:3000/api/cameras/order', {
              method: 'POST',
              headers: {
                  'content-type': "application/json"
              },
              mode: "cors",
              body: formulaireClient
          })
          .then(function (response) {
              return response.json()
          })
          .then(function (r) {
              localStorage.setItem("contact", JSON.stringify(r.contact));
              window.location.assign("confirmation.html?orderId=" + r.orderId);
          })
          //si probleme API//
          .catch(function (err) {
              console.log("fetch Error");
          });
      }
      else {
          alert("Une erreur est survenue votre panier est peut etre vide ou le formulaire n'a pas été correctement rempli!")
      };
  }

  let envoiFormulaire = document.getElementById("envoiFormulaire");

  envoiFormulaire.addEventListener('click', function (event) {
      event.preventDefault();
      sendOrder();
  });
