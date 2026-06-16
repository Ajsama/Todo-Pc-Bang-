import { Component, input, output, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Snack, SnackCreateDto, SnackUpdateDto } from 'src/shared/snack';
import { Categorie } from 'src/shared/categorie';
import { SnackService } from '../../services/snack.service';
import { CategorieService } from '../../services/categorie.service';

@Component({
  selector: 'app-snack-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './snack-form.component.html',
  styleUrl: './snack-form.component.css'
})
export class SnackFormComponent implements OnInit {
  snackAModifier = input<Snack | null>(null);
  sauvegarde = output<Snack>();
  annulation = output<void>();

  categories = signal<Categorie[]>([]);
  enCours = false;

  form = this.fb.group({
    nom: ['', Validators.required],
    prix: [0, [Validators.required, Validators.min(0)]],
    stock: [0, Validators.min(0)],
    id_categorie: [null as number | null]
  });

  constructor(
    private fb: FormBuilder,
    private snackService: SnackService,
    private categorieService: CategorieService
  ) {}

  async ngOnInit() {
    const cats = await this.categorieService.getCategories();
    this.categories.set(cats);

    const snack = this.snackAModifier();
    if (snack) {
      this.form.patchValue({
        nom: snack.nom,
        prix: snack.prix,
        stock: snack.stock,
        id_categorie: snack.id_categorie
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const dto = {
      nom: values.nom!,
      prix: Number(values.prix),
      stock: Number(values.stock),
      id_categorie: values.id_categorie ?? null
    };
    const snack = this.snackAModifier();
    if (snack) {
      const updated = await this.snackService.updateSnack(snack.id_snack, dto as SnackUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.snackService.addSnack(dto as SnackCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}
