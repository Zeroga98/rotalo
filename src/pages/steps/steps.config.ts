export const CONFIG = {
    STEPS: [
		{
			img: "./assets/img/wizard/step1.png",
			logo: "./assets/img/wizard/logo.png",
			title: "Aquí puedes comprar, vender y regalar tus cosas",
			buttonText: "Continuar"
		}, {
			img: "./assets/img/wizard/step2.png",
			title: "Elige con quién quieres rotarlo y haz tus compras de manera confiable",
			text:"¡Descomplícate!",
			buttonText: "Continuar"
		}, {
			img: "./assets/img/wizard/step3.png",
			title: "¡Relájate! Nosotros te prestamos para que lo puedas tener",
			text:"¿Necesitas plata para comprarlo?",
			buttonText: "Terminar"
		}
    ],
    CAROUSEL: {
        grid: {
            xs: 1,
            sm: 1,
            md: 1,
            lg: 1,
            all: 0
        },
        slide: 1,
        speed: 400,
        point: {
            visible: true
        },
        load: 2,
        touch: false,
        loop: true,
    }
}