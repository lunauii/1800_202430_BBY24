// Points to the document of the user who is logged in
var currentUser;

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        
        // Check if user is signed in:
        if (user) {

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
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    });
}

populateUserInfo();

function editUserInfo() {
    // Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

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

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // Log UID
            console.log(user.uid);
            // Go to user's doc
            currentUser = db.collection("users").doc(user.uid);
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            // No user is signed in.
            console.log("No user is signed in.");
        }
    })
}

insertNameFromFirestore();
