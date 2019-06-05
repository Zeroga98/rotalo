import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { PhotosService } from '../../../services/photos.service';
import { UtilsService } from '../../../util/utils.service';
import { TypeDocumentsService } from '../../../services/type-documents.service';
import { CurrentSessionService } from '../../../services/current-session.service';
import { IMAGE_LOAD_STYLES } from '../../../components/form-product/image-load.constant';


function validateNameUser (
  name: AbstractControl
): { [key: string]: boolean } | null {
  const nameValue = name.value;
  if (nameValue) {
    const arrayName = nameValue.split(' ').filter(function(v) {return v !== ''; } );
    if (arrayName.length == 1) {
      return { nameError: true };
    }
  }
  return null;
}

@Component({
  selector: 'edit-profile',
  templateUrl: 'edit-profile.page.html',
  styleUrls: ['edit-profile.page.scss']
})
export class EditProfilePage implements OnInit {
  public editProfileForm: FormGroup;
  public selectIsCompleted = false;
  public location: Object = {};
  public country: Object = {};
  public state: Object = {};
  public city: Object = {};
  public userEdit: any;
  public countryValue = {};
  public stateValue;
  public cityValue;
  public errorChange: String;
  public messageChange: String;
  public photosUploaded: Array<any> = [];
  public idImagenProfile: String;
  public nameDocument: String;
  private typeDocuments;
  public typeDocument: String;
  public loadImage = false;
  public showSpinner = true;
  public showPhotoEdit = false;
  public photo;
  public customStyleImageLoader = IMAGE_LOAD_STYLES;
  public countryId;

  constructor(
    private photosService: PhotosService,
    private fb: FormBuilder,
    private userService: UserService,
    private utilsService: UtilsService,
    private typeDocumentsService: TypeDocumentsService,
    private currentSessionSevice: CurrentSessionService
  ) {}

  ngOnInit(): void {
    const currentUser = this.currentSessionSevice.currentUser();
    this.countryId = Number(currentUser['countryId']);
    this.editProfileForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50), validateNameUser]],
      idNumber: [{ value: '', disabled: true }, Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      cellphone: ['', [Validators.required]]
    });
    this.getInfoUser();
  }

  async getInfoUser() {
    this.userEdit = await this.userService.getInfoUser();
    this.photo = this.userEdit.photo;
    this.photoExist(this.photo);
    const currentUrl  = window.location.href;
    if (currentUrl.includes('gt')) {
      this.loadTypeDocuments(9);
    } else {
      this.loadTypeDocuments(1);
    }
    this.onInfoRetrieved(this.userEdit);
  }

  setValidationId() {
    if (this.country) {
      const idCountry  = this.country['name'];
      this.editProfileForm.get('cellphone').clearValidators();
      if (idCountry == 'Guatemala') {
        this.editProfileForm.get('cellphone').setValidators([Validators.required,
          Validators.pattern(/^\d{8}$/)
        ]);
      } else  {
        this.editProfileForm.get('cellphone').setValidators([Validators.required]);
      }

      this.editProfileForm.get('cellphone').updateValueAndValidity();

    }
  }

  photoExist(photo) {
    if (photo) {
      this.showPhotoEdit = true;
    } else {
      this.showPhotoEdit = false;
    }
  }

  async onRemoveImage(event) {
    try {
      const photo = this.findPhoto(event.file);
      const response = await this.photosService.deletePhoto(photo.photoId);
      this.removePhoto(photo.photoId);
      this.idImagenProfile = undefined;
     /* this.userService.emitChangePhoto(undefined);*/
      this.messageChange = '';
      this.errorChange = '';
    } catch (error) {
      console.error('error: ', error);
    }
  }

  get isFormValid(): boolean {
    return this.city['id'] && this.editProfileForm.valid;
  }

  async removeImageFromServer(id: number) {
    try {
      const response = await this.photosService.deletePhoto(id);
      this.removePhoto(id);
    } catch (error) {
      console.error('error: ', error);
    }
  }


  onUploadImageFinished(event) {
    this.loadImage = true;
    this.messageChange = '';
    this.errorChange = '';
    this.photosService.uploadPhoto(event.file).subscribe(
      (response) => {
        this.idImagenProfile = response.photoId;
        this.photo = response;
        const photo = Object.assign({}, response, { file: event.file });
        this.photosUploaded.push(photo);
        this.loadImage = false;
      },
      (error) => {
        this.loadImage = false;
        console.error('Error: ', error);
      }
    );
  }

  private findPhoto(file: File) {
    return this.photosUploaded.find(photo => {
      return photo.file === file;
    });
  }

  private removePhoto(id: number) {
    this.photosUploaded = this.photosUploaded.filter(photo => photo.photoId !== id);
  }

  onInfoRetrieved(user): void {
    if (this.editProfileForm) {
      this.editProfileForm.reset();
    }
    this.editProfileForm.patchValue({
      name: user.name,
      idNumber: user['id-number'],
      email: user.email.toLowerCase(),
      cellphone: user.cellphone
    });

    this.countryValue = user.city.state.country;
    this.stateValue = user.city.state;
    this.cityValue = user.city;
  }

  editUser(): void {
    let currentUser;
    const idUser = this.currentSessionSevice.currentUser().id;
    if (this.idImagenProfile) {
      currentUser = Object.assign({}, this.editProfileForm.value, { 'city-id': this.city['id'] }, { 'photo-id': this.idImagenProfile });
    } else {
      currentUser = Object.assign({}, this.editProfileForm.value, {
        'city-id': this.city['id']
      });
    }

    currentUser = Object.assign({}, currentUser, {
      'user-id-to-update': idUser
    });

    this.userService
      .updateUser(currentUser)
      .then(response => {
        const updateCountry = this.currentSessionSevice.currentUser();
        updateCountry['countryId'] = this.country['id'];
        this.currentSessionSevice.setSession(updateCountry);
        this.userService.updateInfoUser();
        this.countryValue = this.country;
        this.stateValue = Object.assign({}, this.state, {'country': this.countryValue } );
        this.cityValue = Object.assign({},  this.city, {'state': this.stateValue } );
        this.messageChange = 'Su cuenta se ha actualizado.';
        this.errorChange = '';
        this.userService.emitChangePhoto(this.photo);
      })
      .catch(httpErrorResponse => {
        this.messageChange = '';
        if (httpErrorResponse.status === 403) {
        }
        if (httpErrorResponse.status === 422) {
          this.errorChange = httpErrorResponse.error.errors[0].title;
        }
        if (httpErrorResponse.status === 0) {
          this.errorChange =
            '¡No hemos podido conectarnos! Por favor intenta de nuevo.';
        }
      });
  }

  loadTypeDocuments(idCountry) {
    const countryDocument = {
      'pais': idCountry
    };
    this.typeDocumentsService.getTypeDocument(countryDocument).subscribe((response) => {
      if (response.status == 0) {
        this.typeDocuments = response.body.documentType;
        if (this.userEdit && this.userEdit['type-document-id']) {
          const document = this.typeDocuments.filter(value => {
            return value.id == this.userEdit['type-document-id'].toString();
          });
          this.typeDocument = document[0]['nameDocument'];
        }
        this.showSpinner = false;
      }
    }, (error) => {
      console.log(error);
    });
  }

  onSubmit() {
    if (this.city['id'] && !this.editProfileForm.invalid) {
      this.editUser();
      this.utilsService.goToTopWindow(20, 600);
    }
  }
}
