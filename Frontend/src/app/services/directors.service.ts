import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface Director {
    id?: number;
    name: string;
    age?: number;
    active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class DirectorsService {
    private base = `${environment.apiBase}/directors`;
    constructor(private http: HttpClient) { }
    list(): Observable<Director[]> { return this.http.get<Director[]>(this.base); }
    get(id: number): Observable<Director> { return this.http.get<Director>(`${this.base}/${id}`); }
    create(payload: Director) { return this.http.post(this.base, payload); }
    update(id: number, payload: Director) { return this.http.put(`${this.base}/${id}`, payload); }
    delete(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
