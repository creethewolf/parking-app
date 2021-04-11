
const header = document.getElementById("curruser");
const header1 = document.getElementById("bal");
const header2 = document.getElementById("lim");

const form1 = document.getElementById("set_user_id")
const form3 = document.getElementById("money_form")

//const form2 = document.getElementById("toAdd")

var currentUserId = null;
var adminId = "rkp8@psu.edu";
var reserved = false;
var currentLotId = null;
var admin = false;
var lot_depth = 19;
var oldlotId = null;
var buildingUserId = "Null";
var state;



if(currentUserId!=null) {
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


    header.textContent = "Currently Logged in as User:   " + currentUserId;
}

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

                            sendAlert(doc.data().userId, "Payment of $" + amount + " was received. Your new balance is $" + new_balance);


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


function sendAlert(ID, message){
    console.log("sending")
    db.collection("users").where("userId", "==", ID)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(" => ", doc.data().userId); //prints userId to console

                phone = doc.data().phone; //userId is obtained and stored here


                var request = {
                    "to": "+1 " +phone.toString(),
                    "body": message
                }

                //TODO: Send it to them in a text message, using Phone and message variables

                fetch('https://p0h9q1u3l3.execute-api.us-east-2.amazonaws.com/dev/send', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:JSON.stringify(request)
                })
                    .then(res => res.json())
                    .then(data => {

                        if(data.success == true)
                        {
                            console.log("Alert Sent to User " + ID);
                        }
                        else if(data.success == false)
                            console.log("Sorry, that ID had an invalid phone number.")
                    });



            });



        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });


}

