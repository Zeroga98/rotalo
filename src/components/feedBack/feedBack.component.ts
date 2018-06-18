import { OnInit, Component } from "@angular/core";
import { ModalFeedBackService } from "../modal-feedBack/modal-feedBack.service";

@Component({
  selector: "feed-back",
  templateUrl: "./feedBack.component.html",
  styleUrls: ["./feedBack.component.scss"]
})
export class FeedBackComponent implements OnInit {
  constructor(private modalService: ModalFeedBackService) {}

  ngOnInit() {}

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }
}
