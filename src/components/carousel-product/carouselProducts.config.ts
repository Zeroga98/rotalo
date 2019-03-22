import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_PRODUCTS_CONFIG: NgxCarousel = {
    grid: {
        xs: 2,
        sm: 3,
        md: 4,
        lg: 5,
        all: 0
    },
    slide: 5,
    speed: 500,
    interval: 7000,
    point: {
        visible: false
    },
    load: 2,
    touch: true,
    loop: false,
    custom: 'banner'
};
