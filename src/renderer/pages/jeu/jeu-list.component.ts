import { Component, signal, computed, OnInit } from '@angular/core';
import { Jeu } from 'src/shared/jeu';
import { JeuService } from '../../services/jeu.service';
import { JeuFormComponent } from './jeu-form.component';

@Component({
  selector: 'app-jeu-list',
  standalone: true,
  imports: [JeuFormComponent],
  templateUrl: './jeu-list.component.html',
  styleUrl: './jeu-list.component.css'
})
export class JeuListComponent implements OnInit {
  jeux = signal<Jeu[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  jeuSelectionne = signal<Jeu | null>(null);

  nombreJeux = computed(() => this.jeux().length);

  constructor(private jeuService: JeuService) {}

  async ngOnInit() {
    await this.chargerJeux();
  }

  async chargerJeux() {
    this.chargement.set(true);
    const data = await this.jeuService.getJeux();
    this.jeux.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.jeuSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.jeuSelectionne.set(null);
  }

  modifierJeu(j: Jeu) {
    this.jeuSelectionne.set(j);
    this.afficherFormulaire.set(true);
  }

  async supprimerJeu(id: number) {
    if (!confirm('Supprimer ce jeu ?')) return;
    await this.jeuService.deleteJeu(id);
    this.jeux.set(this.jeux().filter(j => j.id_jeu !== id));
  }

  async onSauvegarde(_jeu: Jeu) {
    await this.chargerJeux();
    this.fermerFormulaire();
  }
}
