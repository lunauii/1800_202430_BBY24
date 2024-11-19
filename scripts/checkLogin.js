function checkIsLoggedIn() {
    const user = firebase.auth().currentUser;
    if (user) {                   
		window.location.replace("/home");
    } else {
        console.log("User is not logged in.");
    }
}
checkIsLoggedIn();