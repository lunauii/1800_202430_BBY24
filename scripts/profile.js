// Points to the document of the user who is logged in
var currentUser;

// Populates user profile information.
function populateUserInfo(user) {
    // Go to the correct user document by referencing to the user uid
    currentUser = db.collection("users").doc(user.uid)
    
    // Get the document for current user
    currentUser.get()
        .then(userDoc => {
            // Get the data fields of the user
            let userName = userDoc.data().name;

            // Displays username if userName isn't null
            if (userName != null) {
                document.getElementById("nameInput").value = userName;
            }   
        })
}

// Gets a user's food restrictions
function getUserRestrictions(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Gets array of user restrictions
            var userRestrictions = userDoc.data().allergies;

            // Points to the badge template
            let newBadgeTemplate = document.getElementById("restrictionBadgeTemplate");
            let badgesGoHere = document.getElementById("badges-go-here");

            // If user has restrictions
            if (userRestrictions) {
                document.getElementById("badges-go-here").innerHTML = '';
                // Iterates through the Array of user restrictions
                userRestrictions.forEach(allergy => {
                // Gets user's allergens
                db.collection("allergens").doc(allergy).get().then(doc => {
                    // Allergy's name
                    var allergyName = doc.data().name;
                    // Badge template
                    let newBadge = newBadgeTemplate.content.cloneNode(true);

                    // Adds restriction to badge template
                    newBadge.querySelector('.restriction-name').innerHTML = allergyName;
                    newBadge.querySelector('.remove-restriction').addEventListener("click", function(e) {
                        removeRestriction(allergyName, user);
                    }, false);
                    // Appends new badge
                    badgesGoHere.appendChild(newBadge);
                    })
                });
            }
        });
}

// Displays list of restrictions that user DOESN'T have
function getGlobalRestrictions(user) {

    // Item restriction template
    let itemTemplate = document.getElementById("dropdownRestrictionItemTemplate");

    // Gets list of allergens from Firestore
    db.collection("allergens").get()
        .then(allItems => {
            document.getElementById("allergies-go-here").innerText = "";
            // iterate through each allergen
            allItems.forEach(allergy => {
                // Gets name of the allergy
                var name = allergy.data().name;
                // Gets current user
                db.collection("users").doc(user.uid).get()
                    .then(userDoc => {
                        // Gets current user's restrictions
                        var userRestrictions = userDoc.data().allergies;

                        // If user restrictions list exist AND it doesn't include this allergy
                        if (userRestrictions && !userRestrictions.includes(name)) {

                            // Clones the HTML template to create a new card to be filled with the retrieved Firestore data.
                            let newItem = itemTemplate.content.cloneNode(true);

                            // Updates values
                            newItem.querySelector('.dropdown-restriction-name').innerHTML = name;
                            newItem.querySelector('.dropdown-item').addEventListener("click", function(e) {
                                addRestriction(name, user);
                            }, false);

                            // Appends card
                            document.getElementById("allergies-go-here").appendChild(newItem, user);
                        }
                    });
            });
    });
}

// Adds a restriction to a user's profile
function addRestriction(item, user) {
    // Updates the user's Firestore doc with the allergy item
    currentUser.update({
        allergies: firebase.firestore.FieldValue.arrayUnion(item)
    }).then(() => {
        // Updates user's restrictions and list of restrictions they can add
        getUserRestrictions(user);
        getGlobalRestrictions(user);
    });
}

// Removes a restriction from a user's list
function removeRestriction(item, user) {
    // Updates the user's Firestore doc to remove the allergy item
    currentUser.update({
        allergies: firebase.firestore.FieldValue.arrayRemove(item)
    }).then(() => {
        // Updates user's restrictions and list of restrictions they can add
        getUserRestrictions(user);
        getGlobalRestrictions(user);
    });
}

// Enables form fields
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

// Saves user info after editing
function saveUserInfo() {
    // Gets the value of the field with id="nameInput"
    userName = document.getElementById('nameInput').value;

    // Updates user's document in Firestore
    currentUser.update({
        name: userName
    });

    // Disables edit 
    document.getElementById('personalInfoFields').disabled = true;
}

// Inserts a user's name from Firestore
function insertNameFromFirestore(user) {
    // Gets user doc
    currentUser = db.collection("users").doc(user.uid);
    currentUser.get().then(userDoc => {
        // Gets user name and displays it
        let userName = userDoc.data().name;
        document.getElementById("name-goes-here").innerText = userName;
    })
}

function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            populateUserInfo(user);
            getUserRestrictions(user);
            getGlobalRestrictions(user);
        } else {
            console.log("No user is signed in");
        }
    });
}

doAll();
