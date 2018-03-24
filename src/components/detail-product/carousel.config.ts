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
      visible: true,
      pointStyles: `
        .ngxcarouselPoint{
            position: absolute;
            bottom: 18px;
            left: 50%;
            z-index: 15;
            width: 60%;
            margin-left: -30%;
            padding-left: 0;
            list-style: none;
            text-align: center;
        }

        .ngxcarouselPoint > li {
                background-color: rgba(237, 47, 60, 0.4);
                border: 0 none;
                height: 8px;
                margin: 0 4px;
                width: 8px;
                display: inline-block;
                text-indent: -999px;
                cursor: pointer;
                border-radius: 10px;
        }

        .ngxcarouselPoint > li.active {
            background-color: white;
            border: 1px solid rgba(237, 47, 60, 0.4);
            height: 8px;
            margin: 0 4px;
            width: 8px;
        }`
  },
  load: 2,
  touch: true,
  loop: true,
  custom: 'banner'
};
