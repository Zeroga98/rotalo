function pagar(amount, publicKey, referenciaOrden, urlRedireccion) {
    let checkout = new WayboxCheckout({
        currency: 'COP',
        amountInCents: amount + '00',
        reference: referenciaOrden,
        publicKey: publicKey,
        redirectUrl: urlRedireccion
    })
    checkout.open((e) => {
        localStorage.setItem('jsonFromWaybox', JSON.stringify(e));
        window.location.href = "http://10.25.65.248:4200/products/microsite/response";
    });
}