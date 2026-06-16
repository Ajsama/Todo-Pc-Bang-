import { Component, signal, computed, OnInit } from '@angular/core';
import { Poste } from 'src/shared/poste';
import { PosteService } from '../../services/poste.service';
import { PosteFormComponent } from './poste-form.component';

@Component({
  selector: 'app-poste-list',
  standalone: true,
  imports: [PosteFormComponent],
  templateUrl: './poste-list.component.html',
  styleUrl: './poste-list.component.css'
})
export class PosteListComponent implements OnInit {
  postes = signal<Poste[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  posteSelectionne = signal<Poste | null>(null);

  nombrePostes = computed(() => this.postes().length);

  constructor(private posteService: PosteService) {}

  async ngOnInit() {
    await this.chargerPostes();
  }

  async chargerPostes() {
    this.chargement.set(true);
    const data = await this.posteService.getPostes();
    this.postes.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.posteSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.posteSelectionne.set(null);
  }

  modifierPoste(poste: Poste) {
    this.posteSelectionne.set(poste);
    this.afficherFormulaire.set(true);
  }

  async supprimerPoste(id: number) {
    if (!confirm('Supprimer ce poste ?')) return;
    await this.posteService.deletePoste(id);
    const liste = this.postes().filter(p => p.id_poste !== id);
    this.postes.set(liste);
  }

  async onSauvegarde(poste: Poste) {
    await this.chargerPostes();
    this.fermerFormulaire();
  }
}
