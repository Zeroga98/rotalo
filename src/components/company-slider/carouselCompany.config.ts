import { NgxCarousel } from "ngx-carousel";

export const CAROUSEL_COMPANY_CONFIG: NgxCarousel = {
    grid: {
        xs: 3,
        sm: 3,
        md: 4,
        lg: 4,
        all: 0
    },
    slide: 4,
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
