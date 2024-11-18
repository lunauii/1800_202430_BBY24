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
                reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
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