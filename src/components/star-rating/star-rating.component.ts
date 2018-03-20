import { element } from 'protractor';
import { EventEmitter, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'star-rating',
	templateUrl: './star-rating.component.html',
	styleUrls: ['./star-rating.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent implements OnInit, AfterViewInit {
	@Input() max: number = 5;
	@Input() rating: number | boolean;
	@Output() checked: EventEmitter<number> = new EventEmitter();
	@ViewChild('containerStars',{read: ElementRef}) containerStars: ElementRef;
	stars: Array<any> = [];

	constructor(private render: Renderer2) { }

	ngOnInit() {
		this._drawStarts();
	}

	ngAfterViewInit(){
		if(this.rating) this._drawCheckedStars(this.rating as number - 1);
	}

	checkStar(index: number){
		this._drawCheckedStars(index);
		this.checked.emit(index + 1);
	}

	private _drawCheckedStars(index: number){
		const stars = Array.from(this.containerStars.nativeElement.children);
		stars.forEach((element,i: number) => {
			index >= i ? this.render.addClass(element,'checked') : this.render.removeClass(element,'checked');
		});
	}

	private _drawStarts(){
		this.stars = Array(this.max);
	}

}
