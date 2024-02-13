import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProduitsService, produits } from 'src/app/services/produits/produits.service';

@Component({
  selector: 'app-list-produits',
  templateUrl: './list-produits.page.html',
  styleUrls: ['./list-produits.page.scss'],
})
export class ListProduitsPage implements OnInit {
  produits: produits[] = [];
  produitsSub: Subscription = new Subscription;

  activeButton: string | null = null;

  constructor(private produitsService: ProduitsService) { }

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  ngOnInit() {
    this.loadProduits();
    // Souscrire à l'observable pour recevoir les mises à jour automatiques
    this.produitsSub = this.produitsService.produits.subscribe({
      next: (produits: produits[]) => {
        this.produits = produits; // Mettez à jour la liste de produits à chaque mise à jour du service
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }

  ngOnDestroy() {
    // Assurez-vous de vous désabonner pour éviter des fuites de mémoire
    if (this.produitsSub) this.produitsSub.unsubscribe();
  }
  
  async loadProduits() {
    try {
      this.produits = await this.produitsService.getProduits();
    } catch (e) {
      console.error(e);
    }
  }
}
