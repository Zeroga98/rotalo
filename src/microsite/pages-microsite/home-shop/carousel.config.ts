import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_CONFIG: NgxCarousel = {
    grid: {
        xs: 2,
        sm: 2,
        md: 2,
        lg: 2,
        all: 0
    },
    slide: 1,
    speed: 500,
    interval: 3600000,
    point: {
        visible: false
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner'
};
