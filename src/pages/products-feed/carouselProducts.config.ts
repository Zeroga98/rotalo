import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_PRODUCTS_CONFIG: NgxCarousel = {
    grid: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        all: 0
    },
    slide: 1,
    speed: 500,
    interval: 9000,
    point: {
        visible: false
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner'
};
