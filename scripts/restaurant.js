function displayRestaurantInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "restaurants" )
        .doc( ID )
        .get()
        .then( doc => {
            restaurant = doc.data();
            restaurantName = doc.data().name;
            restaurantLocation = doc.data().address + ", " + doc.data().city, + ", " + doc.data().region;
            description = restaurant.description;
            restaurantCode = restaurant.code;
            
            // only populate title, and image
            document.getElementById( "restaurantName" ).innerHTML = restaurantName;
            document.getElementById( "restaurantLocation" ).innerHTML = restaurantLocation;
            document.getElementById( "description" ).innerHTML = description;
            /* let imgEvent = document.querySelector( ".restaurant-img" );
            imgEvent.src = "/images/" + restaurantCode + ".jpg"; */
        } );
}
displayRestaurantInfo();
displayRestaurantInfo();

// MENUS

// Bug where wouldn't allow menus to populate and affected reviews, commented out for now

// function populateMenus() {
//     console.log("test");
//     let restaurantCardTemplate = document.getElementById("menuCardTemplate");
//     let restaurantCardGroup = document.getElementById("menuCardGroup");

//     let params = new URL(window.location.href); // Get the URL from the search bar
//     let restaurantID = params.searchParams.get("docID");

//     // Double-check: is your collection called "Reviews" or "reviews"?
//     db.collection("menu")
//         .where("menuDocID", "==", menuID)
//         .get()
//         .then((allMenus) => {
//             reviews = allMenus.docs;
//             console.log(menu);
//             menu.forEach((doc) => {
//                 var title = doc.data().title;
//                 // var description = doc.data().description;
//                 // var allergies = doc.data().allergies;
//                 // var time = doc.data().timestamp.toDate();
//                 // var rating = doc.data().rating; // Get the rating value
//                 // console.log(rating)

//                 // console.log(time);

//                 let menuCard = menuCardTemplate.content.cloneNode(true);
//                 menuCard.querySelector("#").innerHTML = title;

//                 // reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;
//                 // reviewCard.querySelector( ".description").innerHTML = `<b>Description:</b> ${description}`;

//                 // Populate the star rating based on the rating value

//                 restaurantCardGroup.appendChild(menuCard);
                
//                 document.getElementById('noMenu').style.display = 'none';

//             });
//         });
// }

// populateMenus();




// REVIEWS

function saveRestaurantDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('restaurantDocID', ID);
    window.location.href = 'review.html';
}

function populateReviews() {
    console.log("test");
    let restaurantCardTemplate = document.getElementById("reviewCardTemplate");
    let restaurantCardGroup = document.getElementById("reviewCardGroup");

    let params = new URL(window.location.href); // Get the URL from the search bar
    let restaurantID = params.searchParams.get("docID");

    // Find the restaurant's reviews
    db.collection("reviews")
        .where("restaurantDocID", "==", restaurantID)
        .get().then((allReviews) => {
            // Log reviews
            reviews = allReviews.docs;
            console.log(reviews);

            // For each review, display it
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var description = doc.data().description;
                var allergies = doc.data().allergies;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating;
                
                // Log rating and time of review
                console.log(rating);
                console.log(time);

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