//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
        window.location.replace("/login.html");
      }).catch((error) => {
        // An error happened.
        console.log("Error logging out.");
      });
}