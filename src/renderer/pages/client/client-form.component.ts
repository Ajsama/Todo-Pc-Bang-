import { Component, input, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Client, ClientCreateDto, ClientUpdateDto } from 'src/shared/client';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit {
  clientAModifier = input<Client | null>(null);
  sauvegarde = output<Client>();
  annulation = output<void>();

  enCours = false;

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private clientService: ClientService) {}

  ngOnInit() {
    const client = this.clientAModifier();
    if (client) {
      this.form.patchValue({
        nom: client.nom ?? '',
        prenom: client.prenom ?? '',
        email: client.email ?? '',
        telephone: client.telephone ?? ''
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.enCours = true;
    const values = this.form.value;
    const client = this.clientAModifier();
    if (client) {
      const updated = await this.clientService.updateClient(client.id_client, values as ClientUpdateDto);
      this.sauvegarde.emit(updated);
    } else {
      const created = await this.clientService.addClient(values as ClientCreateDto);
      this.sauvegarde.emit(created);
    }
    this.enCours = false;
  }
}
