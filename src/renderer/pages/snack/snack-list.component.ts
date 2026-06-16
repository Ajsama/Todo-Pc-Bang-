import { Component, signal, computed, OnInit } from '@angular/core';
import { Snack } from 'src/shared/snack';
import { SnackService } from '../../services/snack.service';
import { SnackFormComponent } from './snack-form.component';

@Component({
  selector: 'app-snack-list',
  standalone: true,
  imports: [SnackFormComponent],
  templateUrl: './snack-list.component.html',
  styleUrl: './snack-list.component.css'
})
export class SnackListComponent implements OnInit {
  snacks = signal<Snack[]>([]);
  chargement = signal(true);
  afficherFormulaire = signal(false);
  snackSelectionne = signal<Snack | null>(null);

  nombreSnacks = computed(() => this.snacks().length);

  constructor(private snackService: SnackService) {}

  async ngOnInit() {
    await this.chargerSnacks();
  }

  async chargerSnacks() {
    this.chargement.set(true);
    const data = await this.snackService.getSnacks();
    this.snacks.set(data);
    this.chargement.set(false);
  }

  ouvrirFormulaire() {
    this.snackSelectionne.set(null);
    this.afficherFormulaire.set(true);
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.snackSelectionne.set(null);
  }

  modifierSnack(s: Snack) {
    this.snackSelectionne.set(s);
    this.afficherFormulaire.set(true);
  }

  async supprimerSnack(id: number) {
    if (!confirm('Supprimer ce snack ?')) return;
    try {
      await this.snackService.deleteSnack(id);
      this.snacks.set(this.snacks().filter(s => s.id_snack !== id));
    } catch (e) {
      alert('Impossible de supprimer ce snack (il est peut-être référencé dans une commande).');
    }
  }

  async onSauvegarde(_snack: Snack) {
    await this.chargerSnacks();
    this.fermerFormulaire();
  }
}
