
import {map} from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../services/configuration.service';


@Injectable()
export class PhotosService {
    readonly url: string = this.configurationService.getBaseUrl() + '/photos';

    constructor(private http: HttpClient, private configurationService: ConfigurationService) {  }

    getUrlPhotos(): string {
        return this.url;
    }

    updatePhoto(file: File) {
      const formData: FormData = this.buildFormData(file);

      return this.http.post(this.url, formData,
                  {
                      headers: new HttpHeaders().delete('Content-Type')
                  }).pipe(map ((res: any) => res.data));
  }

    deletePhotoById(id: number): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.delete(url,
                    {
                       params: new HttpParams().set('data[type]', 'photos')
                    }).toPromise();
    }

    private buildFormData(file: File): FormData {
        const formData = new FormData();
        formData.append('data[attributes][file]', file, file.name);
        formData.append('data[type]', 'photos');
        return formData;
    }
}
