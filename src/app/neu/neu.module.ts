import { BlockBrainComponent } from './components/block-brain/block-brain.component';
import { MultiInputsComponent } from './components/multi-inputs/multi-inputs.component';
import { CommonModule } from '@angular/common';
import { NodeViewComponent } from './components/node-view/node-view.component';
import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from './components/empty/empty.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

const neuRouts: Routes = [
  {
    path: 'empty', component: EmptyComponent
  },
  {
    path: 'multi', component: MultiInputsComponent
  },
  {
    path: 'block', component: BlockBrainComponent
  }
];

@NgModule({
  declarations: [
    EmptyComponent,
    NodeViewComponent,
    MultiInputsComponent,
    BlockBrainComponent
  ],
  imports: [
    RouterModule.forRoot(neuRouts),
    CommonModule,
    FormsModule
  ],
  exports: [
    RouterModule,
    EmptyComponent
  ]
})
export class NeuModule { }
