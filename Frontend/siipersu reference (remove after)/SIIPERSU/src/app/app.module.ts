import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginPageModule} from './pages/login/login.module';
import {ForgotPasswordPageModule} from './pages/forgot-password/forgot-password.module';
import {ComponentsModule} from './components/components.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RequestService} from './interceptors/request.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    ForgotPasswordPageModule,
    LoginPageModule,
    ComponentsModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: HTTP_INTERCEPTORS, useClass: RequestService, multi: true},
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
