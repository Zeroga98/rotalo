import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_PRODUCTS_CONFIG: NgxCarousel = {
    /*    grid: {
            xs: 1,
            sm: 3,
            md: 4,
            lg: 5,
            all: 0
        },*/
    grid: { xs: 2, sm: 3, md: 4, lg: 5, all: 208 },
    slide: 1,
    speed: 500,
    interval: 3600000,
    point: {
        visible: false
    },
    load: 2,
    touch: true,
    easing: 'ease'
};
