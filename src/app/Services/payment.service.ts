import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private _httpClient:HttpClient) { }
  createOrUpdatePaymentIntent(WalletId:number,Balance:number):Observable<any>{
    return this._httpClient.post(`https://localhost:7156/api/Payment?WalletId=${WalletId}&Balance=${Balance}`,null);
  }
  updateBalance(WalletId:number,Balance:number,PaymentType:string){
    return this._httpClient.put(`https://localhost:7156/api/Wallet?WalletId=${WalletId}&Balance=${Balance}&PaymentType=${PaymentType}`,null);
  }
}
