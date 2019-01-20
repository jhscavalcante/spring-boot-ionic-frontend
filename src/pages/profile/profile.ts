import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
      public navCtrl: NavController, 
      public navParams: NavParams,
      public storage: StorageService,
      public clienteService: ClienteService) {
  }

  // executar alguma coisa quando a página for carregada
  ionViewDidLoad() {
      let localUser = this.storage.getLocalUser();

      if(localUser && localUser.email){
          this.clienteService.findByEmail(localUser.email)
            .subscribe(response => {
                this.cliente = response;
                this.getImageIfExists(); // buscar imagem lá do bucket S3
            }, 
            error => {
                if ( error.status == 403){
                    this.navCtrl.setRoot('HomePage');
                }
            });
      }else{
          // redireciona também se houve erro na hora de pegar o localUser
          this.navCtrl.setRoot('HomePage');
      }
  }

  getImageIfExists(){
      this.clienteService.getImageFromBucket(this.cliente.id)
        .subscribe(response => {
            this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
        },
        error => {});
  }

}
