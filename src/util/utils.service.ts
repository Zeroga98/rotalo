import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

    constructor() { }

    goToTopWindow(stepTime:number, time:number) {
        let offsetScroll = this.getOffsetScrollWindow();
        const removeOffsetValue = this.getRemoveOffsetValue(offsetScroll, time, stepTime);
        const interval = setInterval(() => {
            if ( offsetScroll <= 0) {
                return clearInterval(interval);
            }
            offsetScroll = offsetScroll - removeOffsetValue ;
            window.scroll(0, offsetScroll);
        }, stepTime);
    }

    private getRemoveOffsetValue(offsetScroll, time:number, stepTime:number) {
        return (offsetScroll / time) * stepTime;
    }

    private getOffsetScrollWindow() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

}