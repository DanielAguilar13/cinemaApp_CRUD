import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface Director { id: number; name: string; age?: number; active?: boolean; }

export interface Movie {
    id?: number;
    name: string;
    gender?: string;
    duration?: string;
    fkDirector: number;
    director?: Director;
}

@Injectable({ providedIn: 'root' })
export class MoviesService {
    private base = `${environment.apiBase}/movies`;
    constructor(private http: HttpClient) { }
    list(): Observable<Movie[]> { return this.http.get<Movie[]>(this.base); }
    get(id: number): Observable<Movie> { return this.http.get<Movie>(`${this.base}/${id}`); }
    create(payload: Movie) { return this.http.post(this.base, payload); }
    update(id: number, payload: Movie) { return this.http.put(`${this.base}/${id}`, payload); }
    delete(id: number) { return this.http.delete(`${this.base}/${id}`); }
}
