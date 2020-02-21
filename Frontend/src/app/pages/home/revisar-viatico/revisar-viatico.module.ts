import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisarViaticoPageRoutingModule } from './revisar-viatico-routing.module';

import { RevisarViaticoPage } from './revisar-viatico.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisarViaticoPageRoutingModule
  ],
  declarations: [RevisarViaticoPage]
})
export class RevisarViaticoPageModule {}
