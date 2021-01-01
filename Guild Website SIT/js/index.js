const productList = document.querySelector('.products');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const adminLinks = document.querySelectorAll('.admin');
const accountDetails = document.querySelector('.account-details');
const homeTab = document.querySelector('.hometab');
const myProductsTab = document.querySelector('.myproductstab');
const memberListTab = document.querySelector('.memberlisttab');
const accountTab = document.querySelector('.acccounttab');
const browseProductsTab = document.querySelector('.browseproductstab');

const setupUI = (user) => {
    if (user) {
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {

        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');

    };
}

const setupAdminUI = (data) => {
    data.forEach(doc => {
        if (doc.data().displayName == displayName) {
            const adminUser = doc.data()
            displayAdminTab(adminUser);
        }
    })
}

const displayAdminTab = (adminUser) => {
    if (adminUser.isAdmin == "on") {
        adminLinks.forEach(item => item.style.display = 'block');
    } else {
        adminLinks.forEach(item => item.style.display = 'none');
    }
}
// setup User products
const setupUserProducts = (data) => {

    let html = '';
    data.forEach(doc => {
        if (doc.data().ownerID == firebase.auth().currentUser.uid) {
            const product = doc.data();
            const tr = `
        <tr>
            <td>${product.ownerDisplayName}</td>
            <td>${product.itemName}</td>
            <td>${product.description}</td>
            <td>${product.itemPrice}</td>
            <td>${product.quantity}</td>
            <td><div id="${doc.id}" onClick="delProductBtn(this.id)" class="btn red darken-3"><i class="material-icons">delete</i></div></td>
        </tr>
        `;
            html += tr
        } else { console.log("No Items Found") };
    });
    document.getElementById('content').innerHTML = `
    <div class="row hide-on-small-and-down" style="padding-top: 40px;">
    <div class="col s3"></div>
    <div class="col s6 Offset-S3">
                <div class="card z-depth-4">
        <div class="card-image">
          <img class="intro-page-height-adjust" src="Images/Header.jpg">
          <a class="btn-floating halfway-fab waves-effect waves-light orange modal-trigger z-depth-3" data-target="modal-addproduct"><i class="material-icons">add</i></a>
        </div>

        <!--CONTENT-->
            <div class="card-content grey darken-1">
                <blockquote class='blockquote-orange'><h4 class='bold-und'>Single Items</h4></blockquote>
                <table class="striped centered responsive-table">
                    <thead>
                    <tr>
                        <th>Crafter</th>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Item Price</th>
                        <th>Quantity Available</th>
                        <th>Remove Item</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${html}
                    </tbody>
                </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function delProductBtn(btnID) {
    db.collection('products').doc(btnID).delete().then(() => {
        alert("Item has been deleted")
        document.getElementById('content').innerHTML = "";
        db.collection('products').get().then(snapshot => {
            setupUserProducts(snapshot.docs);
        });
    });
}

myProductsTab.addEventListener('click', function () {

    document.getElementById('content').innerHTML = "";
    db.collection('products').get().then(snapshot => {
        setupUserProducts(snapshot.docs);
    });
});

//Setup Specific Crafter Products
const setupCrafterProducts = (data) => {

    let html = '';
    data.forEach(doc => {
        if (doc.data().ownerID == firebase.auth().currentUser.uid) {
            const product = doc.data();
            const tr = `
        <tr>
            <td>${product.ownerDisplayName}</td>
            <td>${product.itemName}</td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${product.itemPrice}</td>
        </tr>
        `;
            html += tr
        } else { console.log("No Items Found") };
    });
    document.getElementById('content').innerHTML = `
    <div class="row hide-on-small-and-down" style="padding-top: 40px;">
    <div class="col s3"></div>
    <div class="col s6 Offset-S3">
                <div class="card z-depth-4">
        <div class="card-image">
          <img class="intro-page-height-adjust" src="Images/Header.jpg">
        </div>

        <!--CONTENT-->
            <div class="card-content grey darken-1">
            <blockquote class='blockquote-orange'><h4 class='bold-und'>Single Items</h4></blockquote>
                <table class="striped centered responsive-table">
                    <thead>
                    <tr>
                        <th>Crafter</th>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Quantity Available</th>
                        <th>Item Price</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${html}
                    </tbody>
                </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

function selectedBtnCrafterProductPage(btnID) {
    if (btnID == firebase.auth().currentUser.uid) {
        document.getElementById('content').innerHTML = "";
        db.collection('products').where("ownerID", "==", btnID).get().then(snapshot => {
            setupUserProducts(snapshot.docs);
        });
    } else {
        var crafterID = btnID
        document.getElementById('content').innerHTML = "";
        db.collection('products').where("ownerID", "==", crafterID).get().then(snapshot => {
            setupCrafterProducts(snapshot.docs);
        });
    }
};

//Setup All Crafters Products
const setupAllCrafterProducts = (data) => {

    let html = '';
    data.forEach(doc => {
        if (doc.data()) {
            const product = doc.data();
            const tr = `
        <tr>
            <td>${product.ownerDisplayName}</td>
            <td>${product.itemName}</td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${product.itemPrice}</td>
        </tr>
        `;
            html += tr
        } else { console.log("No Items Found") };
    });
    document.getElementById('content').innerHTML = `
    <div class="row hide-on-small-and-down" style="padding-top: 40px;">
    <div class="col s3"></div>
    <div class="col s6 Offset-S3">
                <div class="card z-depth-4">
        <div class="card-image">
          <img class="intro-page-height-adjust" src="Images/Header.jpg">
        </div>

        <!--CONTENT-->
            <div class="card-content grey darken-1">
            <blockquote class='blockquote-orange'><h4 class='bold-und'>Single Items</h4></blockquote>
                <table class="striped centered responsive-table">
                    <thead>
                    <tr>
                        <th>Crafter</th>
                        <th>Item Name</th>
                        <th>Item Description</th>
                        <th>Quantity Available</th>
                        <th>Item Price</th>
                    </tr>
                    </thead>
                    <tbody>
                        ${html}
                    </tbody>
                </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

browseProductsTab.addEventListener('click', function () {

    document.getElementById('content').innerHTML = "";
    db.collection('products').get().then(snapshot => {
        setupAllCrafterProducts(snapshot.docs);
    });
});



//HomeTab page Selector

homeTab.addEventListener('click', function () {
    homePageLoad();

});

function homePageLoad() {
    document.getElementById('content').innerHTML = "";

    const homePage = `
    <div class="row hide-on-small-and-down" style="padding-top: 40px;">
    <div class="col s3"></div>
      <div class="col s6 Offset-S3">
      <div class="card z-depth-4">
        <div class="card-image">
          <img class="intro-page-height-adjust" src="Images/Header.jpg">
        </div>

        <!--CONTENT-->
        <div class="card-content black">
          <blockquote>
            <h4 class="white-text">ABOUT US</h4>
          </blockquote>
          <p class="white-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum facilisis sapien
                quis enim sodales molestie. In sodales felis nec dui porta tincidunt. Ut orci nunc, tempor id risus ut,
                ullamcorper tristique diam. Curabitur rhoncus nisl tellus, ac pharetra turpis interdum in. Etiam gravida
                et lacus quis maximus. Donec eget viverra dui. Maecenas non viverra est, sit amet condimentum risus. Etiam
                dapibus, risus eu consequat porttitor, lectus risus fringilla purus, at volutpat nulla diam in lacus.
                Curabitur et viverra dui, ac placerat massa.</p>
              <br>
              <p class="white-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum facilisis sapien
                quis enim sodales molestie. In sodales felis nec dui porta tincidunt. Ut orci nunc, tempor id risus ut,
                ullamcorper tristique diam. Curabitur rhoncus nisl tellus, ac pharetra turpis interdum in. Etiam gravida
                et lacus quis maximus. Donec eget viverra dui. Maecenas non viverra est, sit amet condimentum risus. Etiam
                dapibus, risus eu consequat porttitor, lectus risus fringilla purus, at volutpat nulla diam in lacus.
                Curabitur et viverra dui, ac placerat massa.</p>
        </div>
    </div>
    </div>
    </div>
    `;

    document.getElementById('content').innerHTML = homePage;
}





document.addEventListener('DOMContentLoaded', function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});



document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems);
});


//MemberListShit
memberListTab.addEventListener('click', function () {
    document.getElementById('content').innerHTML = "";
    db.collection('users').get().then(snapshot => {
        setupMemberList(snapshot.docs);
    });
});

const setupMemberList = (data) => {
    let leadershiphtml = '';
    let officerhtml = '';
    let memberhtml = '';
    data.forEach(doc => {
        if (doc.data().memberType == 1) {
            const leadershipUser = doc.data();
            const leadershipCard = `
            <div class="col s4">
                <div class="card orange darken-2">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img class="activator" src="images/GenericImage.jpg">
                    </div>
                    <div class="card-content">
                        <span class="card-title activator bold">${leadershipUser.displayName}<i class="material-icons right">more_vert</i></span>
                        <p>${leadershipUser.guildTitle}</p>
                        <p class="bold"> Profession(s): ${leadershipUser.profession}</p>
                        <div class="section"></div>
                        <div id="${doc.id}" class='btn red darken-2' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                    </div>
                    <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">About Me<i class="material-icons right">close</i></span>
                        <p>${leadershipUser.aboutMe}</p>
                        <p class="bold-und">Discord</p>
                    <p>${leadershipUser.discord}</p>
                    <p class="bold-und">CharacterName</p>
                    <p>${leadershipUser.characterName}</p>
                    
                    </div>
                </div>
            </div>
            `;
            leadershiphtml += leadershipCard;
        } else if (doc.data().memberType == 2) {
            const officerUser = doc.data();
            const officerCard = `
            <div class="col s3">
            <div class="card orange darken-2">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="images/GenericImage.jpg">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${officerUser.displayName}<i class="material-icons right">more_vert</i></span>
                    <p>${officerUser.guildTitle}</p>
                    <p class="bold"> Profession(s): ${officerUser.profession}</p>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">About Me<i class="material-icons right">close</i></span>
                    <p>${officerUser.aboutMe}</p>
                    <p class="bold-und">Discord</p>
                    <p>${officerUser.discord}</p>
                    <p class="bold-und">CharacterName</p>
                    <p>${officerUser.characterName}</p>
                    <div id="${doc.id}" class='btn orange' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                </div>
            </div>
        </div>
            `;
            officerhtml += officerCard;
        } else {
            const memberUser = doc.data();
            const memberCard = `
            <div class="col s3">
            <div class="card orange darken-2">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator" src="images/GenericImage.jpg">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${memberUser.displayName}<i class="material-icons right">more_vert</i></span>
                    <p>${memberUser.guildTitle}</p>
                    <p class="bold"> Profession(s): ${memberUser.profession}</p>
                    <div class="section"></div>
                        <div id="${doc.id}" class='btn red darken-2' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                </div>
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">About Me<i class="material-icons right">close</i></span>
                    <p>${memberUser.aboutMe}</p>
                    <p class="bold-und">Discord</p>
                    <p>${memberUser.discord}</p>
                    <p class="bold-und">CharacterName</p>
                    <p>${memberUser.characterName}</p>
                    <div id="${doc.id}" class='btn orange' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                </div>
            </div>
        </div>
            `;
            memberhtml += memberCard;
        }
    });
    document.getElementById('content').innerHTML = `
    <blockquote><h1 class="white-text text-darken-4 black-text-border">LEADERSHIP</h1></blockquote>
    <div class="row">
        ${leadershiphtml}
    </div>
    <div class='row'>
    <blockquote><h1 class="white-text text-darken-4 black-text-border">Officers</h1></blockquote>
        ${officerhtml}
    </div>
    <div class='row'>
    <blockquote><h1 class="white-text text-darken-4 black-text-border">Members</h1></blockquote>
        ${memberhtml}
    </div>
    `;
};


accountTab.addEventListener('click', function () {
    db.collection('users').get().then(snapshot => {
        setupAccountInfo(snapshot.docs);
    })
})

const setupAccountInfo = (data) => {
    let html = '';
    data.forEach(doc => {
        if (displayName == doc.data().displayName) {
            const accountUser = doc.data();
            const accountCard = `
            <div class="row hide-on-small-and-down" style="padding-top: 40px;">
            <div class="col s3"></div>
              <div class="col s6 Offset-S3">
              <div class="card z-depth-4">
              <div class="card-image">
          <img class="intro-page-height-adjust" src="Images/Header.jpg">
        </div>
                <!--CONTENT-->
                <div class="card-content grey darken-2">
                  <blockquote class="blockquote-orange">
                    <h4 class="white-text">Account Info</h4>
                  </blockquote>
                  <h6 class="white-text">Display Name</h6>
                  <p class='bold'>${accountUser.displayName}</p>
                  <h6 class="white-text">Email</h6>
                  <p class='bold'>${accountUser.email}</p>
                  <form id="account-form">
                  <div class="input-field">
                    <h6 class="white-text">About Me</h6>
                    <input  type="text" id="account-aboutme" value = '${accountUser.aboutMe}' required />
                    <label for="account-aboutme"></label>
                  </div>
                  <div class="input-field">
                    <h6 class="white-text">Discord</h6>
                    <input  type="text" id="account-discord" value = '${accountUser.discord}' required />
                    <label for="account-discord"></label>
                  </div>
                  <div class="input-field">
                    <h6 class="white-text">AoC Character Name</h6>
                    <input  type="text" id="account-charactername" value = '${accountUser.characterName}' required />
                    <label for="account-charactername"></label>
                  </div>
                  <div class="input-field">
                  <h6 class="white-text">Profession</h6>
                    <select id="account-profession" required>
                        <option value="${accountUser.profession}" selected>${accountUser.profession}</option>
                        <option value="Fishing">Fishing</option>
                        <option value="Herbalism">Herbalism</option>
                        <option value="Lumberjacking">Lumberjacking</option>
                        <option value="Mining">Mining</option>
                        <option value="Taming">Taming</option>
                        <option value="Animal Husbandry">Animal Husbandry</option>
                        <option value="Smelting">Smelting</option>
                        <option value="Alchemy">Alchemy</option>
                        <option value="Armor Smithing">Armor Smithing</option>
                        <option value="Weapon smithing">Weapon smithing</option>
                        <option value="Blacksmithing">Blacksmithing</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Cooking">Cooking</option>
                        <option value="Jewel crafting">Jewel crafting</option>
                        <option value="Scribe">Scribe</option>
                        <option value="Ship building">Ship building</option>
                        <option value="Siege weapons">Siege weapons</option>
                    </select>
                    <label for="account-profession"></label>
                    </div>
                  <button class="btn orange">Submit Changes</button>
                </form>

                </div>
            </div>
            </div>
            </div>
            `
            html += accountCard;
        }
    });
    document.getElementById('content').innerHTML = html;
    M.updateTextFields();
    accountFormLoad();
    $(document).ready(function () {
        $('select').formSelect();
    });
};

