import { Component, OnInit } from '@angular/core';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { IMAGE_STYLES } from './image.constant';


@Component({
  selector: 'drag-and-drop-img',
  templateUrl: './drag-and-drop-img.component.html',
  styleUrls: ['./drag-and-drop-img.component.scss']
})
export class DragAndDropImgComponent implements OnInit {
  customStyleImageLoader = IMAGE_STYLES;
  constructor() { }
  imagesPositions = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6'
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.imagesPositions, event.previousIndex, event.currentIndex);
  }

  ngOnInit() {
  }

  onUploadImageFinished(event) {
   console.log(event);
  }

  onRemoveImage(event) {
    console.log(event);
  }

}
