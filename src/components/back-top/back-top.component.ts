import { Component, Input } from '@angular/core';
@Component({
    selector:'back-top',
    templateUrl: 'back-top.component.html',
    styleUrls: ['back-top.component.scss']
})
export class BackTopComponent {
    @Input() time: number = 600;
    @Input() stepTime: number = 20;

    goToTop() {
        let offsetScroll = this.getOffsetScrollWindow();
        const removeOffsetValue = this.getRemoveOffsetValue(offsetScroll);
        const interval = setInterval(() => {
            if ( offsetScroll <= 0) {
                return clearInterval(interval);
            }
            offsetScroll = offsetScroll - removeOffsetValue ;
            window.scroll(0, offsetScroll);
        }, this.stepTime);
    }

    private getRemoveOffsetValue(offsetScroll) {
        return (offsetScroll / this.time) * this.stepTime;
    }

    private getOffsetScrollWindow() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }
}
