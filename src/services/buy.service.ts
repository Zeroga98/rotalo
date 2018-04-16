import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConfigurationService } from "./configuration.service";


@Injectable()
export class BuyService {
  private readonly url = this.configurationService.getBaseUrl() + "/v1/purchases";
  private readonly urlNequi = this.configurationService.getBaseUrlNequi() + "/api/v1/pagos/nequi/notificaciones";
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  buyProduct(params): Promise<any> {
    return this.httpClient.post(this.url, this.buildParams(params)).toPromise();
  }

  buyProductNequi(params) {
    const jsonNequiHeaders = this.configurationService.getJsonNequiHeaders();
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient.post(this.urlNequi, params, { headers: headers }).map( (response: any) =>
      response
    );
  }

  validateStateNequi(params) {
    const url = this.configurationService.getBaseUrlNequi() +
    `/api/v1/pagos/nequi/estado-pago-reactivo?` +
    `numeroCelular=${params.numeroCelular}&idTransaccion=${params.idTransaccion}&idProducto=${params.idProducto}`;
    const jsonNequiHeaders = this.configurationService.getJsonNequiHeaders();
    const headers = new HttpHeaders(jsonNequiHeaders);
    return this.httpClient.get(url, { headers: headers }).map( (response: any) =>
      response
    );
  }

  confirmPurchase(id) {
    this.sendResponsePurchase(id, "confirm");
  }

  declinePurchase(id) {
    this.sendResponsePurchase(id, "decline");
  }

  private sendResponsePurchase(id: number, action: string) {
    const url = `${this.url}/${id}/${action}`;
    return this.httpClient.post(url, {
        data: {
          id,
          type: "purchases"
        }
      })
      .toPromise();
  }

  private buildParams(params) {
    return {
      data: {
        attributes: params,
        type: "purchases"
      }
    };
  }
}
