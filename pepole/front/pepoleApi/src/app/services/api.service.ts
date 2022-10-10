import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Luoghi } from '../model/Luoghi';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  constructor(private http : HttpClient) { }

  private API_URL= environment.API_URL;

  postPerson(data : any){
    return this.http.post<any>(this.API_URL+'/pepoleList/',data)
  }

  getPerson(){
    return this.http.get<any>(this.API_URL+'/pepoleList/')
  }

  putPerson(data : any, id : number){
    return this.http.put<any>(this.API_URL+'/pepoleList/'+id, data)
  }

  deletePerson(id : number){
    return this.http.delete<any>(this.API_URL+'/pepoleList/'+id)
  }

  getLuoghiNascita(src : string):Observable<Luoghi[]>{
    return this.http.get<Luoghi[]>(this.API_URL+'/luoghiNascita?src='+src)
  }
}
