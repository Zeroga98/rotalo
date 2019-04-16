
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';


@Injectable()
export class PhotosService {
  //readonly url: string = this.configurationService.getBaseUrl() + '/photos';
  readonly urlSapi = this.configurationService.getBaseSapiUrl();

  constructor(private http: HttpClient, private configurationService: ConfigurationService) { }

  /*getUrlPhotos(): string {
    return this.url;
  }*/


  /*updatePhoto(file: File) {
   const formData: FormData = this.buildFormData(file);
    return this.http.post(this.url, formData,
      {
        headers: new HttpHeaders().delete('Content-Type')
      }).pipe(map((res: any) => res.data));
  }*/

  uploadPhoto(file: File) {
  const formData: FormData = this.buildFormDataPhotos(file);
   const url = this.urlSapi + '/imagenes/upload';
    return this.http.post(url, formData,
      {
        headers: new HttpHeaders().delete('Content-Type')
      }).pipe(map((res: any) => res.body));
  }

  /*deletePhotoById(id: number): Promise<any> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url,
      {
        params: new HttpParams().set('data[type]', 'photos')
      }).toPromise();
  }*/

  deletePhoto(id: number): Promise<any> {
    const jsonSapiHeaders = this.configurationService.getJsonSapiHeaders();
    const headers = new HttpHeaders(jsonSapiHeaders);
    const url = `${this.urlSapi}/imagenes/eliminar/${id}`;
    return this.http.delete(url,
      { headers: headers }).toPromise().then((response: any) => true);
  }

  private buildFormDataPhotos(file: File): FormData {
    const formData = new FormData();
    formData.append('fotos', file, file.name);
    formData.append('data[type]', 'fotos');
    return formData;
  }

  private buildFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('data[attributes][file]', file, file.name);
    formData.append('data[type]', 'photos');
    return formData;
  }


}
