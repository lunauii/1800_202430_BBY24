// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// Borrowed from BCIT COMP 1800 demos.
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
        
            // User successfully signed in.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                //------------------------------------------------------------------------------------------
                // The code below is modified from default snippet provided by the FB documentation.
                //
                // If the user is a "brand new" user, then create a new "user" in your own database.
                // Assign this user with the name and email provided.
                // Before this works, you must enable "Firestore" from the firebase console.
                // The Firestore rules must allow the user to write. 
                //------------------------------------------------------------------------------------------
            var user = authResult.user;
            // If user exists
            if (authResult.additionalUserInfo.isNewUser) {
                // Write to Firestore (UID is the user's ID)
                db.collection("users").doc(user.uid).set({
                    name: user.displayName,        // "users" collection
                    email: user.email,             // with authenticated user's ID (user.uid)
                    isAdmin: false,                // no admin perms (admin has to be turned on manually through firestore)
                    bookmarks: []                  // adds a bookmarks array - otherwise, trying to add bookmarks won't work
                }).then(function () {
                    window.location.assign("/home");           // re-direct to main.html after signup
                }).catch(function (error) {
                    console.log("Error adding new user: " + error);
                });
            } else {
                return true;
            }
                return false;
        },
        uiShown: function() {
            // The widget is rendered. Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: '/home',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>',
    // Privacy policy url.
    privacyPolicyUrl: '<your-privacy-policy-url>'
    };

ui.start('#firebaseui-auth-container', uiConfig);