import { Component, OnInit } from '@angular/core';
import * as MathJs from 'mathjs';
// import * as Rx from 'rxjs';
import { Observable, of, Subject, BehaviorSubject, interval, merge, concat, forkJoin, zip } from 'rxjs';
import { debounceTime, mapTo, distinctUntilChanged, delay, throttleTime, buffer, mergeAll, combineAll, map, flatMap,
  combineLatest } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';

export class Node {
  delayRate = 700;

  value = 0;
  inputs: number[] = [];
  isBusy = false;
  learningRate = 0.3;

  private errorRate = 0;
  set ErrorRate(value: number) {
    this.errorRate = value;
    this.weights.forEach((w, i) => {
      this.weights[i] += this.errorRate * this.learningRate * this.inputs[i];
    });
    const prevCount = this.inputs.length && this.inputs.length > 0 ? this.inputs.length : 1;
    this.PrevNodes.map(pn => {
      pn.ErrorRate = value / prevCount;
    });
    // console.log(this.weights, '::', value, '==', this.inputs);
  }
  get ErrorRate() {
    return this.errorRate;
  }

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

    const ss = of(true).pipe(delay(this.delayRate));
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
class InputNode extends Node {
  delayRate = 500;
}
class HiddenNode extends Node { }

class OutputNode extends Node {
  activation() {
    return 1 / (1 + Math.exp(-1 * this.value));
  }
}
// --------------------------------------------------------------------
@Component({
  templateUrl: './empty.component.html',
  styleUrls: ['./empty.component.scss']
})
export class EmptyComponent implements OnInit {
  isLearningMode = true;
  uid = 0;
  lifeCycleCount = 0;

  inputNode = new InputNode(1);
  inputNodes: InputNode[] = [];
  hiddenLayer: Node[] = [];
  outputNode = new OutputNode(100);

  isLoading = true;

  inputValue = 0;
  expectValue = 1;
  currentError = 0;

  constructor() { }

  ngOnInit(): void {
    this.initNetwork();
  }

  test() {
    this.inputNode.value = this.inputValue;

    this.lifeCycleCount++;
    this.startInputs().then(() => {
      this.startHindden().then(() => {
        this.startOutput().then(() => {
          // this.currentError = this.expectValue - this.outputNode.activation();
          this.currentError = this.expectValue - this.outputNode.value;
          if (this.isLearningMode) {
            this.outputNode.ErrorRate = this.currentError;
          }
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
    for (let i = 0; i < 4; i++) {
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
