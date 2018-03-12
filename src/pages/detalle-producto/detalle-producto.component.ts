import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: "detalle-producto",
  templateUrl: "./detalle-producto.component.html",
  styleUrls: ["./detalle-producto.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetalleProductoComponent implements OnInit {
	idProduct: number = parseInt(this.router.url.replace(/[^\d]/g, ''));
	isDetailReadOnly: boolean = false;
	constructor(private router: Router, private activedRoute: ActivatedRoute) {

	}

	ngOnInit() {
		this.activedRoute.params.subscribe( params =>{
			console.log("params: ", params);
			this.isDetailReadOnly = params.readOnly || false;
		})
	}
}
