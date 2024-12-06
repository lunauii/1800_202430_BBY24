// Inserts a user's name from Firestore.
function insertNameFromFirestore() {

  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {

    if (user) {
        // Go to the Firestore document of the user
        currentUser = db.collection("users").doc(user.uid);
        currentUser.get().then(userDoc => {
            // Get the user name
            let userName = userDoc.data().name;
            document.getElementById("name-goes-here").innerText = userName;
        });

        // Favorite restaurants element
        favoriteRestaurants = document.getElementById("favoriteRestaurants");
        
        // Displays user's bookmarks
        db.collection("users").doc(user.uid).get().then(doc => {
            let bookmarks = doc.data().bookmarks;
            // If the user has bookmarks
            if (bookmarks.length > 0) {
                favoriteRestaurants.innerHTML = "";
                getBookmarks(user);
            } else {
                // No bookmarks
                favoriteRestaurants.innerHTML = "<p>No bookmarks yet!</p>";
            }
        });

    } else {
        // No user is signed in.
        console.log("No user is signed in.");
    }
  })
}

insertNameFromFirestore();

// Gets bookmarks, copied from 1800 demo
function getBookmarks(user) {

    // Gets user's Firestore doc
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {
            // Gets user's bookmarks
            var bookmarks = userDoc.data().bookmarks;
            
            // Gets the template
            let newcardTemplate = document.getElementById("savedCardTemplate");
  
            // Iterate through the ARRAY of bookmarked hikes (document IDs)
            bookmarks.forEach(restaurantID => {
                db.collection("restaurants").doc(restaurantID).get().then(doc => {
                    // Gets name + address + id
                    var title = doc.data().name;
                    var address = doc.data().address;
                    var docID = doc.id;
                    
                    // Clones the new card
                    let newcard = newcardTemplate.content.cloneNode(true);
  
                    // Updates title and some pertinant information
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-length').innerHTML = address;
                    newcard.querySelector('a').href = "restaurant.html?docID=" + docID;
  
                    // Updates to display length, duration, last updated
                    newcard.querySelector('.card-length').innerHTML =
                        "City: " + doc.data().city +
                        "<br/>Region: " + doc.data().region +
                        "<br/>Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();
  
                    // Attaches this new card to the gallery
                    favoriteRestaurants.appendChild(newcard);
                })
            });
        })
  }