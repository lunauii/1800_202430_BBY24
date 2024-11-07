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

/* function getNameFromAuth() {
  firebase.auth().onAuthStateChanged(user => {
      // Check if a user is signed in:
      if (user) {
          // Do something for the currently logged-in user here: 
          console.log(user.uid); //print the uid in the browser console
          console.log(user.displayName);  //print the user name in the browser console
          userName = user.displayName;
          //method #2:  insert using jquery
          $("#name-goes-here").text(userName); //using jquery

      } else {
          // No user is signed in.
          console.log ("No user is logged in");
      }
  });
}
getNameFromAuth(); //run the function */

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

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("restaurantCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

  db.collection(collection).get()   //the collection called "hikes"
      .then(allRestaurants=> {
          //var i = 1;  //Optional: if you want to have a unique ID for each hike
          allRestaurants.forEach(doc => { //iterate thru each doc
              var title = doc.data().name;       // get value of the "name" key
              var description = doc.data().description;  // get value of the "details" key
              var restaurantCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
              var restaurantLocation = doc.data().address + ", " + doc.data().city + ", " + doc.data().region; //gets the length field
              let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.
              var docID = doc.id;

              //update title and text and image
              newcard.querySelector('.card-title').innerHTML = title;
              newcard.querySelector('.card-location').innerHTML = restaurantLocation;
              newcard.querySelector('.card-text').innerHTML = description;
              newcard.querySelector('.card-image').src = `/images/${restaurantCode}.jpg`; //Example: NV01.jpg images\restaurant-template.jpg
              newcard.querySelector('a').href = "restaurant.html?docID="+docID;

              //Optional: give unique ids to all elements for future use
              // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
              // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
              // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

              //attach to gallery, Example: "restaurants-go-here"
              document.getElementById(collection + "-go-here").appendChild(newcard);

              //i++;   //Optional: iterate variable to serve as unique ID
          })
      })
}

displayCardsDynamically("restaurants");  //input param is the name of the collection