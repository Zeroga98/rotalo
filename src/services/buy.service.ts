import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ConfigurationService } from "./configuration.service";

@Injectable()
export class BuyService {
  private readonly url = this.configurationService.getBaseUrl() + "/purchases";
  constructor(
    private httpClient: HttpClient,
    private configurationService: ConfigurationService
  ) {}

  buyProduct(params): Promise<any> {
    return this.httpClient.post(this.url, this.buildParams(params)).toPromise();
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
