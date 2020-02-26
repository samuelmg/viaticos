import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController, ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-viatico-informacion',
  templateUrl: './viatico-informacion.page.html',
  styleUrls: ['./viatico-informacion.page.scss'],
})
export class ViaticoInformacionPage implements OnInit {
  idComision;
  tieneDatos = false;
  viatico = null;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    public toastController: ToastController,
    private modalController: ModalController,
    private router: Router,
    private http: HttpClient,
    private navParams: NavParams,
  ) { }

  async ionViewWillEnter() {
    this.idComision = this.navParams.get('id_comision');
    try {
      const resp = await this.auth.getSolicitudViatico(this.idComision).toPromise();
      // tslint:disable-next-line: no-string-literal
      if (resp['ok']) {
        this.tieneDatos = true;
        // tslint:disable-next-line: no-string-literal
        this.viatico = resp['body'];
      }
      console.log('respuesta', resp);
    } catch (error) {
      console.error(error);
    }
  }

  ngOnInit() {
  }

  cerrarModal() {
    this.modalController.dismiss();
  }

}
