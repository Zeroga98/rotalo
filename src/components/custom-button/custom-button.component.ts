import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Input } from '@angular/core';
@Component({
    selector:'custom-button',
    templateUrl: 'custom-button.component.html',
    styleUrls: ['custom-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomButtonComponent {
    @Input() text: string =  '';
    @Input() buttonClass: string = 'primary';
    @Input() type: string = 'button';
    @Input() disabled: boolean = false;
    @Input() link: string;
}