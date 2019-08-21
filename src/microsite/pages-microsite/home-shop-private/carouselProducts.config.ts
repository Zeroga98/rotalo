import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_PRODUCTS_MICROSITE_CONFIG: NgxCarousel = {
    grid: {
        xs: 1,
        sm: 2.5,
        md: 3,
        lg: 4,
        all: 254
    },
    slide: 1,
    speed: 5000000,
    interval: 7000,
    point: {
        visible: false
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner'
};
