import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RetirementService {
  constructor(private http: HttpClient) {}
  getRetirementData(): Observable<any[]> {
    return this.http.get<any[]>('assets/mockdata.json').pipe(
      tap(data => console.log('Fetched Data:', data))
    );
  }
  
}
