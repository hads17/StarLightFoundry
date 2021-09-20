var loggedInUser;
var displayName;
var isAdmin = '';
var displayNameCreateUser;
var displayExist;
var isNull;
var memberTypeSelect;


// listen for auth status changes
auth.onAuthStateChanged(user => {
    if (user) {
        loggedInUser = firebase.auth().currentUser.uid;
        //get data
        db.collection('products').get().then(snapshot => {
            setupUI(user);
        });
        db.collection('users').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                if (doc.id == firebase.auth().currentUser.uid) {
                    displayName = doc.data().displayName;
                }

            })
        });
        db.collection('users').get(auth.currentUser.uid).then(snapshot => {
            setupAdminUI(snapshot.docs);
        });
        isNull = false;
    } else {
        setupUI();
        adminLinks.forEach(item => item.style.display = 'none');
        isNull = true;
        displayName = '';
        isAdmin = '';
    }

});



//Sign Up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    checkDisplayExist();

});

function checkDisplayExist() {
    memberTypeSelect = signupForm['signup-memberType'].value;
    var displayNameCreateUser = signupForm['signup-displayName'].value;
    db.collection('users').where("displayName", "==", displayNameCreateUser).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            displayExist = 1;
        });
        if (displayExist == 1) {
            alert("The Display Name is already In User");
            displayExist = 2;
        } else {
            checkDisplayExistDone();
        }
    })
}
function checkDisplayExistDone() {
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    var guildTitleGrab = '';
    console.log(signupForm['signup-memberType'].value);
    if (signupForm['signup-memberType'].value == 1) {
        guildTitleGrab = 'Director';
    } else if (signupForm['signup-memberType'].value == 2) {
        guildTitleGrab = 'Officer';
    } else if (signupForm['signup-memberType'].value == 3) {
        guildTitleGrab = 'Member';
    };
    //sign up user
     auth.createUserWithEmailAndPassword(email, password).then(cred => {
         return db.collection('users').doc(cred.user.uid).set({
             email: signupForm['signup-email'].value,
             displayName: signupForm['signup-displayName'].value,
             memberType: memberTypeSelect,
             profilepicURL: "./Images/GenericImage.jpg",
             guildTitle: guildTitleGrab,
             aboutMe: '',
             profession: '',
             discord: '',
             characterName: '',
             isAdmin: ''
         });

     }).then(() => {
         auth.sendPasswordResetEmail(email).then(function () {
             firebase.auth().signOut().then(() => {
                 // Sign-out successful.
             }).catch((error) => {
                 // An error happened.
             });
         }).catch(function (error) {
             // An error happened.
         });
         homePageLoad();
         const modal = document.querySelector('#modal-signup');
         M.Modal.getInstance(modal).close();
         signupForm.reset();
     });
}

// Logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        homePageLoad();
    });
    currUserID = '';
    currPassword = '';
});

// Login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    }).catch(err => {
        alert(err.message)
    });
});

//Adding a Product to DB
const addproductForm = document.querySelector('#addproduct-form');
addproductForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get product info


    // Add a new document in collection "products"
    db.collection("products").doc().set({
        ownerDisplayName: displayName,
        ownerID: firebase.auth().currentUser.uid,
        itemName: addproductForm['addproduct-name'].value,
        description: addproductForm['addproduct-description'].value,
        quantity: addproductForm['addproduct-quantity'].value,
        itemPrice: addproductForm['addproduct-price'].value
    })
        .then(function () {
        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });
    document.getElementById('content').innerHTML = "";
    db.collection('products').get().then(snapshot => {
        setupUserProducts(snapshot.docs);
    });
    const modal = document.querySelector('#modal-addproduct');
    M.Modal.getInstance(modal).close();
    addproductForm.reset();
});

function accountFormLoad() {
    const accountForm = document.querySelector('#account-form');
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        db.collection("users").doc(firebase.auth().currentUser.uid).update({
            aboutMe: accountForm['account-aboutme'].value,
            profession: accountForm['account-profession'].value,
            discord: accountForm['account-discord'].value,
            characterName: accountForm['account-charactername'].value,
            profilepicURL: accountForm['account-profilepicture'].value
        }).then(() => {
            accountResetEmail();
        });

    })
};


// Edit Product Info
function editProductSubmit(editbtnID) {
    const editproductform = document.querySelector('#editproduct-form');
    db.collection("products").doc(editbtnID).update({
        itemName: editproductform['editproduct-name'].value,
        description: editproductform['editproduct-description'].value,
        quantity: editproductform['editproduct-quantity'].value,
        itemPrice: editproductform['editproduct-price'].value
    }).then(() => {
        document.getElementById('content').innerHTML = "";
        db.collection('products').where("ownerID", "==", firebase.auth().currentUser.uid).get().then(snapshot => {
            setupUserProducts(snapshot.docs);
        });
    });
    const modal = document.querySelector('#modal-editproduct');
    M.Modal.getInstance(modal).close();
    editproductform.reset();
};

// reset Password
function resetPassBtn() {
    var email = document.getElementById("login-email").value;
    console.log(email);
    auth.sendPasswordResetEmail(email).then(function () {
        alert("An Email has been sent to the provided address");
    }).catch(function (error) {
        console.log(error)
    });
}
function resetPassBtnAccount() {
    auth.sendPasswordResetEmail(auth.currentUser.email).then(function () {
        alert("An Email has been sent to the provided address");
    }).catch(function (error) {
        console.log(error)
    });
}

// reset email
function accountResetEmail() {
    var email = document.getElementById('account-email').value;
    const accountForm = document.querySelector('#account-form');

    auth.currentUser.updateEmail(email).then(() => {
        db.collection("users").doc(firebase.auth().currentUser.uid).update({
            email: accountForm['account-email'].value
        })
    }).catch(error => {
        alert(error);
    }).then((error) => {
        if (error) {

        } else (alert('Your Data has been saved Successfully'));
    });
}

function adminCheck() {
    db.collection('users').doc(auth.currentUser.uid).get().then(doc => {
        const user = doc.data();
        isAdmin = user.isAdmin;
        if (isAdmin == ! 'on') {
            alert('Fuck Off');
        }
    });
}

function editMemberSubmit(userID) {
    var oldString = userID
    var newString = oldString.replaceAll("crafterEditSubmit-", "");
    const editCrafterAccountForm = document.querySelector('#editcrafteraccount-form');
    db.collection("users").doc(newString).update({
        displayName: editCrafterAccountForm['editcrafteraccount-displayname'].value,
        aboutMe: editCrafterAccountForm['editcrafteraccount-aboutme'].value,
        discord: editCrafterAccountForm['editcrafteraccount-discord'].value,
        characterName: editCrafterAccountForm['editcrafteraccount-charactername'].value,
        profilepicURL: editCrafterAccountForm['editcrafteraccount-image'].value
    }).then(() => {
        document.getElementById('content').innerHTML = "";
        db.collection('users').get().then(snapshot => {
            setupMemberList(snapshot.docs);
        });
    });
    const modal = document.querySelector('#modal-editcrafteraccount');
    M.Modal.getInstance(modal).close();
    editCrafterAccountForm.reset();
};

$(document).ready(function(){
    $('.tabs').tabs();
  });