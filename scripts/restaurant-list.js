// Global variable pointing to the current user's Firestore document
var currentUser;

// Gets name from Firestore
function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            userName = user.displayName;
            // Adding inner text with jQuery
            $("#name-goes-here").text(userName);
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });
}

// Displays cards... dynamically! Given a collection.
function displayCardsDynamically(collection) {
    // Retrieving and storing the restaurant card template
    let cardTemplate = document.getElementById("restaurantCardTemplate");
  
    // Gets collection from Firestore
    db.collection(collection).get()
        .then(allRestaurants => {
            document.getElementById(collection + "-go-here").innerText = "";
            // Iterate through each doc
            allRestaurants.forEach(doc => {
                var title = doc.data().name;
                var description = doc.data().description;
                var restaurantCode = doc.data().code;
                var restaurantLocation = doc.data().address + ", " + doc.data().city + ", " + doc.data().region;
                // Clone the HTML template to create a new card to be filled with the retrieved Firestore data.
                let newcard = cardTemplate.content.cloneNode(true);
                var docID = doc.id;
  
                // Update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-location').innerHTML = restaurantLocation;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-image').src = `/images/${restaurantCode}.jpg`; //Example: NV01.jpg images\restaurant-template.jpg
                newcard.querySelector('a').href = "restaurant.html?docID=" + docID;
                newcard.querySelector('i').id = 'save-' + docID;
                newcard.querySelector('i').onclick = () => updateBookmark(docID);

                // Show bookmarks
                currentUser.get().then(doc => {
                    var bookmarks = doc.data().bookmarks;
                    //get the user name
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'bookmark';
                    }
                  });
  
                document.getElementById(collection + "-go-here").appendChild(newcard);
            })
        })
  }

  // Function that updates a bookmark given a restaurant ID
function updateBookmark(restaurantID) {
    currentUser.get().then(doc => {
        let bookmarks = doc.data().bookmarks;
        let iconID = 'save-' + restaurantID;

        // If the bookmark has the restaurant ID
        if (bookmarks.includes(restaurantID)) {
            // "Unfills" the icon
            document.getElementById(iconID).innerText = 'bookmark_border';
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(restaurantID)
            });
        } else {
            // "Fills" the icon
            document.getElementById(iconID).innerText = 'bookmark';
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(restaurantID)
            });
        }
    });
}

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            // the following functions are always called when someone is logged in
            getNameFromAuth();
            displayCardsDynamically("restaurants");
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });
}

doAll();
