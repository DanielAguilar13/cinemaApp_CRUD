import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        MatToolbarModule, MatSlideToggleModule, MatIconModule, MatButtonModule,
    ],
})
export class AppComponent {
    dark = false;
    ngOnInit() {
        this.dark = localStorage.getItem('theme') === 'dark';
        document.body.classList.toggle('dark', this.dark);
    }
    toggleTheme(v: boolean) {
        this.dark = v;
        document.body.classList.toggle('dark', v);
        localStorage.setItem('theme', v ? 'dark' : 'light');
    }
}
