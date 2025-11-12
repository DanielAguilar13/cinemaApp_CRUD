// src/app/movies/movie-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

type Director = { id: number; name: string; active: boolean; age?: number };
type Movie = { id?: number; name: string; gender?: string | null; duration?: string | null; directorId: number };

@Component({
    selector: 'app-movie-form',
    standalone: true,
    templateUrl: './movie-form.component.html',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatFormFieldModule, MatInputModule, MatSelectModule,
        MatButtonModule, MatIconModule, MatCardModule
    ]
})
export class MovieFormComponent implements OnInit {

    id?: number;

    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    directors: Director[] = [];

    form = this.fb.group({
        name: ['', Validators.required],
        gender: [''],
        duration: [''],         // luego la normalizamos a HH:mm(:ss)
        fkDirector: [0, Validators.min(1)],
    });

    ngOnInit() {
        // Cargar directores
        this.http.get<Director[]>('/api/directors').subscribe(d => this.directors = d);

        // Obtener id de la ruta y, si existe, cargar película
        const p = this.route.snapshot.paramMap.get('id');
        this.id = p ? +p : undefined;

        if (this.id) {
            this.http.get<Movie>(`/api/movies/${this.id}`).subscribe(m => {
                this.form.patchValue({
                    name: m.name,
                    gender: m.gender ?? '',
                    duration: m.duration ?? '',
                    fkDirector: m.directorId
                });
            });
        }
    }

    private toHmsOrNull(v?: string | null): string | null {
        const t = (v ?? '').trim();
        if (!t) return null;
        const m = t.match(/^(\d{1,2}):([0-5]\d)(?::([0-5]\d))?$/);
        if (!m) return null;
        const hh = m[1].padStart(2, '0');
        const mm = m[2];
        const ss = m[3] ?? '00';
        return `${hh}:${mm}:${ss}`;
    }

    save() {
        const raw = this.form.value;
        const payload: Movie = {
            name: (raw.name ?? '').trim(),
            gender: (raw.gender ?? '').trim() || null,
            duration: this.toHmsOrNull(raw.duration ?? ''),
            directorId: Number(raw.fkDirector) || 0,
            ...(this.id ? { id: this.id } : {})
        };

        if (!payload.name) { alert('Nombre requerido'); return; }
        if (!payload.directorId) { alert('Selecciona un director'); return; }

        const req = this.id
            ? this.http.put(`/api/movies/${this.id}`, payload, { responseType: 'text' })
            : this.http.post(`/api/movies`, payload, { responseType: 'text' });

        req.subscribe({
            next: () => this.router.navigate(['/movies']),
            error: (e) => alert(e?.error ?? 'Error al guardar')
        });
    }

    reset() {
        this.form.reset({ name: '', gender: '', duration: '', fkDirector: 0 });
    }

}
