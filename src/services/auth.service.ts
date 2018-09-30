import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService{

    constructor(public http: HttpClient, public storage: StorageService){        
    }

    authenticate(creds: CredenciaisDTO){
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            creds,
            {
                observe: 'response', // vai retornar um objeto do tipo response (desta forma consigo acessar o header)
                responseType: 'text' // do tipo text pq o body retorna vazio, desta forma não tenta fazer o casting para JSON, ou seja impede o erro de parse 
            });
    }

    // Recebe o Beader Token do cabeçalho da resposta
    successfulLogin(authorizationValue : string){
        let tok = authorizationValue.substring(7); // recorta a string a partir do 7° caractere
        let user: LocalUser = {
            token: tok
        };

        this.storage.setLocalUser(user);
    }

    logout(){
        this.storage.setLocalUser(null);
    }
}