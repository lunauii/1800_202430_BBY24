// Current restaurant's Firestore document ID
var restaurantDocID = localStorage.getItem("restaurantDocID");

// Current amount of items
var items = 0;

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

// Adds item row
function addIngredientRow() {
    db.collection("allergens").get().then(allItems => {
        // List of ingredients
        ingredientList = "";
        // iterate through each ingredient
        allItems.forEach(allergy => {
            // Gets name of the ingredient
            var name = allergy.data().name;
            // Adds ingredient to the ingredient list
            ingredientList += "<option value=\"" + name + "\">" + name + "</option>";
        });
        // set ID of item dropdown list
        id = "item" + ++items;
        // create element and set its attributes and ingredient list
        newItem = document.createElement("select");
        newItem.setAttribute("class", "form-control mt-1");
        newItem.setAttribute("name", id);
        newItem.setAttribute("id", id);
        newItem.innerHTML = ingredientList;
        // add ingredient list to site
        document.getElementById("ingredientList").appendChild(newItem);
    });
}

// Writes item to Firestore
function writeItem() {
    // Gets item name + desc
    let itemName = document.getElementById("name").value;
    let itemDescription = document.getElementById("description").value;
    // Creates ingredient array
    let itemIngredients = [];

    // Adds every ingredient to the array
    for (let index = 1; index < document.getElementById("ingredientList").childElementCount; index++) {
        itemIngredients[index - 1] = document.getElementById("ingredientList").children[index].value;
    }

    // Checks if user is signed in before adding the item
    var user = firebase.auth().currentUser;
    if (user) {
        // Get the document for the current menu
        db.collection("restaurants/" + restaurantDocID + "/menu").doc(itemName).set({
            name: itemName,
            description: itemDescription,
            ingredients: itemIngredients,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "/home/";
        });
    } else {
        // No user is signed in.
        console.log("No user is signed in.");
        window.location.href = '/home/menu-creation.html';
    }
}

displayRestaurantName(restaurantDocID);
addIngredientRow();
