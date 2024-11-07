function displayHikeInfo() {
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
displayHikeInfo();

function saveRestaurantDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('restaurantDocID', ID);
    window.location.href = 'review.html';
}