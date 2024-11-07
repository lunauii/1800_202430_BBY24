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

    // Double-check: is your collection called "Reviews" or "reviews"?
    db.collection("reviews")
        .where("restaurantDocID", "==", restaurantID)
        .get()
        .then((allReviews) => {
            reviews = allReviews.docs;
            console.log(reviews);
            reviews.forEach((doc) => {
                var title = doc.data().title;
                var description = doc.data().description;
                var allergies = doc.data().allergies;
                var time = doc.data().timestamp.toDate();
                var rating = doc.data().rating; // Get the rating value
                console.log(rating)

                console.log(time);

                let reviewCard = restaurantCardTemplate.content.cloneNode(true);
                reviewCard.querySelector(".title").innerHTML = title;
                reviewCard.querySelector(".time").innerHTML = new Date(
                    time
                ).toLocaleString();
                reviewCard.querySelector(".allergies").innerHTML = `<b>Has my allergies:</b> ${allergies}`;
                reviewCard.querySelector( ".description").innerHTML = `<b>Description:</b> ${description}`;

                // Populate the star rating based on the rating value
                
	              // Initialize an empty string to store the star rating HTML
								let starRating = "";
								// This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
                for (let i = 0; i < rating; i++) {
                    starRating += '<span class="material-icons">star</span>';
                }
								// After the first loop, this second loop runs from i=rating to i<5.
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