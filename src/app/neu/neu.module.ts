import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from './components/empty.component';
import { NgModule } from '@angular/core';

const neuRouts: Routes = [
  {
    path: 'empty', component: EmptyComponent
  }
];

@NgModule({
  declarations: [
    EmptyComponent
  ],
  imports: [
    RouterModule.forRoot(neuRouts)
  ],
  exports: [
    RouterModule,
    EmptyComponent
  ]
})
export class NeuModule { }
