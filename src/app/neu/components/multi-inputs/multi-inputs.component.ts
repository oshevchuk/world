import { Component, OnInit } from '@angular/core';
import * as MathJs from 'mathjs';
import { Observable, of, Subject, BehaviorSubject, interval, merge, concat, forkJoin, zip, timer } from 'rxjs';
import { debounceTime, mapTo, distinctUntilChanged, delay, throttleTime, buffer, mergeAll, combineAll, map, flatMap, takeWhile, tap,
  combineLatest, timeInterval } from 'rxjs/operators';
import { FormBuilder, FormControl } from '@angular/forms';

export class Node {
  delayRate = 500;

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

  constructor(public id: number, delRate?: number) {
    if (delRate) {
      this.delayRate = delRate;
    }
  }

  calculation() {
    this.updateInputs();
    if (this.inputs && this.inputs.length > 0) {
      let s = 0;
      this.inputs.map((el, index) => {
        s += el * this.weights[index];
      });
      this.value = this.activation(s);
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
      this.weights.push(Math.random() * 2 - 1);
    });
  }

  getName() {
    return (this).constructor.name;
  }
  activation(v: number) {
    return v;
  }
}
class InputNode extends Node {
  delayRate = 300;
}
class HiddenNode extends Node { }

class OutputNode extends Node {
  activation(v: number) {
    return Math.abs(v);
  }
}
// --------------------------------------------------------------------
@Component({
  templateUrl: './multi-inputs.component.html',
  styleUrls: ['./multi-inputs.component.scss']
})
export class MultiInputsComponent implements OnInit {
  isLearningMode = true;
  uid = 0;
  lifeCycleCount = 0;

  // inputNode = new InputNode(1);
  inputNodes: InputNode[] = [];
  hiddenLayer: Node[] = [];
  outputNode: OutputNode;

  isLoading = true;

  inputValue1 = 1;
  inputValue2 = 1;
  expectValue = 1;
  currentError = 0;

  trainIterations = 2;

  delyTime = 5;

  constructor() { }

  ngOnInit(): void {
    this.initNetwork();
  }

  train() {
    this.isLearningMode = true;
    const data = [[0, 0], [0, 1], [0, 1], [1, 1]];
    const ans = [0, 1, 1, 0];

    let start = data.length;
    this.trainIterations *= data.length;

    const t = new Subject();
    t.pipe(delay(this.delyTime)).subscribe(_ => {
      start--;
      this.trainIterations--;

      if (this.trainIterations < 0) {
        this.isLearningMode = false;
        return;
      }
      if (start < 0) {
        start = data.length - 1;
      }
      this.inputValue1 = data[start][0];
      this.inputValue2 = data[start][1];
      this.expectValue = ans[start];

      this.test().then(res => {
        if (Math.abs(this.currentError) > 20) {
          alert('Too much error!');
          return;
        }
        t.next(true);
      });
    });

    t.next(true);
  }

  test(): Promise<any> {
    this.inputNodes[0].value = (this.inputValue1);
    this.inputNodes[1].value = (this.inputValue2);

    this.lifeCycleCount++;
    return this.startInputs().then(() => {
      return this.startHindden().then(() => {
        return this.startOutput().then(() => {
          this.currentError = this.expectValue - this.outputNode.value;
          if (this.isLearningMode) {
            this.outputNode.ErrorRate = this.currentError;
          }
          return of(true);
        });
      });
    });
  }

  startInputs() {
    const subs = [];
    this.inputNodes.map(i => {
      subs.push(i.calculation());
    });
    return concat(subs).toPromise();
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
    this.outputNode = new OutputNode(100, this.delyTime);

    for (let i = 0; i < 2; i++) {
      this.inputNodes.push(new InputNode(i + 1, this.delyTime));
    }

    this.hiddenLayer = [];
    for (let i = 0; i < 4; i++) {
      this.hiddenLayer.push(new HiddenNode(10 + i, this.delyTime));
    }

    this.outputNode.PrevNodes = this.outputNode.PrevNodes.concat(this.hiddenLayer);
    //
    this.hiddenLayer.map(layer => {
      layer.PrevNodes = layer.PrevNodes.concat(this.inputNodes);
    });

    console.log(this.outputNode);
    this.isLoading = false;
  }
}
