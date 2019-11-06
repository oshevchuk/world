import { NeuModule } from './neu/neu.module';
import { MainPageComponent } from './root-pages/main-page/main-page.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NeuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
