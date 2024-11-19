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

function displayCardsDynamically(collection) {
  console.log("alert0");
  // Retrieving and storing the restaurant card template
  let cardTemplate = document.getElementById("restaurantCardTemplate");

  db.collection(collection).get()
      .then(allRestaurants => {
          document.getElementById(collection + "-go-here").innerText = "";
          console.log(allRestaurants.size);
          // Iterate through each doc
          allRestaurants.forEach(doc => {
            console.log ("doc.id");
            console.log (doc.id);
              var title = doc.data().name;
              var description = doc.data().description;
              var restaurantCode = doc.data().code;
              var restaurantLocation = doc.data().address + ", " + doc.data().city + ", " + doc.data().region;
              // Clone the HTML template to create a new card to be filled with the retrieved Firestore data.
              let newcard = cardTemplate.content.cloneNode(true);
              var docID = doc.id;

              // Update title and text and image
              newcard.querySelector('.card-title').innerHTML = title;
              newcard.querySelector('.card-location').innerHTML = restaurantLocation;
              newcard.querySelector('.card-text').innerHTML = description;
              newcard.querySelector('.card-image').src = `/images/${restaurantCode}.jpg`; //Example: NV01.jpg images\restaurant-template.jpg
              newcard.querySelector('a').href = "restaurant.html?docID="+docID;

              document.getElementById(collection + "-go-here").appendChild(newcard);
          })
      })
}

// Input string is the name of the collection
displayCardsDynamically("restaurants");