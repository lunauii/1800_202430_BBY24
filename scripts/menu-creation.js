// Current restaurant's Firestore document ID
var restaurantDocID = localStorage.getItem("restaurantDocID");

// Displays restaurant name on menu-creation.html
function displayRestaurantName(id) {
  // Gets restaurant's Firestore doc
  db.collection("restaurants")
    .doc(id).get()
    .then((thisRestaurant) => {
        // Displays name from Firestore db
        var restaurantName = thisRestaurant.data().name;
        document.getElementById("restaurantName").innerHTML = restaurantName;
    });
}

displayRestaurantName(restaurantDocID);
