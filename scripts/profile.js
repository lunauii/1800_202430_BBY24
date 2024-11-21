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

function getUserRestrictions(user) {
    db.collection("users").doc(user.uid).get()
        .then(userDoc => {

            // Get Array of user restrictions
            var userRestrictions = userDoc.data().allergies

            //point to the badge template
            let newBadgeTemplate = document.getElementById("restrictionBadgeTemplate");
            let badgesGoHere = document.getElementById("badges-go-here");

            if (userRestrictions) {
                document.getElementById("badges-go-here").innerHTML = '';

                //iterate through the Array of user restrictions
                userRestrictions.forEach(allergy => {
                console.log(allergy);

                db.collection("allergens").doc(allergy).get().then(doc => {

                    var allergyName = doc.data().name

                    let newBadge = newBadgeTemplate.content.cloneNode(true);

                    newBadge.querySelector('.restriction-name').innerHTML = allergyName;
                    newBadge.querySelector('.remove-restriction').addEventListener("click", function(e) {
                        removeRestriction(allergyName, user);
                    }, false);

                    badgesGoHere.appendChild(newBadge);
                    })
                });
            }
        });
}

function getGlobalRestrictions(user) {

    let itemTemplate = document.getElementById("dropdownRestrictionItemTemplate");

    db.collection("allergens").get()
        .then(allItems => {
            document.getElementById("allergies-go-here").innerText = "";
            console.log(allItems.size);

            // iterate through each allergen
            allItems.forEach(allergy => {

                console.log(allergy.data().name);

                var name = allergy.data().name;

                db.collection("users").doc(user.uid).get()
                    .then(userDoc => {
                        var userRestrictions = userDoc.data().allergies

                        if (userRestrictions) {
                            if (userRestrictions.includes(name)) {
                                return;
                            }
                        }

                        // Clone the HTML template to create a new card to be filled with the retrieved Firestore data.
                        let newItem = itemTemplate.content.cloneNode(true);

                        // Update values
                        newItem.querySelector('.dropdown-restriction-name').innerHTML = name;
                        newItem.querySelector('.dropdown-item').addEventListener("click", function(e) {
                            addRestriction(name, user);
                        }, false);

                        document.getElementById("allergies-go-here").appendChild(newItem, user);
                    })




            })
        })
}

function addRestriction(item, user) {
    currentUser.update({
        allergies: firebase.firestore.FieldValue.arrayUnion(item)
    }).then(() => {
        console.log("Document successfully updated!");
        getUserRestrictions(user);
        getGlobalRestrictions(user)
    })
}

function removeRestriction(item, user) {
    currentUser.update({
        allergies: firebase.firestore.FieldValue.arrayRemove(item)
    }).then(() => {
        console.log("Document successfully updated!");
        getUserRestrictions(user);
        getGlobalRestrictions(user)
    })
}

// Enables form fields
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

// Saves user info after editing
function saveUserInfo() {
    // Get the value of the field with id="nameInput"
    userName = document.getElementById('nameInput').value;

    // Update user's document in Firestore
    currentUser.update({
        name: userName,
    }).then(() => {
        console.log("Document successfully updated!");
        insertNameFromFirestore();
    })

    // Disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

function insertNameFromFirestore(user) {
    currentUser = db.collection("users").doc(user.uid);
    currentUser.get().then(userDoc => {
        // Get the user name
        let userName = userDoc.data().name;
        console.log(userName);
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
