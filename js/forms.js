const ul = document.getElementById("companies_ul");
const ul2 = document.getElementById("companies_ul2");
const ul3 = document.getElementById("companies_ul3");
const ul4 = document.getElementById("companies_ul4");

const header = document.getElementById("curruser");
const header1 = document.getElementById("bal");
const header2 = document.getElementById("lim");

const form1 = document.getElementById("set_user_id")
const form3 = document.getElementById("money_form")
const form4 = document.getElementById("limit_form")

//const form2 = document.getElementById("toAdd")

var currentUserId = 4;
var adminId = 26;
var reserved = false;
var currentLotId = null;
var admin = false;
var lot_depth = 19;
var oldlotId = null;
var buildingUserId = "Null";
var state;
var unlockflag = false;


var issuePending = false;


db.collection("users").orderBy('userId').get().then(
    snapshot => {
        //console.log(snapshot)
        snapshot.docs.forEach(
            doc => {
                if(doc.data().userId == currentUserId){

                    header1.textContent = "Current Balance:   " + doc.data().balance;
                    header2.textContent = "Current Limit (in hours): " + doc.data().limit;

                }
            }
        );
    }
);

header.textContent = "Currently Logged in as User:   " + currentUserId;


function get_balance_and_limit() {
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {

                        header1.textContent = "Current Balance:   " + doc.data().balance;


                        header2.textContent = "Current Limit (in hours): " + doc.data().limit;


                    }
                }
            );
        }
    );
}


    form1.addEventListener("submit", (e) => {
        //currentUserId = form.company_userId.value;
        e.preventDefault();

        oldlotId = currentLotId;
        currentUserId = form1.new_user_id.value;

        if (currentUserId == adminId) {
            header.textContent = "Currently Logged in as Admin:   " + currentUserId;
            admin = true;
        } else {
            header.textContent = "Currently Logged in as User:   " + currentUserId;
            admin = false;
        }

        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        if (doc.data().userId == currentUserId) {

                            header1.textContent = "Current Balance:   " + doc.data().balance;
                            header2.textContent = "Current Limit (in hours): " + doc.data().limit;

                        }
                    }
                );
            }
        );


        form1.new_user_id.value = '';

        // alert("Data saved!");
    })


    class lot {
        constructor(lotId, userId, availability, rate) {
            this.lotId = lotId;
            this.userId = userId;
            this.availability = availability;
            this.rate = rate;
        }

        toString() {
            return this.lotId + ', ' + this.userId + ', ' + this.availability;
        }
    }

    var lot1 = new lot(null, null, null);


    String.prototype.replaceAt = function (index, replacement) {
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    }

    const renderCompany = (doc) => {

        if (doc.data().userId == currentUserId) {
            reserved = true;
            currentLotId = doc.data().lotId;
        }


        //  create the li
        let li = document.createElement('li');
        li.className = "collection-item";

        var searchId = doc.id.toString();
        if (searchId.charAt(0) <= '9' && searchId.charAt(0) >= '0') {

            searchId = "A" + doc.id.toString();
            console.log("DOM " + searchId)

        }

        li.setAttribute("data-id", searchId);

        let lotId = document.createElement('span');
        lotId.className = "white-text";

        let availability = document.createElement("p");
        availability.className = "white-text";

        let userId = document.createElement("p");
        userId.className = "white-text";

        let rate = document.createElement("p");
        rate.className = "white-text";

        let space = document.createElement("br");

        lotId.textContent = doc.data().lotId;
        availability.textContent = doc.data().availability;
        userId.textContent = doc.data().userId;
        rate.textContent = doc.data().rate;


        //  <i class="material-icons secondary-content red-text">delete</i>
        let i = document.createElement("i");
        i.className = "material-icons secondary-content purple-text"
        i.textContent = "delete";

        i.addEventListener("click", (e) => {
            console.log("clicked")
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute("data-id");
            db.collection("lots").doc(id).delete();
            alert("deleted: " + id);
        })

        //exit event
        //  <i class="material-icons secondary-content red-text">delete</i>
        let e = document.createElement("e");
        e.className = "material-icons secondary-content red-text"
        e.textContent = "highlight_off";
        e.setAttribute("check", "e");


        e.addEventListener("click", (e1) => {
            console.log("clicked")
            e1.stopPropagation();
            let id = e1.target.parentElement.getAttribute("data-id");


            db.collection("lots").doc(id)
                .get().then((doc) => {
                if (doc.exists) {
                    // Convert to City object
                    lot1.lotId = doc.data().lotId;
                    lot1.userId = doc.data().userId;
                    lot1.availability = doc.data().availability;

                    // Use a City instance method
                    console.log(lot1.toString());
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            var delayInMilliseconds = 100; //1 second

            setTimeout(function () {
                //your code to be executed after 1 second
                console.log("reserved" + reserved);

                if (doc.data().availability == 0 && currentUserId == doc.data().userId) {
                    db.collection("lots").doc(id).update({userId: "Null", availability: 1});
                    console.log("updated");
                    alert("Exited Lot: " + doc.data().lotId);
                    currentLotId = null;
                    reserved = false;

                } else if (!reserved) {
                    alert("Sorry you are not currently parked anywhere");
                }
            }, delayInMilliseconds);

        })


//  <i class="material-icons secondary-content red-text">delete</i>
        let issue = document.createElement("issue");
        issue.className = "material-icons secondary-content purple-text"
        issue.textContent = "error";

        issue.addEventListener("click", (e) => {
            console.log("clicked")
            e.stopPropagation();
            var id = e.target.parentElement.getAttribute("data-id");
            db.collection("lots").doc(id).update({issue: 1});
            alert("Issue " + id + " reported");
            issuePending = true;
            currentLotId = doc.data().lotId;

            //TODO: Be able to upload image when reporting Issue:
            db.collection("issues").get().then(
                snapshot => {
                    snapshot.docs.forEach(
                        doc => {

                            //console.log(doc.data().lotId)
                            //console.log(currentLotId)
                            //console.log(doc.data().lotId === currentLotId)

                            if (doc.data().lotId === currentLotId)
                                db.collection("issues").doc(doc.id).update({resolved: -1});

                        }
                    );
                }
            );
        })

        let resolveIssue = document.createElement("resolveIssue");
        resolveIssue.className = "material-icons secondary-content orange-text"
        resolveIssue.textContent = "build";

        resolveIssue.addEventListener("click", (e) => {
            console.log("clicked")
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute("data-id");
            db.collection("lots").doc(id).update({issue: 0});
            alert("Issue " + id + " resolved");
            currentLotId = doc.data().lotId;

            //TODO: Be able to upload image when reporting Issue:
            db.collection("issues").get().then(
                snapshot => {
                    snapshot.docs.forEach(
                        doc => {


                            if (doc.data().lotId == currentLotId)
                                db.collection("issues").doc(doc.id).update({resolved: 1});

                        }
                    );
                }
            );


            issuePending = false;
        })

        let unlock = document.createElement("unlock");
        unlock.className = "material-icons secondary-content green-text"
        unlock.textContent = "vpn_key";

        unlock.addEventListener("click", (e) => {
            console.log("clicked")
            e.stopPropagation();

            db.collection("users").orderBy('userId').get().then(
                snapshot => {
                    //console.log(snapshot)
                    snapshot.docs.forEach(
                        doc => {
                            if (currentUserId == doc.data().userId) {
                                db.collection("users").doc(doc.id).update({status: 0});

                                db.collection("unlock").get().then(
                                    snapshot => {
                                        //console.log(snapshot)
                                        snapshot.docs.forEach(
                                            doc => {
                                                db.collection("unlock").doc(doc.id).update({unlockflag: 1});


                                            }
                                        );

                                    })


                                alert("Temporary Access Granted to Relocate");
                            }
                        }
                    );

                }
            );


        })

        let s = document.createElement("s");
        s.className = "material-icons secondary-content gray-text"
        s.textContent = "swap_horiz";

        s.addEventListener("click", (e) => {
            console.log("clicked")
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute("data-id");


            db.collection("lots").doc(id)
                .get().then((doc) => {
                if (doc.exists) {
                    // Convert to City object
                    lot1.lotId = doc.data().lotId;
                    lot1.userId = doc.data().userId;
                    lot1.availability = doc.data().availability;

                    // Use a City instance method
                    console.log(lot1.toString());
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            db.collection("lots").where("userId", "==", currentUserId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(" => ", doc.data().lotId);
                        currentLotId = doc.data().lotId;
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });


            var delayInMilliseconds = 200; //1 second


            setTimeout(function () {
                //your code to be executed after 1 second

                console.log("currId99999: " + currentLotId);
                console.log("reserved434 " + reserved);

                if (doc.data().availability == 1 && (currentLotId == "null" || currentLotId == null || currentLotId == "Null") && reserved == false) {


                    // Create a reference to the SF doc.
                    var sfDocRef = db.collection("lots").doc(id);

                    db.runTransaction((transaction) => {
                        return transaction.get(sfDocRef).then((sfDoc) => {
                            if (!sfDoc.exists) {
                                throw "Document does not exist!";
                            }

                            console.log("A: " + sfDoc.data().availability);
                            console.log("Lot id: " + currentLotId);

                            if (sfDoc.data().availability == 1) {
                                transaction.update(sfDocRef, {availability: 0, userId: currentUserId});
                                alert("Reserved Lot: " + lot1.lotId);
                                currentLotId = doc.data().lotId;
                                reserved = true;

                                db.collection("users").orderBy('userId').get().then(
                                    snapshot => {
                                        //console.log(snapshot)
                                        snapshot.docs.forEach(
                                            doc => {
                                                if (currentUserId == doc.data().userId) {
                                                    document.getElementById("companies_ul").innerHTML = "";
                                                    document.getElementById("companies_ul2").innerHTML = "";
                                                    document.getElementById("companies_ul3").innerHTML = "";
                                                    document.getElementById("companies_ul4").innerHTML = "";


                                                    db.collection("users").doc(doc.id).update({status: 1});

                                                    db.collection("unlock").get().then(
                                                        snapshot => {
                                                            //console.log(snapshot)
                                                            snapshot.docs.forEach(
                                                                doc => {
                                                                    document.getElementById("companies_ul").innerHTML = "";
                                                                    document.getElementById("companies_ul2").innerHTML = "";
                                                                    document.getElementById("companies_ul3").innerHTML = "";
                                                                    document.getElementById("companies_ul4").innerHTML = "";
                                                                    db.collection("unlock").doc(doc.id).update({unlockflag: 0});


                                                                }
                                                            );

                                                        })


                                                    alert("Temporary Access Removed");
                                                }
                                            }
                                        );

                                    }
                                );

                            } else {
                                currentLotId = null;
                                alert("Sorry! Someone beat you to it.");
                                return Promise.reject("Sorry! Someone beat you to it.");
                            }
                        });
                    }).then(() => {
                        console.log("updated");
                    }).catch((err) => {
                        // This will be an "population is too big" error.
                        console.error(err);
                    });


                } else if ((currentLotId != "null" || currentLotId != null || currentLotId != "Null") && currentLotId != oldlotId && lot1.availability == 1) {
                    alert("Sorry already reserved in: " + currentLotId);
                } else if (lot1.availability == 0 && !reserved) {
                    alert("Sorry Lot Already Taken: " + doc.data().lotId);

                }
            }, delayInMilliseconds);

        })


        let r = document.createElement("r");
        r.className = "material-icons secondary-content pink-text"
        r.textContent = "done";
        e.setAttribute("check", "r");

        r.addEventListener("click", (e) => {
            console.log("clicked")
            e.stopPropagation();
            let id = e.target.parentElement.getAttribute("data-id");


            db.collection("lots").doc(id)
                .get().then((doc) => {
                if (doc.exists) {
                    // Convert to City object
                    lot1.lotId = doc.data().lotId;
                    lot1.userId = doc.data().userId;
                    lot1.availability = doc.data().availability;

                    // Use a City instance method
                    console.log(lot1.toString());
                } else {
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });
            db.collection("lots").where("userId", "==", currentUserId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(" => ", doc.data().lotId);
                        currentLotId = doc.data().lotId;
                    });
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });


            var delayInMilliseconds = 200; //1 second


            setTimeout(function () {
                //your code to be executed after 1 second

                console.log("currId99999: " + currentLotId);
                console.log("reserved " + reserved);

                if (doc.data().availability == 1 && (doc.data().userId == "Null") && currentLotId == null) {


                    // Create a reference to the SF doc.
                    var sfDocRef = db.collection("lots").doc(id);

                    db.runTransaction((transaction) => {
                        return transaction.get(sfDocRef).then((sfDoc) => {
                            if (!sfDoc.exists) {
                                throw "Document does not exist!";
                            }

                            console.log("A: " + sfDoc.data().availability);
                            console.log("Lot id: " + currentLotId);

                            if (sfDoc.data().availability == 1) {
                                transaction.update(sfDocRef, {availability: 0, userId: currentUserId});
                                alert("Reserved Lot: " + lot1.lotId);
                                currentLotId = doc.data().lotId;
                                reserved = true;


                            } else {
                                currentLotId = null;
                                alert("Sorry! Someone beat you to it.");
                                return Promise.reject("Sorry! Someone beat you to it.");
                            }
                        });
                    }).then(() => {
                        console.log("updated");
                    }).catch((err) => {
                        // This will be an "population is too big" error.
                        console.error(err);
                    });


                } else if ((currentLotId != "null" || currentLotId != null || currentLotId != "Null") && currentLotId != oldlotId && lot1.availability == 1) {
                    alert("Sorry already reserved in: " + currentLotId);
                } else if (lot1.availability == 0 && !reserved) {
                    alert("Sorry Lot Already Taken: " + doc.data().lotId);

                }
            }, delayInMilliseconds);

        })

        buildingUserId = doc.data().userId;
        console.log("building1 " + buildingUserId);
        console.log(buildingUserId != "Null")

        if (buildingUserId != "Null") {

            fill2(doc.data().userId, userId, rate);

        }


        console.log(availability);
        if (doc.data().availability == 1) {
            li.style.background = 'blue';
        }

        if (doc.data().availability == 0) {
            li.style.background = 'red';
        }

        console.log("reserved: " + reserved);
        console.log("lotId " + doc.data().lotId);
        console.log("curId" + currentUserId);
        console.log("doc user: " + doc.data().userId)

        if (doc.data().userId == currentUserId) {
            li.appendChild(e);
            li.style.background = "#19e719";
        }

        if (doc.data().issue == 1)
            li.style.background = "#fff300";

        if (doc.data().issue == 0 && doc.data().availability == 0 && doc.data().userId != currentUserId)
            li.style.background = 'red';


        console.log("Unlock: " + unlockflag)


        if (doc.data().issue == 0 && doc.data().availability == 1) {

            li.appendChild(r);
            li.style.background = 'blue';


        }

        /* if(doc.data().issue == 0 && doc.data().availability == 1){

             db.collection("unlock").get().then(
                 snapshot => {
                     //console.log(snapshot)
                     snapshot.docs.forEach(
                         doc => {

                             if(doc.data().unlockflag == 1) {
                                 li.appendChild(s);
                                 li.style.background = 'blue';
                             }


                         }
                     );

                 })

         }*/


        if (lot_depth > 14) {

            if (admin)
                li.appendChild(i);

            if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
                li.appendChild(issue);

            if (admin && doc.data().issue == 1) {
                li.appendChild(resolveIssue);

            }
            /*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
                li.appendChild(unlock);


            }*/


            li.appendChild(lotId);

            // li.appendChild(availability);
            if (doc.data().userId != "Null") {
                li.appendChild(userId);
            } else
                li.appendChild(rate);

            //li.appendChild(space)
            ul.appendChild(li);
            prune(searchId, "companies_ul", e, r);
            console.log("state curr: " + state);
            lot_depth--;
        } else if (lot_depth <= 14 && lot_depth > 9) {
            console.log("ld: " + lot_depth);

            if (admin)
                li.appendChild(i);

            if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
                li.appendChild(issue);

            if (admin && doc.data().issue == 1) {
                li.appendChild(resolveIssue);
            }

            /*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
                li.appendChild(unlock);


            }*/

            li.appendChild(lotId);

            //li.appendChild(availability);
            if (doc.data().userId != "Null") {
                li.appendChild(userId);
            } else
                li.appendChild(rate);

            //  li.appendChild(space)
            ul2.appendChild(li);
            prune(searchId, "companies_ul2", e, r);
            console.log("state curr: " + state);
            lot_depth--;

        } else if (lot_depth > 4 && lot_depth <= 9) {
            console.log("ld: " + lot_depth);

            if (admin)
                li.appendChild(i);

            if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
                li.appendChild(issue);

            if (admin && doc.data().issue == 1) {
                li.appendChild(resolveIssue);

            }
            /*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
                li.appendChild(unlock);


            }*/

            li.appendChild(lotId);

            //li.appendChild(availability);

            if (doc.data().userId != "Null") {
                li.appendChild(userId);
            } else
                li.appendChild(rate);

            // li.appendChild(space)
            ul3.appendChild(li);
            prune(searchId, "companies_ul3", e, r);
            console.log("state curr: " + state);
            lot_depth--;


        } else if (lot_depth <= 4) {
            console.log("ld: " + lot_depth);

            if (admin)
                li.appendChild(i);

            if (!admin && doc.data().userId == currentUserId && doc.data().issue == 0)
                li.appendChild(issue);

            if (admin && doc.data().issue == 1) {
                li.appendChild(resolveIssue);
            }
            /*if (admin && doc.data().issue == 1 && doc.data().userId!="Null") {
                li.appendChild(unlock);


            }*/

            li.appendChild(lotId);

            //li.appendChild(availability);

            if (doc.data().userId != "Null") {
                li.appendChild(userId);
            } else
                li.appendChild(rate);

            //li.appendChild(space)
            ul4.appendChild(li);

            prune(searchId, "companies_ul4", e, r);
            lot_depth--;


        }

    }


    db.collection("users").orderBy("userId").onSnapshot(
        snapshot => {
            let changes = snapshot.docChanges();
            console.log(changes)
            changes.forEach(
                change => {
                    console.log(change.type)
                    console.log(change.doc.data())

                    switch (change.type) {
                        case "added":
                            // renderCompany(change.doc);
                            get_balance_and_limit();
                            break;
                        case "removed":

                            get_balance_and_limit();

                            break;
                        case "updated":


                            get_balance_and_limit();


                            break;
                        case "modified":


                            get_balance_and_limit();


                            break;
                        default:

                            get_balance_and_limit();

                            break;
                    }
                    // if (change.type === "added") {
                    //     renderCompany(change.doc);
                    // }
                }
            )
        }
    );

    /*

    db.collection("unlock").onSnapshot(
        snapshot => {
            let changes = snapshot.docChanges();
            console.log(changes)
            changes.forEach(
                change => {
                    console.log(change.type)
                    console.log(change.doc.data())

                    switch (change.type) {
                        case "added":
                            // renderCompany(change.doc);
                            break;
                        case "removed":
                            document.getElementById("companies_ul").innerHTML = "";
                            document.getElementById("companies_ul2").innerHTML = "";
                            document.getElementById("companies_ul3").innerHTML = "";
                            document.getElementById("companies_ul4").innerHTML = "";


                            fill();
                            break;
                        case "updated":

                            document.getElementById("companies_ul").innerHTML = "";
                            document.getElementById("companies_ul2").innerHTML = "";
                            document.getElementById("companies_ul3").innerHTML = "";
                            document.getElementById("companies_ul4").innerHTML = "";


                            fill();

                            break;
                        case "modified":

                            document.getElementById("companies_ul").innerHTML = "";
                            document.getElementById("companies_ul2").innerHTML = "";
                            document.getElementById("companies_ul3").innerHTML = "";
                            document.getElementById("companies_ul4").innerHTML = "";

                            fill();

                            break;
                        default:

                            document.getElementById("companies_ul").innerHTML = "";
                            document.getElementById("companies_ul2").innerHTML = "";
                            document.getElementById("companies_ul3").innerHTML = "";
                            document.getElementById("companies_ul4").innerHTML = "";

                            break;
                    }
                    // if (change.type === "added") {
                    //     renderCompany(change.doc);
                    // }
                }
            )
        }
    );
    */


    form3.addEventListener("submit", (e) => {
        //currentUserId = form.company_userId.value;
        e.preventDefault();
        var amount = form3.company_amount.value;

        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        if (doc.data().userId == currentUserId) {

                            var new_balance = parseFloat(doc.data().balance) + parseFloat(amount);

                            new_balance = new_balance.toFixed(2);
                            db.collection("users").doc(doc.id).update({balance: new_balance});

                            header1.textContent = "Balance:   " + new_balance;

                        }

                    }
                );
            }
        );

        //
        //  clear the form
        form3.company_amount.value = '';

        alert("Payment received");
    })

    form4.addEventListener("submit", (e) => {
        //currentUserId = form.company_userId.value;
        e.preventDefault();

        var limit = form4.company_limit.value;

        console.log("LLL: " + limit)


        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        if (doc.data().userId == currentUserId) {

                            db.collection("users").doc(doc.id).update({limit: limit});
                            header2.textContent = "Current Limit:   " + doc.data().limit;

                        }
                    }
                );
            }
        );
    })

    /*form2.addEventListener("submit", (e) => {
        e.preventDefault();

        if(currentUserId == adminId) {
            window.location.replace("https://parkingmapapp.herokuapp.com/addlot.html");

        }
        else {
           alert("Admin-only function");
        }




        })*/

    function fill() {
        //
//  get data
        lot_depth = 19;
        currentLotId = null;

        db.collection("lots").orderBy('lotId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        console.log("lotId" + doc.data().lotId)
                        renderCompany(doc);
                    }
                );
            }
        );

    }


    function fill2(buildingUserId, userId, rate) {

        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        console.log("building2 " + buildingUserId);
                        console.log("userId " + doc.data().userId);


                        if (doc.data().userId == buildingUserId) {
                            if (doc.data().status == 1) {
                                userId.textContent += " is currently parked";
                            } else if (doc.data().status == 0) {
                                userId.textContent += " has reserved";

                            }

                        }

                    }
                );
            }
        );
    }


    function prune(id, column, e, r) {
        const c = document.getElementById(column);
        let item = c.querySelector('[data-id=' + id + ']');
        console.log("item " + item.className);
        //c.removeChild(item);


        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {
                        if (currentUserId == doc.data().userId) {

                            state = doc.data().status;
                        }


                    }
                );
            }
        );

        db.collection("users").orderBy('userId').get().then(
            snapshot => {
                //console.log(snapshot)
                snapshot.docs.forEach(
                    doc => {

                        let new1;
                        if (currentUserId == doc.data().userId) {
                            console.log("state inner: " + doc.data().status);


                            if (state == 1) {
                                item.removeChild(e);
                            }


                        } else {
                            if (state == 1) {
                                item.removeChild(r);
                            }

                        }


                    }
                );
            }
        );


    }

