function pagar(amount) {
    var publicKey = 'pub_test_CYgwfGUNiOxIWh4WRJnfOsCu4FIxhy8p';
    var privateKey = 'prv_test_jAK3LXACf8ewSNJmhW86aa9I2b1NX3fb';
    var uniqueReference = 'asdf456468342384562';
    var redirectUrl = 'http://localhost:8080/testWaybox/index.html';
    var currency = 'COP';
    var amount = amount + '00';
    
    
    let checkout = new WayboxCheckout({
        currency: currency,
        amountInCents: amount,
        reference: uniqueReference,
        publicKey: publicKey,
        redirectUrl: redirectUrl
      })    
    checkout.open(() => {});
}