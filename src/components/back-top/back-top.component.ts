import { UtilsService } from './../../util/utils.service';
import { Component, Input } from '@angular/core';
@Component({
    selector:'back-top',
    templateUrl: 'back-top.component.html',
    styleUrls: ['back-top.component.scss']
})
export class BackTopComponent {
    @Input() time: number = 600;
    @Input() stepTime: number = 20;

    constructor(private utilsService: UtilsService){}

    goToTop() {
        this.utilsService.goToTopWindow(this.stepTime, this.time)
    }
}
