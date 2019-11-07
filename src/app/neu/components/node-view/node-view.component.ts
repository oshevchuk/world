import { Node } from './../empty/empty.component';
import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  templateUrl: './node-view.component.html',
  styleUrls: ['./node-view.component.scss'],
  selector: 'app-node-view'
})
export class NodeViewComponent implements OnInit, AfterViewInit {
  @Input() node: Node;
  @Input() showClassName = true;

  @ViewChild('block', {static: false}) block: ElementRef;

  constructor() {

  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    // console.log(this.block);
  }
}
