//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {                   
		        // If the "user" variable is not null, then someone is logged in
            // User is signed in.
            // Do something for the user here.
            $('#navbarPlaceholder').load('/skeleton/nav_after_login.html');
            $('#footerPlaceholder').load('/skeleton/footer_after_login.html');
        } else {
            // No user is signed in.
            $('#navbarPlaceholder').load('/skeleton/nav_before_login.html');
            $('#footerPlaceholder').load('/skeleton/footer_before_login.html');
        }
    });
}

loadSkeleton();

function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("Logging out user.");
        window.location.replace("/login.html");
      }).catch((error) => {
        // An error happened.
        console.log("Error logging out.");
      });
}