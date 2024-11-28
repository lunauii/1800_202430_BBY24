function displayRestaurantInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection("restaurants")
        .doc(ID)
        .get()
        .then( doc => {
            restaurant = doc.data();
            restaurantName = doc.data().name;
            restaurantLocation = doc.data().address + ", " + doc.data().city, + ", " + doc.data().region;
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
                let menuID = doc.id;

                // Displaying menu item name
                let menuCard = menuCardTemplate.content.cloneNode(true);
                menuCard.querySelector(".name").innerHTML = name;
                
                // Displaying menu ingredients
                populateIngredients(restaurantID, menuID, menuCard.querySelector(".ingredients"));

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
    db.collection("restaurants/" + restaurantID + "/menu/" + menuID + "/ingredients")
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

function saveRestaurantDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('restaurantDocID', ID);
    window.location.href = 'review.html';
}

function populateReviews() {
    let restaurantCardTemplate = document.getElementById("reviewCardTemplate");
    let restaurantCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let restaurantID = params.searchParams.get("docID");

    // Find the restaurant's reviews
    db.collection("reviews/")
        .where("restaurantDocID", "==", restaurantID)
        .get().then((allReviews) => {
            // Log reviews
            reviews = allReviews.docs;

            // For each review, display it
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var description = doc.data().description;
                var allergies = doc.data().allergies;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating;

                // Clone template and add review info
                let reviewCard = restaurantCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".title").innerHTML = title;
                reviewCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;
                reviewCard.querySelector( ".description").innerHTML = `<b>Description:</b> ${description}`;

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

function hasAllergies() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(doc => {
                let params = new URL(window.location.href);
                let allergies = doc.data().allergies;

                if (allergies.length > 0) {
                    let restaurantID = params.searchParams.get("docID");

                    db.collection("restaurants/" + restaurantID + "/menu")
                    .get()
                    .then((allMenus) => {
                        var menuItem = allMenus.docs;

                        // Add each item to the string
                        menuItem.forEach((doc) => {
                            if (doc.data().ingredients) {
                                var ingredientArray = doc.data().ingredients;

                                ingredientArray.forEach(ingredient => {
                                    if (allergies.includes(ingredient)) {
                                        document.getElementById('alert-div').style.display = 'block';
                                        document.getElementById('allergiesList').innerHTML += "<li class='mx-3'><p>" + ingredient + "</p></li>";
                                    } else {
                                        console.log("Ingredient not in allergies list");
                                    }
                                });
                            } else {
                                console.log("No ingredients found");
                            }
                        });
                    });
                } else {
                    console.log("No allergies found");
                }
            });
        } else {
            console.log("No user is signed in");
        }
    });
}

hasAllergies();