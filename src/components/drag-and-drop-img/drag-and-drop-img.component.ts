import { Component, OnInit } from '@angular/core';
import { moveItemInArray, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { IMAGE_STYLES } from './image.constant';
import * as Muuri from 'muuri';

@Component({
  selector: 'drag-and-drop-img',
  templateUrl: './drag-and-drop-img.component.html',
  styleUrls: ['./drag-and-drop-img.component.scss']
})
export class DragAndDropImgComponent implements OnInit {

  constructor() { }
  ngOnInit() {
    const grid = new Muuri('.grid', {
      dragEnabled: true
    });
  }

}
