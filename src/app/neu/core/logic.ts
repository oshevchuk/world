import { Observable, of, Subject, BehaviorSubject, interval, merge, concat, forkJoin } from 'rxjs';
import { debounceTime, mapTo, distinctUntilChanged, delay, throttleTime, buffer, mergeAll, combineAll,
  combineLatest } from 'rxjs/operators';

class NodeValue {
  constructor(public id: number, public value: number) {}
}

class Node {
  value = 0;
  onValueChanged = new BehaviorSubject(null);
  prevSubs = [];

  current: Node;
  public outNodes: Node[] = [];

  inputSignals: number[] = [];
  outputSignal: number;

  private prevNodes: Node[] = [];
  get PrevNodes(): Node[] {
    return this.prevNodes;
  }
  set PrevNodes(nodes: Node[]) {
    this.prevNodes = nodes;

    const s = [];

    this.prevNodes.map(prevNode => {
      prevNode.outNodes.push(this);

      s.push(prevNode.onValueChanged.asObservable());
      // console.log(prevNode.onValueChanged.getValue(), '::');
      // prevNode.onValueChanged.asObservable()
      //   .pipe(debounceTime(20), distinctUntilChanged())
      //   .subscribe(res => this.subsciber(res as NodeValue));
    });

    // forkJoin(s).subscribe(res => this.subs(res));
    // console.log(s, '~');
    merge(s).pipe(mergeAll()).subscribe(res => this.subs(res));
  }

  subs(val: any) {
    if (val) {
      console.log(val, '::::', this.id);
      this.calculate();
    }
  }

  subsciber(val: NodeValue) {
    if (val) {
      const v = this.prevNodes.find(el => el.id === val.id)
      console.log(val, ' => ', this.id, '>>>>', v.value);
      this.calculate();
    }
  }

  constructor(public id: number, public text?: string) {

  }

  calculate() {
    // this.value++;
    this.prevNodes.map(node => {
      this.value += node.value + 1;
    });
    this.onValueChanged.next(new NodeValue(this.id, this.value));
  }
}

class InputNode extends Node { }
class HiddenNode extends Node { }
class OutputNode extends Node { }

class Builder {
  uid = 0;

  constructor() {
    const a1 = new InputNode(1, 'input');

    const c1 = new HiddenNode(10, 'hidden');
    const c2 = new HiddenNode(11, 'hidden');

    const b1 = new OutputNode(100, 'output');


    b1.PrevNodes = b1.PrevNodes.concat(c1, c2);

    c1.PrevNodes = c1.PrevNodes.concat(a1);
    c2.PrevNodes = c2.PrevNodes.concat(a1);
    console.log(b1);
    console.log(c1);
    console.log(a1);
    console.log('==============');

    a1.calculate();
  }
}



  // emmitCalculation() {
  //   this.outputSignal = this.inputSignals[0];
  //   if (this.outNodes) {
  //     console.log(this.id, '<= Calculate!');

  //     this.outNodes.map(node => {
  //       node.emmitCalculation();
  //     });
  //   } else {
  //     console.log(this.id, ' no outNode');
  //   }
  // }