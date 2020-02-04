import { ViaticoPage } from './../viatico/viatico.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {ModalController, ToastController} from '@ionic/angular';
import {ProgramPage} from '../components/program/program.page';
import {OverlayEventDetail} from '@ionic/core';
import { ComisionActivaPage } from '../components/comision-activa/comision-activa.page';


@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss', '../../../app.component.scss'],
})
export class HistoryPage implements OnInit {

  comisiones = null;

  constructor(
    private router: Router,
    private auth: AuthService,
    public toastController: ToastController,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.getAllComisiones();
    console.log(this.comisiones);
  }

  async getAllComisiones() {
    const resp = await this.auth.getAllComisiones();
    if (resp) {
        this.comisiones = resp;
      } else {
        this.presentToast();
      }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Datos no validos.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  itemSelected(comision) {

  }

  async viaticos(id_comision: string) {
    const resp = await this.auth.getComision(id_comision);
    if (resp) {
      console.log(resp);

    } else {
      this.presentToast();
    }
  }
  async openModal(id_comision) {
    const modal: HTMLIonModalElement =
        await this.modalController.create({
          component: ComisionActivaPage,
          componentProps: {
            id_comision: id_comision,
          }
        });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
      }
    });

    await modal.present();
  }
}