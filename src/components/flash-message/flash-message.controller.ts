import { Component, Input } from "@angular/core";

@Component({
    selector: 'flash-message',
    templateUrl: 'flash-message.template.html',
    styleUrls: ['flash-message.styles.scss']
})
export class FlashMessageComponent {
    @Input() error: Object = {};
    @Input() success: Object = {};
    
}
