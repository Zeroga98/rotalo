import { Injectable } from '@angular/core';

import {  Observable, BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class LikeDataSharingService {

    private likeProduct = new BehaviorSubject({});
    likeProductObservable: Observable<{}> = this.likeProduct.asObservable();

    updateLikeProduct(likeProducto) {
        this.likeProduct.next(likeProducto);
    }
}