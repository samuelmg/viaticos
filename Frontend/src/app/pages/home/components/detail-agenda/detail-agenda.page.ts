import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-detail-agenda',
  templateUrl: './detail-agenda.page.html',
  styleUrls: ['./detail-agenda.page.scss'],
})
export class DetailAgendaPage implements OnInit {

  modificable = true;
  idInforme;
  agendas:
  [
    {
      dia: string,
      hora_inicio: string,
      hora_fin: string,
      actividad: string,
    }
  ];

  constructor(
      private modalController: ModalController,
      private auth: AuthService,
      private navParams: NavParams,
      private toastController: ToastController
  ) { this.ionViewWillEnter(); }

  ionViewWillEnter() {
    this.idInforme = this.navParams.get('id_informe');
    this.getAgenda(this.idInforme);
    this.modificable = this.navParams.get('modificable');
  }

  async getAgenda(idInforme) {
    try {
      const resp = await this.auth.getAgenda(idInforme);
      if (resp['ok']) {
        this.agendas = resp['body'];
        console.log(this.agendas);
      }
      console.log('respuesta', resp);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit() {
  }

  async modifyAgenda(agenda){
    console.log(agenda);
    const resp = await this.auth.modifyAgenda(agenda);
    if (resp) {
      this.presentToast(resp['mensaje']);
    } else {
      this.presentToast(resp['mensaje']);
    }
    this.getAgenda(this.idInforme);
  }

  async deleteAgenda(agenda){
    const resp = await this.auth.deleteAgenda(agenda);
    if (resp) {
      this.presentToast(resp);
    } else {
      this.presentToast(resp);
    }
    this.getAgenda(this.idInforme);
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  async presentToastSuccess() {
    const toast = await this.toastController.create({
      message: 'Agenda Modificada.',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }

}
