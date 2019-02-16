import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../services/configuration.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class ModalPromoProductService {
  private modals: any[] = [];
  private productId;
  readonly urlSapi = this.configurationService.getBaseSapiUrl();
  public isWinner;
  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {}
  setProductId(productId) {
    this.productId = productId;
  }

  getProductId() {
    return this.productId;
  }

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string, isWinner, response) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open(isWinner, response);
  }

  close(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    if (modal) {
      modal.close();
    }
  }

  consultPromo(params) {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/productos/promo-reno`;
    return this.http.post(url, params, { headers: headers })
    .pipe(map((response: any) => response));
  }

}
