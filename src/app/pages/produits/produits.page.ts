import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { ProduitsService, produits } from 'src/app/services/produits/produits.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.page.html',
  styleUrls: ['./produits.page.scss'],
})
export class ProduitsPage implements OnInit,OnDestroy {
  @ViewChild(IonModal) modal!: IonModal;
  produitsSub!: Subscription;
  model: any = {};
  produit: produits[] =[];
  isOpen: boolean = false;

  constructor(private produits: ProduitsService) { }

  ngOnInit(): void {
    this.produits.getProduits();
    this.produitsSub= this.produits.produits.subscribe({
      next:(produits: produits[]) =>{
        this.produit= produits;
      },
      error: (e: any) =>{
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
        await this.produits.updateProduits(this.model.id, form.value);
      } else {
        // Ajouter une nouvelle catégorie
        await this.produits.addProduits(form.value);
      }
  
      await this.modal.dismiss();
  
    } catch (e) {
      console.log(e);
    }
  }

  async deleteProduits(produits: produits){
    try {
      await this.produits.deleteProduits(produits?.id!);
    } catch (e) {
      console.log;
      
    }
  }

  async editProduits(produits: produits){
    try{
      this.isOpen = true;
      this.model = { ...produits};
      //const data: produits = await this.produits.getProduitsById(produits?.id!);
      //console.log('data: ', data);
      //this.model = { ...data };
    }catch(e){
      console.log(e);
    }
  }

  ngOnDestroy(): void {
    if(this.produitsSub) this.produitsSub.unsubscribe();
      
  }
}

