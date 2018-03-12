import { Component, ChangeDetectionStrategy } from '@angular/core';
@Component({
    selector: 'back-arrow',
    templateUrl: 'back-arrow.component.html',
    styleUrls: ['back-arrow.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackArrowComponent {
    goBack(): void {
        window.history.back();
    }
}
