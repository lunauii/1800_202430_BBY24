function insertNameFromFirestore() {
  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged(user => {
      if (user) {
          // Log user UID
          console.log(user.uid);
          // Go to the Firestore document of the user
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