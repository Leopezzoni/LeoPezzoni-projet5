const container = document.getElementById("container");

//fonction affichage html//
const display = camera => {
    container.innerHTML += `
    <article id="cardsProduct-${camera.id}" class="produit">
        <img src=${camera.imageUrl} alt="photos produits" />
        <div class="bloqueDescription">
            <h2> ${camera.name}</h2>
            <p>${camera.price / 100}€</p>
        </div>
        <p>${camera.description}</p>
        <a href="pages/produit.html?id=${camera.id}"> En savoir plus</a>
    </article>`
};

//appel API avec FETCH//
fetch("http://localhost:3000/api/cameras")
    .then(response => response.json())  
    .then(function (listeProduct) {
        // boucle for prend un produit de la liste// 
        for (let product of listeProduct) {
            let camera = new Camera(product);
            console.log("test", camera);
            display(camera);
        }
    })
    //si probleme API//
    .catch(function (err) {
        console.log("fetch Error")
        alert("Veuillez nous excuser les produits ne sont pas disponible pour le moment ")
    });