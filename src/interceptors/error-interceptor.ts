import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService, public alertCtrl: AlertController ){        
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log("Passou no interceptor");
        return next.handle(req)
        .catch((error, caught) => {
            
            let errorObj = error; // recebe o conteúdo do erro

            // se tiver o campo error no objeto (errorObj)
            if (errorObj.error) {
                errorObj = errorObj.error; // recebe somente o conteúdo do campo error
            }

            // verifica se não existe o campo status, caso existe ele não é um objeto JSON
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj); // faz o parse do objeto para o JSON
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            switch(errorObj.status) {
                case 401:
                this.handle401();
                break;

                case 403:
                this.handle403();
                break;

                //case 422:
                //this.handle422(errorObj);
                //break;

                default:
                this.handleDefaultEror(errorObj);
            }            

            return Observable.throw(errorObj); // propaga o erro para o controlador que fez a requisição

        }) as any;
    }

    handle403(){
        this.storage.setLocalUser(null); // inválida o localUser setando para nulo
    }

    handle401(){
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false, //para sair do alert tenho que apertar no botão e não fora
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        
        alert.present();
    }

    handleDefaultEror(errorObj){
        let alert = this.alertCtrl.create({
            title: 'Erro '+ errorObj.status + ': '+ errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false, //para sair do alert tenho que apertar no botão e não fora
            buttons: [
                {
                    text: 'OK'
                }
            ]
        });
        
        alert.present();
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};