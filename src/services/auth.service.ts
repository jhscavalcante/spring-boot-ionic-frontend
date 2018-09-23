import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService{

    constructor(public http: HttpClient){        
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
}