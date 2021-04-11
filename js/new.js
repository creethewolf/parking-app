
var form = document.getElementById("new_ID");
var holder = document.getElementById("holder");



var currentUserId = 4;
var found;
var phone;
var model
var lic;



function msToDate(ms){
    var date = new Date(ms);

    var month = date.getMonth();

    var day = date.getDay();

    var hours = date.getHours();
// Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


    return formattedTime;


}


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





form.addEventListener("submit", (e) => {
    //currentUserId = form.company_userId.value;
    e.preventDefault();

    found = false;

    currentUserId = form.pass.value;


    //
    //  clear the form
    form.pass.value = '';

    const db = firebase.firestore();
    db.settings({});
    console.log(db)








    //Added delays throughout the code to allow time to search the database, may need to change them later

    found = check();

    var delayInMilliseconds = 500; //0.5 second

    setTimeout(function() {
        //your code to be executed after 0.5 second
console.log(found);

    if(found === true){
        alert("Sorry that ID already exists. Please try another one.")
    }


    if(found === false) {
        next();
        form = "";

    }
    }, delayInMilliseconds);




})

function check(){
    var nummers = db.collection("users").where("userId", "==", currentUserId)
    nummers.get().then(function (querySnapshot) {
        console.log("result: "+ !querySnapshot.empty)

        found = !querySnapshot.empty
    })

}


function next(){
    console.log("found: " + found)

    holder.innerHTML = '';

    holder.innerHTML += '<form id="get_info" class="login100-form validate-form"> <span class="login100-form-title"> Enter Information: </span> <div class="wrap-input100 validate-input" data-validate = "Id is required"> <input class="input100" name="phone" placeholder="Phone"> <span class="focus-input100"></span> <span class="symbol-input100"> </span> </div> <br> <label>Vehicle Information: </label> <div class="wrap-input100 validate-input" data-validate = "Model is required"> <input class="input100" name="car" placeholder="Model"> <span class="focus-input100"></span> <span class="symbol-input100"> </span> </div> <div class="wrap-input100 validate-input" data-validate = "License No. is required"> <input class="input100"  name="lic" placeholder="License No."> <span class="focus-input100"></span> <span class="symbol-input100"> </span> </div> <div class="container-login100-form-btn"> <button class="login100-form-btn">Submit </button> </div> </form>'


    form = document.getElementById("get_info");
    console.log("form: " + form)








    form.addEventListener("submit", (e) => {
        //currentUserId = form.company_userId.value;
        form1 = document.getElementById("get_info");

        e.preventDefault();
        console.log("name: " + form1.id)
        phone = form1.phone.value;
        model = form1.car.value;
        lic = form1.lic.value;

        db.collection("users").add({
            userId: currentUserId,
            phone: phone,
            model: model,
            lic: lic,
            status: 0,
            checkin: "Null",
            checkout:"Null",
            balance: 20,
            limit: -1
        });


        sendAlert(currentUserId, 'Account Successfully Created. Your New Id is ' + currentUserId +  '. You will now be redirected to the main page');

        holder.innerHTML = '<label>Account Successfully Created. Your New Id is ' + currentUserId +  '. You will now be redirected to the main page</label>';


        //Takes a while to create the document in Firebase, allows 1.5 second
        var delayInMilliseconds = 1500; //1.5 second

        setTimeout(function() {
            alert("Back to main page")
            window.location.replace("https://psuparking.herokuapp.com/login.html");

        }, delayInMilliseconds);

    })
}




