var loggedInUser;
var displayName;
var isAdmin;
var displayNameCreateUser;
var displayExist;


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
                if (doc.data().email == firebase.auth().currentUser.email) {
                    displayName = doc.data().displayName;
                }

            })
        });
        db.collection('users').get().then(snapshot => {
            setupAdminUI(snapshot.docs);
        });
    } else {
        setupUI()
        adminLinks.forEach(item => item.style.display = 'none');
        //setupProducts([])
    }

});

//Sign Up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('this button worked')
    checkDisplayExist()

});

function checkDisplayExist() {
    var displayNameCreateUser = signupForm['signup-displayName'].value;
    console.log(displayNameCreateUser);
    db.collection('users').where("displayName", "==", displayNameCreateUser).get().then(snapshot => {
        snapshot.docs.forEach(doc => {
            console.log(doc.data());
            displayExist = 1;
        });
        if (displayExist == 1) {
            alert("The Display Name is already In User");
            displayExist = 2;
        }else{
            checkDisplayExistDone();
            console.log("checkDisplayExistDone")
        }
    })
}
function checkDisplayExistDone() {
    //get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;
    //sign up user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            email: signupForm['signup-email'].value,
            displayName: signupForm['signup-displayName'].value,
            memberType: signupForm['signup-memberType'].value
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
});

const logoutFooter = document.querySelector('#logout-footer');
logoutFooter.addEventListener('click', (e) => {
    e.preventDefault();
    auth.signOut().then(() => {
        homePageLoad();
    });
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
            console.log("Document successfully written!");
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
            characterName: accountForm['account-charactername'].value
        }).then(alert("Your Account Data Has Successfully Been Saved"));

    })
}


