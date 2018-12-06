
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigurationService } from "../../../services/configuration.service";
import 'rxjs/add/operator/mergeMap';
import { ProductInterface } from "../../../commons/interfaces/product.interface";
import { ProductsMicrositeService } from "../back/products-microsite.service";

function _window(): any {
  // return the global native browser window object
  return window;
}

@Injectable()
export class windowService {
  get nativeWindow(): any {
    return _window();
  }
}
