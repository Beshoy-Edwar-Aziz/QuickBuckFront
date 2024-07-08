import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  BaseURL:string= "https://mlv0108p-7156.uks1.devtunnels.ms";

  constructor(private _httpClient:HttpClient) { }
  createOrUpdatePaymentIntent(WalletId:number,Balance:number):Observable<any>{
    return this._httpClient.post(`${this.BaseURL}/api/Payment?WalletId=${WalletId}&Balance=${Balance}`,null);
  }
  updateBalance(WalletId:number,Balance:number,PaymentType:string){
    return this._httpClient.put(`${this.BaseURL}/api/Wallet?WalletId=${WalletId}&Balance=${Balance}&PaymentType=${PaymentType}`,null);
  }
}
