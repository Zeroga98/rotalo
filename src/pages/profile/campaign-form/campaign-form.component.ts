import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { IMyDpOptions } from 'mydatepicker';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';
import { ImageUploadComponent } from 'angular2-image-upload';
import { FormBuilder, Validators, FormArray, FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { DATAPICKER_CONFIG_CAMPAIGN } from '../../../commons/constants/datapickerCampaigns';
import { PhotosService } from '../../../services/photos.service';
import * as moment from 'moment';
import { ROUTES } from '../../../router/routes';
import { Router } from '@angular/router';


@Component({
  selector: 'campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})

export class CampaignFormComponent implements OnInit, OnChanges {
  public datePickerOptions: IMyDpOptions = DATAPICKER_CONFIG_CAMPAIGN;
  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  readonly maxNumberPhotos: number = 3;
  public maxNumberImg = this.maxNumberPhotos;
  public numberOfPhotos = [1, 2, 3];
  public photosUploaded: Array<any> = [];
  public photosUploadedId: Array<any> = [];
  public errorUploadImg = false;
  public errorMaxImg = false;
  public formCampaign;
  public communitiesForm: FormArray;
  public communities;
  public disableBtn = false;
  @Input() campaign;
  @ViewChild('imageInput') imageInput: ImageUploadComponent;
  @Output() publish: EventEmitter<any> = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private photosService: PhotosService,
    private router: Router) { }

  ngOnInit() {
    this.getCommunities();
    this.setInitialForm(this.getInitialConfig());
  }

  ngOnChanges(): void {
    if (this.campaign) {
      this.setInitialForm(this.getInitialConfig());
      this.saveInitialPhotos();
    }
  }

  private saveInitialPhotos() {
    this.photosUploaded = [].concat(this.transformFormat(this.campaign.stickerPhoto));
    this.photosUploaded.push(this.transformFormat(this.campaign.winPhoto));
    this.photosUploaded.push(this.transformFormat(this.campaign.losePhoto));
    if (this.maxNumberImg > 0 && this.maxNumberImg <= this.maxNumberPhotos) {
      this.maxNumberImg = this.maxNumberImg - this.photosUploaded.length;
    }
  }

  private transformFormat(photo) {
    const file = {
      file: {
        name: photo.file,
      },
      photoId: photo.id,
      src: photo.url,
      noUpload: true
    };
    return file;
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
      campaignsCommunities: this.formBuilder.array(this.createItem(config.campaignsCommunities))
    });
    if (this.campaign) {
      this.setCreatItem(config);
    }
  }

  private createItem(campaignsCommunities) {
  const comunities = campaignsCommunities.map((comunity) => {
    if (this.campaign) {
      const startAt  = moment(comunity.startAt).toDate();
      const objectStartAt = {
        date: {
          year: startAt.getFullYear(),
          month: startAt.getMonth() + 1,
          day: startAt.getDate() + 1
          }
      };
      comunity.startAt = objectStartAt;
      const untilAt  = moment(comunity.untilAt).toDate();
      const objectUntilAt = {
        date: {
          year: untilAt.getFullYear(),
          month: untilAt.getMonth() + 1,
          day: untilAt.getDate() + 1
          }
      };
      comunity.untilAt = objectUntilAt;
    }
    return this.formBuilder.group({
      communityId: [comunity.communityId, [Validators.required]],
      startAt: [comunity.startAt, [Validators.required]],
      untilAt: [comunity.untilAt, [Validators.required]],
      productId: [comunity.productId, [Validators.required]]
    });
  });
   return  comunities;
  }

  private setCreatItem(config) {
    config.campaignsCommunities.map((community) => {

    });
  }

  private getInitialConfig() {
    const campaign = {
      title: null,
      winnerText: null,
      loserText: null,
      campaignsCommunities: [{
        communityId: -1,
        startAt: null,
        untilAt: null,
        productId: null
      }]
    };
    if (this.campaign) {
      return this.campaign;
    }
    return campaign;
  }

  private initialCommunity() {
    const campaign = {
      communityId: -1,
      startAt: '',
      untilAt: '',
      productId: null
    };
    return  campaign;
  }

  private createBasicItem(campaignsCommunities) {
      return this.formBuilder.group({
        communityId: [campaignsCommunities.communityId, [Validators.required]],
        startAt: [campaignsCommunities.startAt, [Validators.required]],
        untilAt: [campaignsCommunities.untilAt, [Validators.required]],
        productId: [campaignsCommunities.productId, [Validators.required]]
      });
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
    } else {
      this.errorUploadImg = true;
      this.imageInput.deleteFile(event.file);
    }
  }

  overFiles() {
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
    if (this.maxNumberImg >= 0 && this.maxNumberImg <= this.maxNumberPhotos) {
      this.maxNumberImg = this.maxNumberPhotos - (this.photosUploaded.length - this.imageInput.files.length ) ;
    }
  }

  addCampaign(): void {
    this.communitiesForm = this.formCampaign.get('campaignsCommunities') as FormArray;
    this.communitiesForm.push(this.createBasicItem(this.initialCommunity()));
  }

  removeCampaign(id) {
    const campaign = this.formCampaign.get('campaignsCommunities').controls;
    if (campaign.length > 1) {
      this.formCampaign.get('campaignsCommunities').controls = campaign.filter((item, index) => {
        if (index != id) {
          return item;
        }
      });
    }
  }

  createCampaign() {
    if (!this.disableBtn && !this.formCampaign.invalid &&  this.photosUploaded.length >= 3) {
      this.disableBtn = true;
      this.photosUploaded.map((event) => {
        if (event.noUpload) {
          this.photosUploadedId.push(event);
          if (this.photosUploadedId.length >= 3) {
            this.createRequest();
          }
        } else {
          this.photosService.uploadPhoto(event.file).subscribe((response) => {
            this.photosUploadedId.push(response);
            if (this.photosUploadedId.length >= 3) {
              this.createRequest();
            }
          }, (error) => {
            this.disableBtn = false;
            if (error.error && error.error.status) {
              if (error.error.status == '624') {
                this.errorUploadImg = true;
                this.imageInput.deleteFile(event.file);
              } else if (error.error.status == '625') {
                this.errorMaxImg = true;
                this.imageInput.deleteFile(event.file);
              } else {
                this.errorUploadImg = true;
              }
            } else {
              this.errorUploadImg = true;
            }
            console.error('Error: ', error);
          });
        }

      });
    } else {
      this.validateAllFormFields(this.formCampaign);
      this.validateAllFormFields(this.formCampaign.get('campaignsCommunities'));
      if (this.photosUploaded.length < 3) {
        this.errorUploadImg = true;
      }
      this.scrollToError();
    }
  }

  createRequest() {
    const photosIds = {
      stickerPhoto: {id: this.photosUploadedId[0].photoId},
      winPhoto: {id: this.photosUploadedId[1].photoId},
      losePhoto: {id: this.photosUploadedId[2].photoId}
    };

    const copyRequest = {
      title: this.formCampaign.value.title,
      winnerText: this.formCampaign.value.winnerText,
      loserText: this.formCampaign.value.loserText,
      campaignsCommunities: this.formCampaign.value.campaignsCommunities
    };

    const request = Object.assign({}, copyRequest, photosIds);
    request.campaignsCommunities.map((item) => {

      if (item['startAt'].formatted) {
        item['startAt'] = moment(item['startAt'].formatted).format('YYYY-MM-DD');
      } else {
        item['startAt'] .date.month = item['startAt'] .date.month - 1;
        item['startAt']  = moment(item['startAt'] .date).format('YYYY-MM-DD');
      }

      if (item['untilAt'].formatted) {
        item['untilAt'] = moment(item['untilAt'].formatted).format('YYYY-MM-DD');
      } else {
        item['untilAt'] .date.month = item['untilAt'] .date.month - 1;
        item['untilAt']  = moment(item['untilAt'] .date).format('YYYY-MM-DD');
      }

    });
    this.disableBtn = false;
    this.photosUploadedId = [];
    this.publish.emit(request);
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  scrollToError() {
    const elements = document.getElementsByClassName('ng-invalid');
    if (this.errorUploadImg || this.errorMaxImg) {
      const element = document.getElementById('image-upload');
      element.scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else if (elements && elements[1]) {
      elements[1].scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }

  cancelCampaign() {
    this.router.navigate([`/${ROUTES.ROTALOCENTER}/${ROUTES.MENUROTALOCENTER.CAMPAIGN}`]);
  }

}
