import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_CONFIG: NgxCarousel = {
    grid: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        all: 0
    },
    slide: 1,
    speed: 400,
    interval: 4000,
    point: {
        visible: true
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner'
};
