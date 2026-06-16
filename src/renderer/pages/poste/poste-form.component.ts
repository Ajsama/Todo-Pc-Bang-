import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Poste, PosteCreateDto, PosteUpdateDto } from 'src/shared/poste';
import { PosteService } from '../../services/poste.service';

@Component({
  selector: 'app-poste-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './poste-form.component.html',
  styleUrl: './poste-form.component.css'
})
export class PosteFormComponent implements OnInit {
  posteAModifier = input<Poste | null>(null);
  sauvegarde = output<Poste>();
  annulation = output<void>();

  enCours = false;

  form = this.fb.group({
    numero_poste: ['', Validators.required],
    type: [''],
    statut: ['Libre', Validators.required]
  });

  constructor(private fb: FormBuilder, private posteService: PosteService) {}

  ngOnInit() {
    const poste = this.posteAModifier();
    if (poste) {
      this.form.patchValue({
        numero_poste: poste.numero_poste ?? '',
        type: poste.type ?? '',
        statut: poste.statut ?? 'Libre'
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const poste = this.posteAModifier();
    if (poste) {
      const updated = await this.posteService.updatePoste(poste.id_poste, values as PosteUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.posteService.addPoste(values as PosteCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}
