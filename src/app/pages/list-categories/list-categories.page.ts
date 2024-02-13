import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoriesService, categories } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.page.html',
  styleUrls: ['./list-categories.page.scss'],
})
export class ListCategoriesPage implements OnInit {
  categories: categories[] = [];
  categoriesSub: Subscription = new Subscription;

  activeButton: string | null = null;

  constructor(private categoriesService: CategoriesService) { }

  setActiveButton(button: string) {
    this.activeButton = button;
  }

  ngOnInit() {
    this.loadCategories();
    // Souscrire à l'observable pour recevoir les mises à jour automatiques
    this.categoriesSub = this.categoriesService.categories.subscribe({
      next: (categories: categories[]) => {
        this.categories = categories; // Mettez à jour la liste de produits à chaque mise à jour du service
      },
      error: (e: any) => {
        console.log(e);
      }
    });
  }
  ngOnDestroy() {
    // Assurez-vous de vous désabonner pour éviter des fuites de mémoire
    if (this.categoriesSub) this.categoriesSub.unsubscribe();
  }

  async loadCategories() {
    try {
      console.log('Avant chargement des catégories');
      this.categories = await this.categoriesService.getCategories();
      console.log('Après chargement des catégories', this.categories);
    } catch (e) {
      console.error(e);
    }
  }

}
