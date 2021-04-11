const header = document.getElementById("curruser");
const header2 = document.getElementById("lim");


const form1 = document.getElementById("set_user_id")
const form4 = document.getElementById("limit_form")

//const form2 = document.getElementById("toAdd")

var currentUserId = null;

var adminId = "rkp8@psu.edu";
var adminId2 = "aap60@psu.edu";
var adminId3 = "caw5890@psu.edu";

var reserved = false;
var currentLotId = null;
var admin = false;
var lot_depth = 19;
var oldlotId = null;
var buildingUserId = "Null";
var state;
var unlockflag = false;






var issuePending = false;


if(currentUserId!=null)
    header.textContent = "Currently Logged in as User:   " + currentUserId;



function get_balance_and_limit()
{
    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if (doc.data().userId == currentUserId) {


                        header2.textContent = "Current Deadline: " + doc.data().deadline;


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

    if(currentUserId == adminId || currentUserId == adminId2) {
        header.textContent = "Currently Logged in as Admin:   " + currentUserId;
        admin = true;
    }
    else {
        header.textContent = "Currently Logged in as User:   " + currentUserId;
        admin = false;
    }

    db.collection("users").orderBy('userId').get().then(
        snapshot => {
            //console.log(snapshot)
            snapshot.docs.forEach(
                doc => {
                    if(doc.data().userId == currentUserId){

                        header2.textContent = "Current Deadline: " + doc.data().deadline;

                    }
                }
            );
        }
    );


    //
    //  clear the form
    form1.new_user_id.value = '';



    // alert("Data saved!");
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


                        var today = new Date();
                        today.setHours( today.getHours() + parseInt((limit)));
                        var time = (today.getHours()) + ":" + today.getMinutes() + ":" + today.getSeconds();
                        db.collection("users").doc(doc.id).update({deadline: time});



                        header2.textContent = "Current Deadline:   " + time;

                    }
                }
            );
        }
    );
})
