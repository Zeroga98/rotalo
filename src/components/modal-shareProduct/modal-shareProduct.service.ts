import { Injectable } from "@angular/core";

@Injectable()
export class ModalShareProductService {
  private modals: any[] = [];
  private productId;


  constructor() { }

  setProductId(productId) {
    this.productId = productId;
  }

  getProductId() {
    return this.productId;
  }

  add(modal: any) {
    this.modals.push(modal);
  }

  remove(id: string) {
    this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.open();
  }

  close(id: string) {
    const modal: any = this.modals.filter(x => x.id === id)[0];
    modal.close();
  }
}
