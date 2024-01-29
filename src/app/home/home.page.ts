import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProduitsService, produits } from '../services/produits/produits.service';
import { Subscription } from 'rxjs';
import { CategoriesService, categories } from '../services/categories/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  produits: produits[] = [];
  produitsSub: Subscription = new Subscription;
  categories: categories[] = [];
  categoriesSub: Subscription = new Subscription;

  constructor(private produitsService: ProduitsService, private categoriesService: CategoriesService) {}

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
    this.loadCategories();
    // Souscrire à l'observable pour recevoir les mises à jour automatiques
    this.categoriesSub = this.categoriesService.categories.subscribe({
      next: (categories: categories[]) => {
        this.categories = categories.slice(-4).reverse(); // Mettez à jour la liste de produits à chaque mise à jour du service
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }

  ngOnDestroy() {
    // Assurez-vous de vous désabonner pour éviter des fuites de mémoire
    if (this.produitsSub) this.produitsSub.unsubscribe();
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
  }

  async loadProduits() {
    try {
      this.produits = await this.produitsService.getProduits();
    } catch (e) {
      console.error(e);
    }
  }
  async loadCategories() {
    try {
      console.log('Avant chargement des catégories');
      this.categories = await this.categoriesService.getCategories();
      console.log('Après chargement des catégories', this.categories);
      this.categories = this.categories.slice(-4).reverse();
      console.log('Catégories après ajustement', this.categories);
    } catch (e) {
      console.error(e);
    }
  }
  
}
