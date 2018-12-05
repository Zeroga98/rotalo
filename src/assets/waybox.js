function pagar(amount, publicKey, referenciaOrden, urlRedireccion) {
  let checkout = new WayboxCheckout({
      currency: 'COP',
      amountInCents: amount + '00',
      reference: referenciaOrden,
      publicKey: publicKey,
      redirectUrl: urlRedireccion
    })
  checkout.open((e) => {
    console.log(e);
  });
}
