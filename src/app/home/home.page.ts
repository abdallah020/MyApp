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

  activeButton: string | null = null;

  constructor(private produitsService: ProduitsService, private categoriesService: CategoriesService) {}

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  ngOnInit() {
    this.loadProduits();
    // Souscrire à l'observable pour recevoir les mises à jour automatiques
    this.produitsSub = this.produitsService.produits.subscribe({
      next: (produits: produits[]) => {
        this.produits = produits.slice(-5).reverse(); // Mettez à jour la liste de produits à chaque mise à jour du service
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
      console.log('Avant chargement des produits');
      this.produits = await this.produitsService.getProduits();
      console.log('Après chargement des produits', this.produits);
      this.produits = this.produits.slice(-5).reverse();
      console.log('produits après ajustement', this.produits);
    } catch (e) {
      console.error('Une erreur s\'est produite lors du chargement des produits :', e);
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
      console.error('Une erreur s\'est produite lors du chargement des catégories :', e);
    }
  }
  
}
