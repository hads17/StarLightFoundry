const productList = document.querySelector('.products');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
var adminLinks = document.querySelectorAll('.admin');
const accountDetails = document.querySelector('.account-details');
const homeTab = document.querySelector('.hometab');
const myProductsTab = document.querySelector('.myproductstab');
const memberListTab = document.querySelector('.memberlisttab');
const accountTab = document.querySelector('.acccounttab');
const browseProductsTab = document.querySelector('.browseproductstab');
var editProductSubmit;

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
    auth.onAuthStateChanged(user => {
        if (user) {
            data.forEach(doc => {
                if (doc.id == firebase.auth().currentUser.uid) {
                    const adminUser = doc.data()
                    displayAdminTab(adminUser);
                }
            })
        }

    });

}

const displayAdminTab = (adminUser) => {
    if (adminUser.isAdmin == "on") {
        adminLinks.forEach(item => item.style.display = 'inline-block');
    } else {
        console.log('admin Tabs displayed');
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
            <td style="border-right: 1px solid grey;">${product.ownerDisplayName}</td>
            <td style="border-right: 1px solid grey;">${product.itemName}</td>
            <td style="border-right: 1px solid grey;">${product.description}</td>
            <td style="border-right: 1px solid grey;">${product.itemPrice}</td>
            <td style="border-right: 1px solid grey;">${product.quantity}</td>
            <td><div id="${doc.id}" onClick="delProductBtn(this.id)" class="btn red darken-3 z-depth-3"><i class="material-icons">delete</i></div>
            <div id="${doc.id}" onClick="editProductBtn(this.id)" class="btn yellow darken-3 modal-trigger z-depth-3" data-target="modal-editproduct"><i class="material-icons">edit</i></div>
            </td>
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
            <div class="card-content black darken-1">
                <blockquote class='blockquote-orange'><h4 class='bold-und white-text'>Products</h4></blockquote>
                <table class="striped centered responsive-table grey table-border">
                    <thead>
                    <tr>
                        <th style="border-right: 1px solid grey;">Crafter</th>
                        <th style="border-right: 1px solid grey;">Item Name</th>
                        <th style="border-right: 1px solid grey;">Item Description</th>
                        <th style="border-right: 1px solid grey;">Item Price</th>
                        <th style="border-right: 1px solid grey;">Quantity Available</th>
                        <th>Delete/Edit</th>
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

function editProductBtn(btnID) {
    db.collection('products').doc(btnID).get().then(doc => {
        var product = doc.data();
        document.getElementById("editproduct-name").value = product.itemName;
        document.getElementById("editproduct-description").value = product.description;
        document.getElementById("editproduct-quantity").value = product.quantity;
        document.getElementById("editproduct-price").value = product.itemPrice;
        document.querySelector(".editproduct-submit").id = doc.id;
        $(document).ready(function () {
            M.updateTextFields();
        });
    });
};

function delProductBtn(btnID) {
    if (confirm('Are you sure you want to delete this item?')) {
        db.collection('products').doc(btnID).delete().then(() => {
            document.getElementById('content').innerHTML = "";
            db.collection('products').get().then(snapshot => {
                setupUserProducts(snapshot.docs);
            });
        });
    }

}

myProductsTab.addEventListener('click', function () {

    document.getElementById('content').innerHTML = "";
    db.collection('products').where("ownerID", "==", firebase.auth().currentUser.uid).get().then(snapshot => {
        setupUserProducts(snapshot.docs);
    });
});

//Setup Specific Crafter Products
const setupCrafterProducts = (data) => {

    let html = '';
    data.forEach(doc => {
        if (doc.data()) {
            const product = doc.data();
            const tr = `
        <tr>
            <td style="border-right: 1px solid grey;" class='bold-und product-highlight modal-trigger' data-target="modal-productpagecrafter" onClick='productpagecrafter(this.id)' id='${product.ownerID}'>${product.ownerDisplayName}</td>
            <td style="border-right: 1px solid grey;">${product.itemName}</td>
            <td style="border-right: 1px solid grey;">${product.description}</td>
            <td style="border-right: 1px solid grey;">${product.itemPrice}</td>
            <td>${product.quantity}</td>
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
            <div class="card-content black">
            <blockquote class='blockquote-orange'><h4 class='bold-und white-text'>Products</h4></blockquote>
                <table class="striped centered responsive-table grey table-border">
                    <thead>
                    <tr>
                        <th style="border-right: 1px solid grey;">Crafter <p>(Click for Contact Info)</p></th>
                        <th style="border-right: 1px solid grey;">Item Name</th>
                        <th style="border-right: 1px solid grey;">Item Description</th>
                        <th style="border-right: 1px solid grey;">Item Price</th>
                        <th>Quantity Available</th>
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
    if (isNull == false) {
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
            <td style="border-right: 1px solid grey;" class='bold-und product-highlight modal-trigger' data-target="modal-productpagecrafter" onClick='productpagecrafter(this.id)' id='${product.ownerID}'>${product.ownerDisplayName}</td>
            <td style="border-right: 1px solid grey;">${product.itemName}</td>
            <td style="border-right: 1px solid grey;">${product.description}</td>
            <td style="border-right: 1px solid grey;">${product.itemPrice}</td>
            <td>${product.quantity}</td>
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
            <div class="card-content black darken-1">
            <blockquote class='blockquote-orange'><h4 class='bold-und white-text'>Products</h4></blockquote>
                <table class="striped centered responsive-table grey table-border">
            <thead>
            <tr>
                <th style="border-right: 1px solid grey;">Crafter <p>(Click for Contact Info)</p></th>
                <th style="border-right: 1px solid grey;">Item Name</th>
                <th style="border-right: 1px solid grey;">Item Description</th>
                <th style="border-right: 1px solid grey;">Item Price</th>
                <th>Quantity Available</th>
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
            <div class="row">
              <div class="col s12">
                <blockquote class="blockquote-orange">
                  <h4 class="white-text">Our Mission</h4>
                </blockquote>
                <p class="white-text">
                  This guild's goal is to forge not only the best wares in the land of Verra, but a strong bond among
                  its members. Together we will strive to gather, create, and uncover everything that Ashes of Creation
                  has to offer. Fashioning a pristine suit of armor or fostering sensational bestial companions will be
                  effortless through the good communication and friendship of your fellow guild-mates.</p>
              </div>
            </div>
            <div class="section"></div>

            <div class="row black">
              <div class="col s12 no-padding">
                <ul class="tabs grey darken-4">
                  <li class="tab col s6"><a href="#hometab1" class="orange-text">Guild News</a></li>
                  <li class="tab col s6"><a href="#hometab2" class="orange-text hometabs">Want to Join?</a></li>
                </ul>
              </div>
              <div id="hometab1" class="col s12 grey darken-3">
                <div class="row">
                  <div class="col s12">
                    <div class="card grey darken-4 home-card-curve-large">
                      <h5 class="orange-text bold-und center-align">This is News</h5>
                      <p class="white-text news-pad">Integer vehicula ut libero sed porttitor. Donec sollicitudin est ligula,
                        eget bibendum diam
                        condimentum at. Donec vel risus ligula. Mauris aliquet erat eleifend venenatis ultrices. Morbi
                        eu tellus ac tortor dapibus congue. Mauris ultricies tempor lectus, sed dapibus magna.
                        Pellentesque scelerisque urna in metus laoreet dapibus. Suspendisse at metus vitae elit eleifend
                        varius. Vivamus nec augue sit amet quam mattis pretium.</p><br>
                      <p class="white-text news-pad">Integer vehicula ut libero sed porttitor. Donec sollicitudin est ligula,
                        eget bibendum diam
                        condimentum at. Donec vel risus ligula. Mauris aliquet erat eleifend venenatis ultrices. Morbi
                        eu tellus ac tortor dapibus congue. Mauris ultricies tempor lectus, sed dapibus magna.
                        Pellentesque scelerisque urna in metus laoreet dapibus. Suspendisse at metus vitae elit eleifend
                        varius. Vivamus nec augue sit amet quam mattis pretium.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div id="hometab2" class="col s12 grey darken-3">
                <div class="section"></div>
                <div class="row">
                  <div class="col s6 center-align">
                    <div class="card grey darken-4 home-card-curve">
                      <h5 class="orange-text bold-und">What We Offer:</h5>
                      <ul class="white-text circle-list">
                        <li class="bold">Max guild size of 50</li>
                        <li>---</li>
                        <li class="bold">Friendly family atmosphere</li>
                        <li>---</li>
                        <li class="bold">Open communication and constructive criticism is valued</li>
                        <li>---</li>
                        <li class="bold">Ability to move up within the guild</li>
                      </ul>
                    </div>
                  </div>
                  <div class="col s6 center-align">
                    <div class="card grey darken-4 home-card-curve">
                      <h5 class="orange-text bold-und">Who We Want:</h5>
                      <ul class="white-text circle-list">
                        <li class="bold">Craft-centric players</li>
                        <li>---</li>
                        <li class="bold">Caravan guards (PvP)</li>
                        <li>---</li>
                        <li class="bold">Material Farmers (PvE)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col s12 center-align">
                    <div class="card grey darken-4 home-card-curve-large">
                      <h5 class="orange-text bold-und">Requirments:</h5>
                      <ul class="white-text circle-list">
                        <li class="bold">Applicants must be 18+</li>
                        <li>---</li>
                        <li class="bold">Respectful and conduct themselves positively in the Ashes of Creation community
                        </li>
                        <li>---</li>
                        <li class="bold"> Strong focus on crafting, trading, and caravan defense/exploration</li>
                        <li>---</li>
                        <li class="bold">Ability to accept constructive criticism and follow directions</li>
                        <li>---</li>
                        <li class="bold">Must be willing to utilize discord as it is the preferred form of communication
                        </li>
                        <li>---</li>
                        <li class="bold">Participate in a short interview</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col s4"></div>
                  <div class="col s4 btn orange"><a href="https://forms.gle/AUuduiuHzY44c7fk6" class="white-text">Apply for Membership</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    `;

    $(document).ready(function(){
        $('.tabs').tabs();
      });
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
        if (doc.data().memberType == '1') {
            const leadershipUser = doc.data();
            const leadershipCard = `
            <div class='carousel-item'>
            <div class="col s6">
                <div class="card orange darken-2 card-round-edges member-card">
                    <div class="card-image waves-effect waves-block waves-light card-round-edges-image">
                        <img class="activator member-card-image" src="${leadershipUser.profilepicURL}">
                    </div>
                    <div class="card-content card-content-resize">
                    <span class='clickable'><h4 class='bold activator Header-margin-adjust black-text' > ${leadershipUser.displayName}<span class="productpagecrafter-spanadjust"> - ${leadershipUser.guildTitle}</span><i class="material-icons right">more_vert</i></h4></span>
                    <div class="divider black"></div>
                    <br>
                        <p class='bold' style="font-size: 20px"> Profession(s): ${leadershipUser.profession}</p>
                        <div class="section"></div>
                        <div id="${doc.id}" class='btn red darken-2 z-depth-4' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                        <div id="selectedBtnCrafterEditBtn-${doc.id}" value='${doc.id}' class='btn blue darken-2 z-depth-4 admin modal-trigger' data-target="modal-editcrafteraccount" onClick="selectedBtnCrafterEditBtn(this.id)" style="display: none;">Edit User</div>
                    </div>
                    <div class="card-reveal grey">
                        <span class="card-title grey-text text-darken-4">About Me<i class="material-icons right">close</i></span>
                        <p>${leadershipUser.aboutMe}</p>
                        <p class="bold-und">Discord</p>
                    <p>${leadershipUser.discord}</p>
                    <p class="bold-und">CharacterName</p>
                    <p>${leadershipUser.characterName}</p>
                    
                    </div>
                </div>
            </div>
            </div>
            `;
            leadershiphtml += leadershipCard;
        } else if (doc.data().memberType == '2') {
            const officerUser = doc.data();
            const officerCard = `
            <div class="col s6">
            <div class="card blue darken-2 card-round-edges">
                <div class="card-image waves-effect waves-block waves-light card-round-edges-image">
                    <img class="activator member-card-image" src="${officerUser.profilepicURL}">
                </div>
                <div class="card-content">
                <span class='clickable'><h4 class='bold activator Header-margin-adjust black-text' > ${officerUser.displayName}<span class="productpagecrafter-spanadjust"> - ${officerUser.guildTitle}</span><i class="material-icons right">more_vert</i></h4></span>
                <div class="divider black"></div>
                <br>
                    <p class='bold' style="font-size: 20px"> Profession(s): ${officerUser.profession}</p>
                    <div class="section"></div>
                        <div id="${doc.id}" class='btn red darken-2 z-depth-4' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                        <div id="selectedBtnCrafterEditBtn-${doc.id}" value='${doc.id}' class='btn blue darken-2 z-depth-4 admin modal-trigger' data-target="modal-editcrafteraccount" onClick="selectedBtnCrafterEditBtn(this.id)" style="display: none;">Edit User</div>
                </div>
                <div class="card-reveal grey">
                    <span class="card-title grey-text text-darken-4">About Me<i class="material-icons right">close</i></span>
                    <p>${officerUser.aboutMe}</p>
                    <p class="bold-und">Discord</p>
                    <p>${officerUser.discord}</p>
                    <p class="bold-und">CharacterName</p>
                    <p>${officerUser.characterName}</p>
                </div>
            </div>
        </div>
            `;
            officerhtml += officerCard;
        } else {
            const memberUser = doc.data();
            const memberCard = `
            <div class="col s6">
            <div class="card purple darken-1 card-round-edges">
                <div class="card-image waves-effect waves-block waves-light card-round-edges-image">
                    <img class="activator member-card-image " src="${memberUser.profilepicURL}">
                </div>
                <div class="card-content">
                <span class='clickable'><h4 class='bold activator Header-margin-adjust black-text' > ${memberUser.displayName}<span class="productpagecrafter-spanadjust"> - ${memberUser.guildTitle}</span><i class="material-icons right">more_vert</i></h4></span>
                <div class="divider black"></div>
                <br>
                    <p class='bold' style="font-size: 20px"> Profession(s): ${memberUser.profession}</p>
                    <div class="section"></div>
                        <div id="${doc.id}" class='btn red darken-2 z-depth-4' onClick="selectedBtnCrafterProductPage(this.id)">View User's Products</div>
                        <div id="selectedBtnCrafterEditBtn-${doc.id}" value='${doc.id}' class='btn blue darken-2 z-depth-4 admin modal-trigger' data-target="modal-editcrafteraccount" onClick="selectedBtnCrafterEditBtn(this.id)" style="display: none;">Edit User</div>
                </div>
                <div class="card-reveal grey">
                    <span class="card-title grey-text text-darken-4">About Me<i class="material-icons right">close</i></span>
                    <p>${memberUser.aboutMe}</p>
                    <p class="bold-und">Discord</p>
                    <p>${memberUser.discord}</p>
                    <p class="bold-und">CharacterName</p>
                    <p>${memberUser.characterName}</p>
                </div>
            </div>
        </div>
            `;
            memberhtml += memberCard;
        }
    });
    document.getElementById('content').innerHTML = `
    <div class="row hide-on-small-and-down" style="padding-top: 40px;">
      <div class="col s3"></div>
      <div class="col s6 Offset-S3">
      <div class="card black">
      <div class="card-image">
            <img class="intro-page-height-adjust" src="Images/Header.jpg">
    </div>
    <div class="card-content black">
    <blockquote class='blockquote-orange'><h1 class="white-text text-darken-4 black-text-border">LEADERSHIP</h1></blockquote>
    <div class="row">
        ${leadershiphtml}
    </div>
    <div class='row'>
    <blockquote class='blockquote-blue'><h1 class="white-text text-darken-4 black-text-border">Officers</h1></blockquote>
        ${officerhtml}
    </div>
    <div class='row'>
    <blockquote class='blockquote-purple'><h1 class="white-text text-darken-4 black-text-border">Members</h1></blockquote>
        ${memberhtml}
    </div>
    </div>
    </div>
    </div>
    </div>
    `;
    adminLinks = document.querySelectorAll('.admin');
    db.collection('users').get().then(snapshot => {
        setupAdminUI(snapshot.docs);
    });

};

//Account Info Shit


accountTab.addEventListener('click', function () {
    db.collection('users').get().then(snapshot => {
        setupAccountInfo(snapshot.docs);
    })
})

const setupAccountInfo = (data) => {
    let html = '';
    data.forEach(doc => {
        if (firebase.auth().currentUser.uid == doc.id) {
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
                  <form id="account-form">
                  <div class="input-field">
                    <h6 class="white-text">Email</h6>
                    <input  type="text" id="account-email" value = '${accountUser.email}' required />
                    <label for="account-email"></label>
                  </div>
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
                  <div class="input-field white-text">
                  <h6 class="white-text">Profession</h6>
                    <select class="white-text" id="account-profession" required>
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
                    <div class="input-field">
                    <h6 class="white-text">Profile Picture URL</h6>
                    <input  type="text" id="account-profilepicture" value = '${accountUser.profilepicURL}' required />
                    <label for="account-profilepicture"></label>
                  </div>
                  <button class="btn orange">Submit Changes</button>
                  <div id="" onClick="resetPassBtnAccount()" class='btn blue darken-2 resetPassBtn'>Reset Password</div>
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


function productpagecrafter(userID) {
    db.collection('users').doc(userID).get().then(doc => {
        const user = doc.data();
        document.getElementById('productpagecrafter-image').src = user.profilepicURL;
        document.getElementById('productpagecrafter-discord').innerHTML = user.discord;
        document.getElementById('productpagecrafter-ign').innerHTML = user.characterName;
        document.getElementById('productpagecrafter-professions').innerHTML = 'Profession(s): ' + user.profession;
        document.getElementById('productpagecrafter-displayname').innerHTML = user.displayName + '<span class="productpagecrafter-spanadjust"> - ' + user.guildTitle + '</span>' + '<i class="material-icons right">more_vert</i>';
        document.getElementById('productpagecrafter-aboutme').innerHTML = user.aboutMe;
    });
};

function selectedBtnCrafterEditBtn(userID) {
    var oldString = userID
    var newString = oldString.replaceAll("selectedBtnCrafterEditBtn-", "");
    console.log(newString);
    db.collection('users').doc(newString).get().then(doc => {
        console.log(doc.data());
        var user = doc.data();
        document.getElementById('editcrafteraccount-image').value = user.profilepicURL;
        document.getElementById('editcrafteraccount-discord').value = user.discord;
        document.getElementById('editcrafteraccount-displayname').value = user.displayName;
        document.getElementById('editcrafteraccount-aboutme').value = user.aboutMe;
        document.getElementById('editcrafteraccount-charactername').value = user.characterName;
        document.querySelector(".editmember-submit").id = 'crafterEditSubmit-' + doc.id;
        $(document).ready(function () {
            M.updateTextFields();
        });
    });
};
