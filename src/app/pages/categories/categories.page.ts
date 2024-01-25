import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { CategoriesService, categories } from 'src/app/services/categories/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit,OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;
  categoriesSub!: Subscription;
  model: any = {};
  categorie: categories[] =[];
  isOpen: boolean = false;

  constructor(private categories: CategoriesService) { }

  ngOnInit(): void {
    this.categories.getCategories();
    this.categoriesSub= this.categories.categories.subscribe({
      next:(categories) =>{
        this.categorie= categories;
      },
      error: (e) =>{
        console.log(e);
      }
    });
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    this.model ={};
    this.isOpen = false;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  async save(form: NgForm) {
    try {
      if (!form.valid) {
        return;
      }
      console.log(form.value);
  
      if (this.model?.id) {
        // Mettre à jour une catégorie existante
        await this.categories.updateCategories(this.model.id, form.value);
      } else {
        // Ajouter une nouvelle catégorie
        await this.categories.addCategories(form.value);
      }
  
      await this.modal.dismiss();
  
    } catch (e) {
      console.log(e);
    }
  }

  async deleteCategories(categories: categories){
    try {
      await this.categories.deleteCategories(categories?.id!);
    } catch (e) {
      console.log;
      
    }
  }

  async editCategories(categories: categories){
    try{
      this.isOpen = true;
      this.model = { ...categories};
      //const data: categories = await this.categories.getCategoriesById(categories?.id!);
      //console.log('data: ', data);
      //this.model = { ...data };
    }catch(e){
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    if(this.categoriesSub) this.categoriesSub.unsubscribe();
      
  }
}
