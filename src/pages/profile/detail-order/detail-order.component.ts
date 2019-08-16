import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProductsService } from '../../../services/products.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { UserService } from '../../../services/user.service';
import { ROUTES } from '../../../router/routes';
import { CurrentSessionService } from '../../../services/current-session.service';

@Component({
  selector: 'app-detail-order',
  templateUrl: './detail-order.component.html',
  styleUrls: ['./detail-order.component.scss']
})
export class DetailOrderComponent implements OnInit, AfterViewInit {

  public detailOrder;
  public user;
  public terms = `/${ROUTES.TERMS}`;
  public isOwnOrder;
  public sold = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.SOLD}`;
  public adminOrders = `/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.ADMINORDERS}`;

  constructor( private userService: UserService,
    private currentSession: CurrentSessionService,
    private actRoute: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router) { }

  ngOnInit() {
    this.actRoute.params.subscribe((response) => {
      this.getDetailOrders(response.id);
    });

  }

  ngAfterViewInit(): void {
  }

  getDetailOrders(reference) {
    this.productsService.detailOrders(reference).subscribe((response) => {
      if (response.body) {
       this.detailOrder = response.body.detalleOrden;
       console.log(this.detailOrder);
        if (this.currentSession.currentUser().id == this.detailOrder.userId) {
          this.isOwnOrder = true;
        }
        this.getInfoUser(this.detailOrder.userId);
      }
    }, (error) => {
      console.log(error);
    });
  }

  formatDate(date) {
    const dateMoment: any = moment(date);
    date = dateMoment.format('DD [de] MMMM [de] YYYY');
    return date;
  }

  getUrlImge(photo) {
      return ('url(' + photo.replace(/ /g, '%20')) + ')';
  }

  getInfoUser(userId) {
    this.userService.getInfomationUser(userId).then((response) => {
      this.user = response;
    }) .catch(httpErrorResponse => {
      console.log(httpErrorResponse);
    });
  }

}
