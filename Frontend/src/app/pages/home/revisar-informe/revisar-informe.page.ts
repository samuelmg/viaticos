import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { formatDate } from '@angular/common';
import { InformeActivoPage } from '../components/informe-activo/informe-activo.page';

@Component({
  selector: 'app-revisar-informe',
  templateUrl: './revisar-informe.page.html',
  styleUrls: ['./revisar-informe.page.scss', '../../../app.component.scss'],
})
export class RevisarInformePage implements OnInit {

  informes = '';
  comentario_rechazo = '';
  userType = '';
  constructor(
      private auth: AuthService,
      public toastController: ToastController,
      private modalController: ModalController,
      public alertController: AlertController
  ) { }

  ngOnInit() {
    this.getRevisarInforme();
  }

  async getRevisarInforme() {
    const resp = await this.auth.getRevisarInforme();
    console.log(resp);
    if (resp) {
      resp.forEach(element => {
        element.fecha_elaboracion = formatDate(element.fecha_elaboracion, 'yyyy-MM-dd', 'en');
      });
      this.informes = resp;
    } else {
      this.informes = null;
    }
  }

  async openModal(folio) {
    const modal: HTMLIonModalElement =
        await this.modalController.create({
          component: InformeActivoPage,
          cssClass: 'modal-class',
          componentProps: {
            folio: folio,
          }
        });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
      }
    });

    await modal.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Datos no validos.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentToastSuccess() {
    const toast = await this.toastController.create({
      message: 'Datos Modificados.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentToastPDF() {
    const toast = await this.toastController.create({
      message: 'Generando Informe PDF',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async alertConfirm(informe) {
    const alert = await this.alertController.create({
      header: 'Aceptar Informe',
      message: '¿Desea aceptar este informe?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            if (this.auth.userType === 'A') {
              informe.status = 6;
              this.generarPDF(informe.id);
            }
            if (this.auth.userType === 'F') {
              informe.status = 3;
            }
            informe.comentario_rechazo = '';
            this.revisarInforme(informe);
          }
        },
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }
      ]
    });
    await alert.present();
    alert.onDidDismiss().then(() => this.getRevisarInforme());
  }

  async alertDecline(informe) {
    const alert = await this.alertController.create({
      header: 'Rechazar Comision!',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: 'Inserte su justificación...'
        }
      ],
      buttons: [
        {
          text: 'Rechazar',
          handler: data => {
            if (this.auth.userType === 'A') {
              informe.status = 4;
            }
            if (this.auth.userType === 'F') {
              informe.status = 2;
            }
            informe.comentario_rechazo = data.name1;
            this.revisarInforme(informe);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });

    await alert.present();
    alert.onDidDismiss().then(() => this.getRevisarInforme());
  }

  async revisarInforme(comision) {
    const resp1 = await this.auth.revisarInforme(comision);
    if (resp1) {
      this.presentToastSuccess();
    } else {
      // this.presentToast();
    }
  }

  async generarPDF(id_informe: Number) {
    try {
      const resp = await this.auth.downloadInforme(id_informe);
      // tslint:disable-next-line
      if (resp) {
        console.log(resp);
        const url= window.URL.createObjectURL(resp);
        window.open(url);
        this.presentToastPDF();
        // tslint:disable-next-line
      }
      const resp2 = await this.auth.downloadInformeLegacy(id_informe);
      // tslint:disable-next-line
      if (resp2) {
        console.log(resp2);
        const url= window.URL.createObjectURL(resp2);
        window.open(url);
        this.presentToastPDF();
        // tslint:disable-next-line
      }
    } catch (error) {
      console.error(error);
    }
    
  }
}
