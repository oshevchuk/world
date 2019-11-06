import { Component, OnInit } from '@angular/core';

abstract class Animal {
  abstract makeSound();
}

class Lion extends Animal {
  makeSound() {
    console.log('roar');
  }
}

class Snake extends Animal {
  makeSound() {
    console.log('psssssssss');
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'testing';

  constructor() {}

  ngOnInit(): void {
    const t: Animal[] = [];
    t.push(new Lion());
    t.push(new Snake());

    t.map(el => el.makeSound());
  }
}
