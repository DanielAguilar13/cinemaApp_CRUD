import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieListComponent } from './movies/movie-list.component';
import { MovieFormComponent } from './movies/movie-form.component';
import { DirectorListComponent } from './directors/director-list.component';
import { DirectorFormComponent } from './directors/director-form.component';

const routes: Routes = [
    { path: '', redirectTo: 'movies', pathMatch: 'full' },
    { path: 'movies', component: MovieListComponent },
    { path: 'movies/new', component: MovieFormComponent },
    { path: 'movies/:id', component: MovieFormComponent },
    { path: 'directors', component: DirectorListComponent },
    { path: 'directors/new', component: DirectorFormComponent },
    { path: 'directors/:id', component: DirectorFormComponent },
    { path: '**', redirectTo: 'movies' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
