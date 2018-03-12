import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

@Component({
    selector: 'flash-message',
    templateUrl: 'flash-message.template.html',
    styleUrls: ['flash-message.styles.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlashMessageComponent {
    @Input() error: Object = {};
    @Input() success: Object = {};
    
}
