import { Component, OnInit, ViewChild } from '@angular/core';
import { DATAPICKER_CONFIG } from '../../../commons/constants/datapicker.config';
import { IMyDpOptions } from 'mydatepicker';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { ImageUploadComponent } from 'angular2-image-upload';

@Component({
  selector: 'campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {
  public datePickerOptions: IMyDpOptions = DATAPICKER_CONFIG;
  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  readonly maxNumberPhotos: number = 3;
  public maxNumberImg = this.maxNumberPhotos;
  public numberOfPhotos = [1, 2, 3];
  public photosUploaded: Array<any> = [];
  public errorUploadImg = false;
  public errorMaxImg = false;
  @ViewChild('imageInput') imageInput: ImageUploadComponent;
  constructor() { }

  ngOnInit() {
  }

  onUploadImageFinished(event) {
    this.errorUploadImg = false;
    this.errorMaxImg = false;
    if (event.file.type == 'image/png' || event.file.type == 'image/gif') {
      if (event.file.size < 5000000) {
        this.photosUploaded.push(event);
      } else {
        this.errorMaxImg = true;
        this.imageInput.deleteFile(event.file);
      }
    } else  {
      this.errorUploadImg = true;
      this.imageInput.deleteFile(event.file);
    }
  }

  overFiles () {
    this.imageInput.onFileOver(true);
  }

  onDrop(event) {
    this.imageInput.onFileChange(event.dataTransfer.files);
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event) {
    this.imageInput.onFileOver(true);
    event.stopPropagation();
    event.preventDefault();
  }

  uploadFiles() {
    const element: HTMLElement = document.querySelector('input[type="file"]') as HTMLElement;
    element.click();
  }

  onRemovePreviewImage(event) {
    const photoFile = this.findPhotoWithId(event.file);
    this.filterPhotoFile(event);
    if (photoFile) {
      this.imageInput.deleteFile(photoFile);
    }
  }

  private findPhotoWithId(file) {
    return this.imageInput.files.find(inputFile => {
     return inputFile.file == file;
     });
  }

  private filterPhotoFile(event) {
    this.photosUploaded = this.photosUploaded.filter(photo => {
      return photo.file.name != event.file.name;
    });
  }

}
