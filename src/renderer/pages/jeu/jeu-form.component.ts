import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Jeu, JeuCreateDto, JeuUpdateDto } from 'src/shared/jeu';
import { JeuService } from '../../services/jeu.service';

@Component({
  selector: 'app-jeu-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './jeu-form.component.html',
  styleUrl: './jeu-form.component.css'
})
export class JeuFormComponent implements OnInit {
  jeuAModifier = input<Jeu | null>(null);
  sauvegarde = output<Jeu>();
  annulation = output<void>();

  enCours = false;

  form = this.fb.group({
    titre: ['', Validators.required],
    editeur: [''],
    genre: [''],
    annee: [null as number | null]
  });

  constructor(private fb: FormBuilder, private jeuService: JeuService) {}

  ngOnInit() {
    const jeu = this.jeuAModifier();
    if (jeu) {
      this.form.patchValue({
        titre: jeu.titre,
        editeur: jeu.editeur ?? '',
        genre: jeu.genre ?? '',
        annee: jeu.annee
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const dto = {
      titre: values.titre!,
      editeur: values.editeur || null,
      genre: values.genre || null,
      annee: values.annee ? Number(values.annee) : null
    };
    const jeu = this.jeuAModifier();
    if (jeu) {
      const updated = await this.jeuService.updateJeu(jeu.id_jeu, dto as JeuUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.jeuService.addJeu(dto as JeuCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}
