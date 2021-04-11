const stripe = require('stripe')('sk_test_51Iet34J2orohyskSDKUXHVtRARm1tdPNZUO6yX78fL35CJQ0ptzyluo3RaI8FyJ1Jps4MMDEOl9RYJ2osMZvQgFf00jEsEgohc');


function getPaymentInfo() {
    //----------------------------------------------------------------
    var cardInfoExp = document.getElementById("monthYear").value;
    var yy = cardInfoExp.split("/");
    //----------------------------------------------------------------
    var isChecked = document.getElementById("fullAmountBut").checked;
    if(isChecked == false){
        //if(//custom > total);
        var amount = document.getElementById("customAmount").value;
    }
    else{
        var amount = "TOTAL";
    }

    Stripe.card.createToken({
        number: $('input[id=card-number]').valueOf(),
        cvc: $('input[id=card-cvc]').valueOf(),
        exp_month: yy[0],
        exp_year: yy[1]
    }, stripeResponseHandler);
}

var stripeResponseHandler = async function (status, response) {
    if (response.error) {
        alert("PAYMENT ERROR")
    } else {
        // Get the token ID:
        const token = response.id;
        const charge = await stripe.charge.create({
            amount: 12, //get amount charged here
            currency: 'usd',
            description: 'Example charge',
            source: token,
        });
    }
}
