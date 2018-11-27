import { Component } from '@angular/core';
@Component({
    selector: 'back-arrow-microsite',
    templateUrl: 'back-arrow-microsite.component.html',
    styleUrls: ['back-arrow-microsite.component.scss']
})
export class BackArrowMicrositeComponent {
    goBack(): void {
        window.history.back();
    }
}
