import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectorsService, Director } from '../services/directors.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-director-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule,
        MatSlideToggleModule, MatButtonModule, MatIconModule
    ],
    templateUrl: './director-form.component.html'
})
export class DirectorFormComponent implements OnInit {
    id?: number;

    form = this.fb.group({
        name: this.fb.nonNullable.control('', { validators: [Validators.required] }),
        age: this.fb.control<number | null>(null),
        active: this.fb.nonNullable.control(true)
    });

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private api: DirectorsService
    ) { }

    ngOnInit() {
        const p = this.route.snapshot.paramMap.get('id');
        this.id = p ? +p : undefined;
        if (this.id) {
            this.api.get(this.id).subscribe(d => {
                this.form.patchValue({
                    name: d.name ?? '',
                    active: d.active ?? true
                });
            });
        }
    }

    save() {
        const v = this.form.getRawValue();
        const payload: Director = {
            id: this.id,
            name: v.name,
            age: v.age || undefined,
            active: v.active
        };
        const req = this.id ? this.api.update(this.id, payload) : this.api.create(payload);
        req.subscribe(() => this.router.navigate(['/directors']));
    }

    reset() { this.form.reset({ name: '', age: null, active: true }); }
    back() { this.router.navigate(['/directors']); }
}
