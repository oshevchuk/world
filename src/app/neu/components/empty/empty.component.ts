import { Component, OnInit } from '@angular/core';
import * as MathJs from 'mathjs';
// import * as Rx from 'rxjs';
import { Observable, of, Subject, BehaviorSubject, interval, merge, concat, forkJoin, zip } from 'rxjs';
import { debounceTime, mapTo, distinctUntilChanged, delay, throttleTime, buffer, mergeAll, combineAll, map, flatMap,
  combineLatest } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';

export class Node {
  bias = 0.001;
  value = 0;
  inputs: number[] = [];
  isBusy = false;
  lr = 0.5; // learning rate;

  weights: number[] = [];

  private prevNodes: Node[] = [];
  get PrevNodes(): Node[] {
    return this.prevNodes;
  }
  set PrevNodes(nodes: Node[]) {
    this.prevNodes = nodes;
    this.prevNodeIds = [];
    this.prevNodes.map(prevNode => {
      prevNode.outNodes.push(this);
      this.prevNodeIds.push(prevNode.id);
    });
    this.updateInputs();
    this.initWeights();
  }
  prevNodeIds: number[] = [];
  outNodes: Node[] = [];

  constructor(public id: number) {}

  calculation() {
    this.updateInputs();
    if (this.inputs && this.inputs.length > 0) {
      let s = 0;
      this.inputs.map((el, index) => {
        s += el * this.weights[index];
      });
      this.value = s;
    }

    this.isBusy = true;

    const ss = of(true).pipe(delay(800));
    ss.toPromise().then(r => {
      this.isBusy = false;
    });
    return ss.toPromise();
  }

  protected updateInputs() {
    this.inputs = [];
    this.prevNodes.map(prevNode => {
      this.inputs.push(prevNode.value);
    });
  }
  private initWeights() {
    this.weights = [];
    this.prevNodes.map(prev => {
      this.weights.push(Math.random());
    });
  }

  getName() {
    return (this).constructor.name;
  }
  activation() {}
}
class InputNode extends Node { }
class HiddenNode extends Node { }

class OutputNode extends Node {
  activation() {
    return 1 / (1 + Math.exp(-1 * this.value));
  }
}

@Component({
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {
  uid = 0;
  lifeCycleCount = 0;

  inputNode = new InputNode(1);
  hiddenLayer: Node[] = [];
  outputNode = new OutputNode(100);

  isLoading = true;

  inputValue = 0;
  expectValue = 1;
  currentError = 0;

  constructor() { }

  ngOnInit(): void {
    this.initNetwork();

    // this.test();
  }

  test() {
    this.inputNode.value = this.inputValue;

    this.lifeCycleCount++;
    this.startInputs().then(() => {
      this.startHindden().then(() => {
        this.startOutput().then(() => {
          // const r = ;
          this.currentError = this.outputNode.activation() / this.expectValue;
        });
      });
    });
  }

  startInputs() {
    return this.inputNode.calculation();
  }
  startHindden() {
    const subs = [];
    this.hiddenLayer.map(h => {
      subs.push(h.calculation());
    });
    return concat(subs).toPromise();
  }
  startOutput() {
    return this.outputNode.calculation();
  }

  private initNetwork() {
    this.inputNode.value = 1;

    this.hiddenLayer = [];
    for (let i = 0; i < 2; i++) {
      this.hiddenLayer.push(new HiddenNode(10 + i));
    }

    this.outputNode.PrevNodes = this.outputNode.PrevNodes.concat(this.hiddenLayer);
    //
    this.hiddenLayer.map(layer => {
      layer.PrevNodes = layer.PrevNodes.concat(this.inputNode);
    });

    console.log(this.outputNode);
    this.isLoading = false;
  }


}
