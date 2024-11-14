function displayRestaurantInfo() {
    // Get the url from the search bar
    let params = new URL(window.location.href);
    // Get value for key "id"
    let ID = params.searchParams.get("docID");
    console.log(ID);

    db.collection("restaurants").doc( ID ).get().then( doc => {
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

function populateMenus() {
    console.log("test");
    let restaurantCardTemplate = document.getElementById("menuCardTemplate");
    let restaurantCardGroup = document.getElementById("menuCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let restaurantID = params.searchParams.get("docID");

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("menu")
        .where("menuDocID", "==", menuID)
        .get()
        .then((allMenus) => {
            reviews = allMenus.docs;
            console.log(menu);
            menu.forEach((doc) => {
                var title = doc.data().title;
                // var description = doc.data().description;
                // var allergies = doc.data().allergies;
                // var time = doc.data().timestamp.toDate();
                // var rating = doc.data().rating; // Get the rating value
                // console.log(rating)

                // console.log(time);

                let menuCard = menuCardTemplate.content.cloneNode(true);
                menuCard.querySelector("#").innerHTML = title;

                // reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;
                // reviewCard.querySelector( ".description").innerHTML = `<b>Description:</b> ${description}`;

                // Populate the star rating based on the rating value

                restaurantCardGroup.appendChild(menuCard);
                
                document.getElementById('noMenu').style.display = 'none';

            });
        });
}

populateMenus();




// REVIEWS

function saveRestaurantDocumentIDAndRedirect(){
    // Get the url from the search bar
    let params = new URL(window.location.href)
    let ID = params.searchParams.get("docID");
    localStorage.setItem('restaurantDocID', ID);
    window.location.href = 'review.html';
}

function saveRestaurantDocumentIDAndRedirectToMenuCreation(){
    // Get the url from the search bar
    let params = new URL(window.location.href)
    let ID = params.searchParams.get("docID");
    localStorage.setItem('restaurantDocID', ID);
    window.location.href = 'menu-creation.html';
}

function populateReviews() {
    // console.log("test");
    let restaurantCardTemplate = document.getElementById("reviewCardTemplate");
    let restaurantCardGroup = document.getElementById("reviewCardGroup");

    // Get the url from the search bar
    let params = new URL(window.location.href);
    let restaurantID = params.searchParams.get("docID");

    db.collection("reviews")
        .where("restaurantDocID", "==", restaurantID)
        .get().then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var description = doc.data().description;
                var allergies = doc.data().allergies;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating;
                
                console.log(rating);
                console.log(time);

                let reviewCard = restaurantCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".title").innerHTML = title;
                reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
                reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;
                reviewCard.querySelector( ".description").innerHTML = `<b>Description:</b> ${description}`;

                let starRating = "";
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
                for (let i = rating; i < 5; i++) {
                    starRating += '<span class="material-icons">star_outline</span>';
                }

                reviewCard.querySelector(".star-rating").innerHTML = starRating;
                restaurantCardGroup.appendChild(reviewCard);
                document.getElementById('noReviews').style.display = 'none';

            });
        });
}

populateReviews();