var restaurantDocID = localStorage.getItem("restaurantDocID");    //visible to all functions on this page

// Gets restaurant name from Firestore
function getRestaurantName(id) {
    db.collection("restaurants").doc(id).get().then((thisRestaurant) => {
      var restaurantName = thisRestaurant.data().name;
      document.getElementById("restaurantName").innerHTML = restaurantName;
        });
    console.log("restaurantName");
}

getRestaurantName(restaurantDocID);

// Makes review stars clickable
const stars = document.querySelectorAll('.star');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        for (let i = 0; i <= index; i++) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star';
        };

        for (let i = 4; i > index; i--) {
            // Change the text content of stars to 'star' (filled)
            document.getElementById(`star${i + 1}`).textContent = 'star_outline';
        };
    });
});

// Writes review to Firestore
function writeReview() {
    console.log("inside write review");
    let restaurantTitle = document.getElementById("title").value;
    let restaurantDescription = document.getElementById("description").value;
    let restaurantAllergies = document.querySelector('input[name="allergies"]:checked').value;

    const stars = document.querySelectorAll('.star');
    let restaurantRating = 0;
    stars.forEach((star) => {
        if (star.textContent === 'star') {
            restaurantRating++;
        }
    });

    console.log(restaurantTitle, restaurantDescription, restaurantAllergies, restaurantRating);

    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user.
        db.collection("reviews").add({
            restaurantDocID: restaurantDocID,
            userID: userID,
            title: restaurantTitle,
            description: restaurantDescription,
            allergies: restaurantAllergies,
            rating: restaurantRating,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            window.location.href = "/home/";
        });
    } else {
        console.log("No user is signed in");
        window.location.href = '/home/review.html';
    }
}