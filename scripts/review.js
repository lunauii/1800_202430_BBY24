var restaurantDocID = localStorage.getItem("restaurantDocID");

// Gets restaurant name from Firestore
function getRestaurantName(id) {
    db.collection("restaurants").doc(id).get().then((thisRestaurant) => {
        var restaurantName = thisRestaurant.data().name;
        document.getElementById("restaurantName").innerHTML = restaurantName;
    });
}

getRestaurantName(restaurantDocID);

// Makes review stars clickable
const stars = document.querySelectorAll('.star');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // Fills star + every star to the left of it
        for (let i = 0; i <= index; i++) {
            document.getElementById(`star${i + 1}`).textContent = 'star';
        };

        // Unfills every star to the right of it
        for (let i = 4; i > index; i--) {
            document.getElementById(`star${i + 1}`).textContent = 'star_outline';
        };
    });
});

// Writes review to Firestore
function writeReview() {
    // Gets restaurant title + desc + allergies
    let restaurantTitle = document.getElementById("title").value;
    let restaurantDescription = document.getElementById("description").value;
    let restaurantAllergies = document.querySelector('input[name="allergies"]:checked').value;

    // Sets star rating for restaurant
    const stars = document.querySelectorAll('.star');
    let restaurantRating = 0;
    stars.forEach((star) => {
        if (star.textContent === 'star') {
            restaurantRating++;
        }
    });

    // Checks if user is signed in before adding the review
    var user = firebase.auth().currentUser;
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;

        // Get the document for the current user
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
        // No user is signed in.
        console.log("No user is signed in.");
        window.location.href = '/home/review.html';
    }
}