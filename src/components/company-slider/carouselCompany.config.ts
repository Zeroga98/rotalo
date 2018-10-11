import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_COMPANY_CONFIG: NgxCarousel = {
    grid: {
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        all: 0
    },
    slide: 1,
    speed: 900,
    interval: 7000,
    point: {
        visible: false
    },
    load: 2,
    touch: true,
    loop: true,
    custom: 'banner'
};
