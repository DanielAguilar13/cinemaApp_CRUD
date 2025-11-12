// src/app/directors/director-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { DirectorsService, Director } from '../services/directors.service';

@Component({
    selector: 'app-director-list',
    standalone: true,
    imports: [
        CommonModule, RouterLink,
        // Angular Material usados en tu plantilla:
        MatCardModule, MatDividerModule,
        MatFormFieldModule, MatInputModule,
        MatIconModule, MatButtonModule,
        MatTableModule, MatSortModule, MatPaginatorModule,
        MatChipsModule
    ],
    templateUrl: './director-list.component.html',
    styles: [`
    .page { display:block; padding:1rem; }
    .page-header { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .btn-row { display:flex; gap:.5rem; align-items:center; }
    .table-wrap { overflow:auto; max-width:100%; }
    .state { display:flex; align-items:center; gap:.5rem; padding:.75rem 0; }
    .mt-12 { margin-top:12px; }
    .w-100 { width:100%; }
    .pulse {
      width:10px; height:10px; border-radius:50%;
      background: currentColor; opacity:.75; animation:pulse 1.2s infinite ease-in-out;
    }
    @keyframes pulse { 0%{ transform:scale(.9); opacity:.6 } 50%{ transform:scale(1.2); opacity:1 } 100%{ transform:scale(.9); opacity:.6 } }
  `]
})
export class DirectorListComponent implements OnInit {
    displayedColumns = ['id', 'name', 'age', 'active', 'actions'];
    data = new MatTableDataSource<Director>([]);
    filter = '';
    loading = false;
    error: string | null = null;

    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    constructor(
        private api: DirectorsService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Configurar filtro: buscar por nombre y edad (y activo como "si/no")
        this.data.filterPredicate = (row, filterValue) => {
            const f = (filterValue || '').trim().toLowerCase();
            if (!f) return true;
            const name = (row.name ?? '').toLowerCase();
            const age = (row.age ?? '').toString();
            const activeText = row.active ? 'si' : 'no';
            return name.includes(f) || age.includes(f) || activeText.includes(f);
        };

        // Paginador y sort
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;

        this.load();
    }

    load(): void {
        this.loading = true;
        this.error = null;
        this.api.list().subscribe({
            next: (items) => {
                this.data.data = items ?? [];
                // Reiniciar paginador al cargar
                if (this.paginator) this.paginator.firstPage();
            },
            error: (e) => {
                console.error(e);
                this.error = 'No se pudo cargar la lista de directores.';
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    applyFilter(text: string): void {
        this.filter = text;
        this.data.filter = text?.trim().toLowerCase();
        if (this.paginator) this.paginator.firstPage();
    }

    create(): void {
        // Ajusta la ruta si tu formulario vive en otra ruta
        this.router.navigate(['/directors/new']);
    }

    edit(id?: number): void {
        if (!id) return;
        this.router.navigate(['/directors', id, 'edit']);
    }

    remove(id?: number) {
        if (!id) return;
        if (!confirm('¿Eliminar este director?')) return;

        this.api.delete(id).subscribe({
            next: () => this.load(),
            error: (e) => {
                if (e.status === 500) {
                    this.error = e.error?.detail || e.error || 'No se puede eliminar: tiene películas asociadas.';
                } else if (e.status === 404) {
                    this.error = 'El director no existe.';
                } else {
                    this.error = 'No se puede eliminar: tiene películas asociadas.';
                }
                this.loading = false;
            }
        });
    }
}
