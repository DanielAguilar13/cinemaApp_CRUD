import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// Modelo/servicio
import { MoviesService, Movie } from '../services/movies.service';

// Angular common
import { NgIf } from '@angular/common';

// Angular Material
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';

@Component({
    standalone: true,
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    imports: [
        NgIf,
        RouterLink,
        MatCardModule,
        MatFormFieldModule, MatInputModule,
        MatTableModule, MatPaginatorModule, MatSortModule,
        MatButtonModule, MatIconModule, MatDividerModule,
    ],
})
export class MovieListComponent implements OnInit, AfterViewInit {
    displayedColumns = ['id', 'name', 'gender', 'duration', 'director', 'actions'];

    data = new MatTableDataSource<Movie>([]);

    // Paginador y sort del template
    @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort!: MatSort;

    loading = false;
    error?: string;

    constructor(private api: MoviesService, private router: Router) { }

    ngOnInit() {
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;

        // filtro por varias columnas
        this.data.filterPredicate = (m: Movie, filter: string) => {
            const f = filter.trim().toLowerCase();
            return (
                (m.name ?? '').toLowerCase().includes(f) ||
                (m.gender ?? '').toLowerCase().includes(f) ||
                (m.duration ?? '').toString().toLowerCase().includes(f) ||
                (m.director?.name ?? '').toLowerCase().includes(f)
            );
        };

        this.load();
    }

    ngAfterViewInit(): void {
        // por si el ViewChild inicializa después
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
    }

    load() {
        this.loading = true;
        this.api.list().subscribe({
            next: (rows) => {
                this.data.data = rows;
                this.loading = false;
            },
            error: (err) => {
                this.error = 'No se pudieron cargar películas';
                console.error(err);
                this.loading = false;
            },
        });
    }

    applyFilter(value: string) {
        this.data.filter = value.trim().toLowerCase();
        if (this.data.paginator) this.data.paginator.firstPage();
    }

    create() { this.router.navigate(['/movies/new']); }
    edit(id: number) { this.router.navigate(['/movies', id]); }

    remove(id: number) {
        if (!confirm('¿Borrar esta película?')) return;
        this.api.delete(id).subscribe({
            next: () => this.load(),
            error: (e) => console.error(e),
        });
    }
}
