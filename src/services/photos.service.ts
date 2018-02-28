import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from "../services/configuration.service";


@Injectable()
export class PhotosService {
    readonly url: string = this.configurationService.getBaseUrl() + '/v1/photos';

    constructor(private http: HttpClient, private configurationService: ConfigurationService) {
        console.log("http work");
    }

    getUrlPhotos(): string {
        return this.url;
    }

    updatePhoto(file: File): Promise<any> {
        const formData: FormData = this.buildFormData(file);
        return this.http.post(this.url, formData,
                    {
                        headers: new HttpHeaders().delete('Content-Type')
                    })
                .toPromise().then((res: any) => res.data);
    }

    deletePhotoById(id: number): Promise<any> {
        const url = `${this.url}/${id}`;
        return this.http.delete(url,
                    {
                       params: new HttpParams().set('data[type]', 'photos')
                    }).toPromise();
    }

    private buildFormData(file: File): FormData{
        let formData= new FormData();
        formData.append('data[attributes][file]', file, file.name);
        formData.append('data[type]', 'photos');
        return formData;
    }
}
