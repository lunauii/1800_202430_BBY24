// Global variable pointing to the current user's Firestore document
var currentUser;

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            console.log(user.uid); //print the uid in the browser console
            console.log(user.displayName);  //print the user name in the browser console
            userName = user.displayName;
  
            //method #1:  insert with JS
            //document.getElementById("name-goes-here").innerText = userName;    
  
            //method #2:  insert using jquery
            $("#name-goes-here").text(userName); //using jquery
  
            //method #3:  insert using querySelector
            //document.querySelector("#name-goes-here").innerText = userName
  
        } else {
            // No user is signed in.
            console.log ("No user is logged in");
        }
    });
  }

function displayCardsDynamically(collection) {
    console.log("alert0");
    // Retrieving and storing the restaurant card template
    let cardTemplate = document.getElementById("restaurantCardTemplate");
  
    db.collection(collection).get()
        .then(allRestaurants => {
            document.getElementById(collection + "-go-here").innerText = "";
            console.log(allRestaurants.size);
            // Iterate through each doc
            allRestaurants.forEach(doc => {
                console.log ("doc.id");
                console.log (doc.id);
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
                    console.log("bookmarks", doc.data().bookmarks);
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

  // Function that updates a bookmark
function updateBookmark(hikeDocID) {
    currentUser.get().then(doc => {
        let bookmarks = doc.data().bookmarks;
        let iconID = 'save-' + hikeDocID;

        if (bookmarks.includes(hikeDocID)) {
            // "Unfills" the icon
            document.getElementById(iconID).innerText = 'bookmark_border';
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayRemove(hikeDocID)
            })
            .then(function () {
                console.log("bookmark has been removed " + hikeDocID);
                //console.log(iconID);
            });
        } else {
            // "Fills" the icon
            document.getElementById(iconID).innerText = 'bookmark';
            currentUser.update({
                bookmarks: firebase.firestore.FieldValue.arrayUnion(hikeDocID)
            })
            // Handle the front-end update to change the icon, providing visual feedback to the user that it has been clicked.
            .then(function () {
            console.log("bookmark has been saved for" + hikeDocID);
            });
        }
    });
}

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            getNameFromAuth();
            displayCardsDynamically("restaurants");
        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
doAll();