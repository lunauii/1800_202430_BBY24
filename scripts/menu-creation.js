var restaurantDocID = localStorage.getItem("restaurantDocID");    //visible to all functions on this page

function getRestaurantName(id) {
    db.collection("restaurants")
      .doc(id)
      .get()
      .then((thisRestaurant) => {
        var restaurantName = thisRestaurant.data().name;
        document.getElementById("restaurantName").innerHTML = restaurantName;
          });
        console.log("restaurantName");
}

getRestaurantName(restaurantDocID);