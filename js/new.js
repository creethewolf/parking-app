
var form = document.getElementById("new_ID");
var holder = document.getElementById("holder");



var currentUserId = 4;
var found;
var phone;
var model
var lic;




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

        holder.innerHTML = '<label>Account Successfully Created. Your New Id is ' + currentUserId +  '. You will now be redirected to the main page</label>';


        //Takes a while to create the document in Firebase, allows 1.5 second
        var delayInMilliseconds = 1500; //1.5 second

        setTimeout(function() {
            alert("Back to main page")
            window.location.replace("https://psuparking.herokuapp.com/login.html");

        }, delayInMilliseconds);

    })
}




