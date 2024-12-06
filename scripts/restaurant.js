function displayRestaurantInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("restaurants")
        .doc(ID)
        .get()
        .then( doc => {
            restaurant = doc.data();
            restaurantName = restaurant.name;
            restaurantLocation = restaurant.address + ", " + doc.data().city, + ", " + doc.data().region;
            description = restaurant.description;
            restaurantCode = restaurant.code;
            
            // only populate title, and image
            document.getElementById("restaurantName").innerHTML = restaurantName;
            document.getElementById("restaurantLocation").innerHTML = restaurantLocation;
            document.getElementById("description").innerHTML = description;
            /* let imgEvent = document.querySelector( ".restaurant-img" );
            imgEvent.src = "/images/" + restaurantCode + ".jpg"; */
        } );
}

displayRestaurantInfo();

// MENUS

// Populates menus on restaurant page
function populateMenus() {
    let menuCardTemplate = document.getElementById("menuCardTemplate");
    let restaurantCardGroup = document.getElementById("menuCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let restaurantID = params.searchParams.get("docID");

    // Getting menu subcollection from restaurant
    db.collection("restaurants/" + restaurantID + "/menu")
        .get()
        .then((allMenus) => {
            menu = allMenus.docs;
            menu.forEach((doc) => {
                let name = doc.data().name;
                let description = doc.data().description;
                let ingredientString = "";

                // Displaying menu item name and desc
                let menuCard = menuCardTemplate.content.cloneNode(true);
                menuCard.querySelector(".name").innerHTML = name;
                menuCard.querySelector(".description").innerHTML = description;
                
                // Displaying menu ingredients
                for (let i = 0; i < doc.data().ingredients.length; i++) {
                    itemName = doc.data().ingredients[i];
                    ingredientString += "<li>" + itemName + "</li>";
                }
                menuCard.querySelector(".ingredients").innerHTML = ingredientString;

                // reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;
                // reviewCard.querySelector( ".description").innerHTML = `<b>Description:</b> ${description}`;

                restaurantCardGroup.appendChild(menuCard);
                
                document.getElementById('noMenus').style.display = 'none';

            });
        });
}

populateMenus();

// Populates ingredients on restaurant page
function populateIngredients(restaurantID, menuID, htmlElement) {

    // Get ingredients from Firestore
    db.collection("restaurants/" + restaurantID + "/menu/")
        .get().then((allItems) => {
            var menuItem = allItems.docs;
            // Ingredient string to be appended later
            let ingredientString = "";

            // Add each item to the string
            menuItem.forEach((doc) => {
                itemName = doc.data().name;
                ingredientString += "<li>" + itemName + "</li>";
            });

            // Add string to inner HTML
            htmlElement.innerHTML += ingredientString;
        });
}


// REVIEWS

// Saves the restaurant document ID to local storage and 
function saveRestaurantDocumentIDAndRedirect(){
    // Get URL from search bar
    let params = new URL(window.location.href);
    // Get restaurant ID from URL
    let ID = params.searchParams.get("docID");
    // Set ID in local storage
    localStorage.setItem('restaurantDocID', ID);
    // Redirect to review.html
    window.location.href = 'review.html';
}

// Saves the restaurant document ID to local storage and 
function saveRestaurantDocumentIDAndRedirectToMenuCreation(){
    // Get URL from search bar
    let params = new URL(window.location.href);
    // Get restaurant ID from URL
    let ID = params.searchParams.get("docID");
    // Set ID in local storage
    localStorage.setItem('restaurantDocID', ID);
    // Redirect to review.html
    window.location.href = 'menu-creation.html';
}

function populateReviews() {
    let restaurantCardTemplate = document.getElementById("reviewCardTemplate");
    let restaurantCardGroup = document.getElementById("reviewCardGroup");

    // Get the URL from the search bar
    let params = new URL(window.location.href);
    let restaurantID = params.searchParams.get("docID");

    // Find the restaurant's reviews
    db.collection("reviews/")
        .where("restaurantDocID", "==", restaurantID)
        .get().then((allReviews) => {
            // Log reviews
            reviews = allReviews.docs;

            // For each review, display it
            reviews.forEach((doc) => {
                // Get title + desc + time + rating of review, and whether it contained the user's allergies
                var title = doc.data().title;
                var reviewDescription = doc.data().description;
                var allergies = doc.data().allergies;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating;

                // Clone template and add review info
                let reviewCard = restaurantCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".title").innerText = title;
                reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
                reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;

                // Add review description WITHOUT letting people paste raw HTML
                boldText = document.createElement("b");
                text = document.createTextNode("Description: ");
                boldText.appendChild(text);
                reviewCard.querySelector(".description").innerHTML = "";
                reviewCard.querySelector(".description").appendChild(boldText);

                cardDescription = document.createElement("span");
                cardDescription.innerText = reviewDescription;
                reviewCard.querySelector(".description").appendChild(cardDescription);

                // Display stars
                let starRating = "";
                // Filled stars
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
                // Unfilled stars
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }
                reviewCard.querySelector(".star-rating").innerHTML = starRating;

                // Display card
                restaurantCardGroup.appendChild(reviewCard);
                document.getElementById('noReviews').style.display = 'none';

            });
        });
}

populateReviews();

var currentUser;
var restrictionArray = [];

// Displays a card if the restaurant contains the user's allergies
function hasAllergies() {
    firebase.auth().onAuthStateChanged(user => {
        // If user is signed in
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(doc => {
                // Gets user's allergies
                let allergies = doc.data().allergies;
                // If user has a list of allergies:
                if (allergies.length > 0) {
                    // Gets doc ID in URL
                    let params = new URL(window.location.href);
                    let restaurantID = params.searchParams.get("docID");

                    // Gets list of menu items
                    db.collection("restaurants/" + restaurantID + "/menu")
                    .get()
                    .then((allMenus) => {
                        var menuItem = allMenus.docs;

                        // Adds each item to the card string
                        menuItem.forEach((doc) => {
                            if (doc.data().ingredients) {
                                var ingredientArray = doc.data().ingredients;

                                ingredientArray.forEach(ingredient => {
                                    // If user has this ingredient as an allergy
                                    if (allergies.includes(ingredient) && !restrictionArray.includes(ingredient)) {
                                        document.getElementById('alert-div').style.display = 'block';
                                        document.getElementById('allergiesList').innerHTML += "<li class='mx-3'><p>" + ingredient + "</p></li>";
                                        restrictionArray.push(ingredient);
                                    }
                                });
                            } else {
                                // No ingredients in the menu item
                                console.log("No ingredients found");
                            }
                        });
                    });
                } else {
                    // User doesn't have allergy list
                    console.log("No allergies found");
                }
            });
        } else {
            // User isn't signed in
            console.log("No user is signed in.");
        }
    });
}

hasAllergies();
