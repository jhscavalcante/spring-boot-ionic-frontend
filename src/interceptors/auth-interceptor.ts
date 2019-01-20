import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { StorageService } from '../services/storage.service';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService){
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //console.log("Passou no interceptor");        
        let localUser = this.storage.getLocalUser();

        let N = API_CONFIG.baseUrl.length;
        let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseUrl;

        // if existe Token no LocalStorage E a requisição é para a API do sistema
        if(localUser && requestToAPI){

            // clona a requisição original acrescentando o Header Authorization
            const authReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)})

            // chama o método com a requisição clonada
            return next.handle(authReq);

        }
        else{
            // propaga a requisição original sem passar cabeçalho nenhum
            return next.handle(req);
        }               
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};