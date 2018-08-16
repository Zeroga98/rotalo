import { Component, ElementRef, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalFeedBackService } from './modal-feedBack.service';
import { Validators, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'modal-feedBack',
  templateUrl: './modal-feedBack.component.html',
  styleUrls: ['./modal-feedBack.component.scss']
})
export class ModalFeedBackComponent implements OnInit, OnDestroy {
  @Input() id: string;

  private element: any;
  public feedBackForm: FormGroup;
  public messageSuccess: boolean;

  constructor(private modalService: ModalFeedBackService, private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    const modal = this;

    if (!this.id) {
      console.error('modal must have an id');
      return;
    }
    document.body.appendChild(this.element);
    /*this.element.addEventListener('click', function(e: any) {
      if (e.target.className === 'modal') {
        modal.close();
      }
    });*/
    this.modalService.add(this);
    this.feedBackForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      comment: new FormControl('', [Validators.required])
    });

  }

  ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element = undefined;
    //this.element.remove();
  }

  onSubmit() {
    if (this.feedBackForm.valid) {
      const email = this.feedBackForm.get('email').value;
      const comment = this.feedBackForm.get('comment').value;
      const params = {
        "correo": email,
        "mensaje": comment
      };
      this.modalService.sendEmail(params) .subscribe(
        state => {
          this.messageSuccess = true;
          this.feedBackForm.reset();
        },
        error => console.log(error)
      );
    }else {
      this.validateAllFormFields(this.feedBackForm);
    }
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

  open(): void {
   // this.element.style.display = 'block';
   this.messageSuccess = false;
   this.feedBackForm.reset();
    this.element.classList.add('md-show');
    document.body.classList.add('modal-open');
  }

  close(): void {
   //this.element.style.display = 'none';
    this.feedBackForm.reset();
    this.element.classList.remove('md-show');
    document.body.classList.remove('modal-open');
  }






}
