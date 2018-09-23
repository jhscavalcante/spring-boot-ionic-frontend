import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Passou no interceptor");
        return next.handle(req)
        .catch((error, caught) => {
            
            let errorObj = error; // ecebe o conteúdo do erro

            // se tiver o campo error no objeto (errorObj)
            if (errorObj.error) {
                errorObj = errorObj.error; // recebe somente p conteúdo do campo error
            }

            // verifica se não existe o campo status, caso existe ele não é um objeto JSON
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj); // faz o parse do objeto para o JSON
            }

            console.log("Erro detectado pelo interceptor:");
            console.log(errorObj);

            /*
            switch(errorObj.status) {
                case 401:
                this.handle401();
                break;

                case 403:
                this.handle403();
                break;

                case 422:
                this.handle422(errorObj);
                break;

                default:
                this.handleDefaultEror(errorObj);
            }
            */

            return Observable.throw(errorObj);

        }) as any;
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};