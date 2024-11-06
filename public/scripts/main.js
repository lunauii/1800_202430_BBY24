//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("logging out user");
        location.reload(); //reload the page
      }).catch((error) => {
        // An error happened.
      });
}

function writeRestaurantLoop(max) {
  //define a variable for the collection you want to create in Firestore to populate data
  var restaurantsRef = db.collection("restaurants");
  for (i = 1; i <= max; i++) {
      restaurantsRef.add({ //add to database, autogen ID
          name: "restaurant" + i,
          description: "Welcome to the restaurant page for restaurant" + i + ".",
          address: "123 Test Lane",   
          city: "Chicago", 
          region: "IL",
          last_updated: firebase.firestore.FieldValue.serverTimestamp()
      })
 }
}

function getNameFromAuth() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if a user is signed in:
      if (user) {
          // Do something for the currently logged-in user here: 
          console.log(user.uid); //print the uid in the browser console
          console.log(user.displayName);  //print the user name in the browser console
          userName = user.displayName;

          //method #1:  insert with JS
          //document.getElementById("name-goes-here").innerText = userName;    

          //method #2:  insert using jquery
          $("#name-goes-here").text(userName); //using jquery

          //method #3:  insert using querySelector
          //document.querySelector("#name-goes-here").innerText = userName

      } else {
          // No user is signed in.
          console.log ("No user is logged in");
      }
  });
}
getNameFromAuth(); //run the function