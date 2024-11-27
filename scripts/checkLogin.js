// Checks if a user is logged in.
function checkIsLoggedIn() {
    // Gets current user
    const user = firebase.auth().currentUser;
    if (user) {
        // User exists!
		    window.location.replace("/home");
    } else {
        // User doesn't exist.
        console.log("User is not logged in.");
    }
}
checkIsLoggedIn();