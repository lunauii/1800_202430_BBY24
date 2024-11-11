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
                    /* let userSchool = userDoc.data().school;
                    let userCity = userDoc.data().city; */

                    // If the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                })
        } else {
            // No user is signed in.
            console.log ("No user is signed in");
        }
    });
}
// Call the function to run it 
populateUserInfo();

function editUserInfo() {
    // Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    // Enter code here

    // a) get user entered values

    //get the value of the field with id="nameInput"
    userName = document.getElementById('nameInput').value;

    // b) update user's document in Firestore
    currentUser.update({
        name: userName,
    })
    .then(() => {
        console.log("Document successfully updated!");
        insertNameFromFirestore();
    })

    // c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

function insertNameFromFirestore() {
    // Check if the user is logged in:
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log(user.uid); // Let's know who the logged-in user is by logging their UID
            currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
            currentUser.get().then(userDoc => {
                // Get the user name
                let userName = userDoc.data().name;
                console.log(userName);
                //$("#name-goes-here").text(userName); // jQuery
                document.getElementById("name-goes-here").innerText = userName;
            })
        } else {
            console.log("No user is logged in."); // Log a message when no user is logged in
        }
    })
}
insertNameFromFirestore();