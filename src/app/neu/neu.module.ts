import { CommonModule } from '@angular/common';
import { NodeViewComponent } from './components/node-view/node-view.component';
import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from './components/empty/empty.component';
import { NgModule } from '@angular/core';

const neuRouts: Routes = [
  {
    path: 'empty', component: EmptyComponent
  }
];

@NgModule({
  declarations: [
    EmptyComponent,
    NodeViewComponent
  ],
  imports: [
    RouterModule.forRoot(neuRouts),
    CommonModule
  ],
  exports: [
    RouterModule,
    EmptyComponent
  ]
})
export class NeuModule { }
