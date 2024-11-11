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
displayRestaurantInfo();

function saveRestaurantDocumentIDAndRedirect(){
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('restaurantDocID', ID);
    window.location.href = 'review.html';
}



// TO DO V


//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("menuItemCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allmenu=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allHikes.forEach(doc => { //iterate thru each doc
                var item = doc.data().name;       // get value of the "name" key
                var price = doc.data().price; //gets the length field
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-item').innerHTML = item;
                newcard.querySelector('.card-price').innerHTML = price;

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("menu");  //input param is the name of the collection