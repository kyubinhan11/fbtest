function FirebaseTest(){
  // Shortcuts to DOM Elements.
  this.textInput = document.getElementById('textInput');
  this.submitButton = document.getElementById('submit');
  this.textForm = document.getElementById('text-form');
  this.translationOnRight = document.getElementById('translation');

  // authentification
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  //Saves text on form submit
  this.textForm.addEventListener('submit', this.saveText.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));


  // Toggle for the button
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.textInput.addEventListener('keyup', buttonTogglingHandler);
  this.textInput.addEventListener('change', buttonTogglingHandler);

  this.initApp();

}

FirebaseTest.prototype.initApp = function() {
  // shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();

  // reference to the database path
  this.textRef = this.database.ref('translate');
  var expressEntry = firebase.database().ref('ExpressEntry/home');  // "http://www.cic.gc.ca/english/express-entry/"
  expressEntry.on('value', snap => {
    //console.log(JSON.stringify(snap.val(), null, 3));
    var value = snap.val();
    //document.getElementById('firstEnglish').src = value['link'];
    document.getElementById('secondEnglish').src = value['link'];
    this.translationOnRight.innerText = value['translation'];
    document.getElementById('firstParagraph').innerText = value['paragraph'];
  });

  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(user => {
    if(user){  // User is signed in
      // Get profile pic and user's name form the Firebase user object
      var profilePicUrl = user.photoURL;
      var userName = user.displayName;

      // Set the user's profile pic and name
      this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || 'public/images/profile_placeholder.png') + ')';
      this.userName.textContent = userName;

      // show user's profile and sign-out button
      //this.userName.removeAttribute('hidden');
      this.userPic.removeAttribute('hidden');
      this.signOutButton.removeAttribute('hidden');

      // Hide sign-in button
      this.signInButton.setAttribute('hidden', 'true');


    } else{  // user is signed out
      // hide user's profile and sign-out button
      this.userName.setAttribute('hidden', 'true');
      this.userPic.setAttribute('hidden', 'true');
      this.signOutButton.setAttribute('hidden', 'true');

      // show sign-in button
      this.signInButton.removeAttribute('hidden');
    } 
  });
};

// Saves a new text on the Firebase DB
FirebaseTest.prototype.saveText = function(e){
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (this.textInput.value){  //&& this.checkSignedInWithMessage()){
    var currentUser = this.auth.currentUser;

    // add a new message entry to the Firebase Database.
    this.textRef.push({
      text : this.textInput.value
    }).then( () => {
      // Clear text field and send vutton state
      this.textInput.value = null;
      this.toggleButton();
    }).catch(error => {
      console.error('Error writing new message to Firebase Database', error);
    });


  }
};

// Signs-in 
FirebaseTest.prototype.signIn = function(){
  // sign in firebase using popup auth and Google as the identity provider
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// sign-out
FirebaseTest.prototype.signOut = function(){
  this.auth.signOut();
};

// returns true if user is signed-in otherwise false and displays a message
FirebaseTest.prototype.checkSignedInWithMessage = function(){
  // returns true if the user is signed in firebase
  if(this.auth.currentUser){
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
};

// Enables or disables the submit button depending on the values of the input fields
FirebaseTest.prototype.toggleButton = function(){
  if(this.textInput.value){
    this.submitButton.removeAttribute('disabled');
  } else{
    this.submitButton.setAttribute('disabled', 'true');
  }
};


window.onload = function(){
  window.FirebaseTest = new FirebaseTest();
};

/*
(function(){


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB_cwj5E1S8gMUwOGCeOhFFmy5McpjyXSg",
    authDomain: "fbtest-40f18.firebaseapp.com",
    databaseURL: "https://fbtest-40f18.firebaseio.com",
    storageBucket: "fbtest-40f18.appspot.com",
    messagingSenderId: "903107694101"
  };
  firebase.initializeApp(config);
  
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();

  this.auth.onAuthStateChanged(user => {
  	if (user) { // User is signed in!
	  // Get profile pic and user's name from the Firebase user object.
	  var profilePicUrl = user.photoURL;   // TODO(DEVELOPER): Get profile pic.
	  var userName = user.displayName;        // TODO(DEVELOPER): Get user's name.

	    
	} else { // User is signed out!
	  // Hide user's profile and sign-out button.
	    
	}
  });

}());

*/

