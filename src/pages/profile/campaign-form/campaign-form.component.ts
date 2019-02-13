import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { ImageUploadComponent } from 'angular2-image-upload';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { DATAPICKER_CONFIG_CAMPAIGN } from '../../../commons/constants/datapickerCampaigns';

@Component({
  selector: 'campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {
  public datePickerOptions: IMyDpOptions = DATAPICKER_CONFIG_CAMPAIGN;
  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  readonly maxNumberPhotos: number = 3;
  public maxNumberImg = this.maxNumberPhotos;
  public numberOfPhotos = [1, 2, 3];
  public photosUploaded: Array<any> = [];
  public errorUploadImg = false;
  public errorMaxImg = false;
  public formCampaign;
  public communitiesForm: FormArray;
  public communities;
  @ViewChild('imageInput') imageInput: ImageUploadComponent;
  constructor(private formBuilder: FormBuilder,  private userService: UserService,) { }

  ngOnInit() {
    this.getCommunities();
    this.setInitialForm(this.getInitialConfig());
  }

  async getCommunities() {
    try {
      const communities = await this.userService.getCommunities();
      this.communities = communities.body.comunidades;
    } catch (error) {
      console.error(error);
    }
  }

  private setInitialForm(config) {
    this.formCampaign = this.formBuilder.group({
      title: [config.title, [Validators.required]],
      winnerText: [config.winnerText, [Validators.required]],
      loserText: [config.loserText, [Validators.required]],
      campaignsCommunities: this.formBuilder.array([ this.createItem() ])
    });

  }

  private createItem() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const objectDate = {
      date: {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDate()
        }
    };
    return this.formBuilder.group({
      idCommunity: [-1, [Validators.required]],
      startAt: [objectDate, [Validators.required]],
      untilAt: [objectDate, [Validators.required]],
      path: [null , [Validators.required]]
    });
  }

  private getInitialConfig() {
    const campaign = {
      title: null,
      winnerText: null,
      loserText: null,
      campaignsCommunities: {
        idCommunity: -1,
        startAt: null,
        untilAt: null,
        path: null
      }
    };
    return campaign;
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

  addCampaign(): void {
    this.communitiesForm = this.formCampaign.get('campaignsCommunities') as FormArray;
    this.communitiesForm.push(this.createItem());
  }

  removeCampaign(id) {
    const campaign = this.formCampaign.get('campaignsCommunities').controls;
    if (campaign.length > 1) {
      this.formCampaign.get('campaignsCommunities').controls = campaign.filter((item, index ) => {
        if (index != id) {
          return item;
        }
      });
    }
  }

  createCampaign() {

  }

}
