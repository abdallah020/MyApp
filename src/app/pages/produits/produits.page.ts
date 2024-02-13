import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Subscription } from 'rxjs';
import { ProduitsService, produits } from 'src/app/services/produits/produits.service';

import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

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

  image: any;
  addedImage: string | null = null;

  constructor(private produits: ProduitsService, private firestore: Firestore,
    private storage: Storage) { }

    ngOnInit(): void {
      this.produits.getProduits();
      this.produitsSub= this.produits.produits.subscribe({
        next: (produits: produits[]) => {
          this.produit = produits;
        },
        error: (e: any) => {
          console.log(e);
        }
      });
    
      // Réinitialisez le modèle ici
      this.model = {};
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
    const updatedProduct = { ...form.value, image: this.addedImage };

    // Prendre une photo avant d'appeler addProduits
    await this.takePicture();
    await this.MettreAjourPage()
    await this.modal.dismiss();

    if (this.model?.id) {
      // Mettre à jour une catégorie existante
      await this.produits.updateProduits(this.model.id, updatedProduct);
    } else {
      // Ajouter une nouvelle catégorie
      const response = await this.produits.addProduits(updatedProduct);
    }

    // Réinitialisez addedImage après l'ajout
    this.addedImage = null;
    this.produit = await this.produits.getProduits();
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

  //upload image

  async takePicture() {
    try {
      if (Capacitor.getPlatform() != 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl
      });
  
      console.log('image: ', image);
      this.image = image.dataUrl;
  
      const blob = this.dataURLtoBlob(image.dataUrl);
      const url = await this.uploadImage(blob, image);
  
      // Mettez à jour le modèle dès que la photo est prise
      this.addedImage = url;
      
      // Vérifiez si tous les champs nécessaires sont remplis avant d'ajouter à Firestore
      if (this.model.title && this.model.description && this.addedImage) {
        const response = await this.addDocument('produits', { 
          title: this.model.title,
          description: this.model.description,
          image: this.addedImage
        });
  
        console.log(response);

      // Mettez à jour également l'URL de l'image dans this.model
        this.model.image = this.addedImage;
        
      } else {
        console.log("Veuillez remplir tous les champs avant d'ajouter à Firestore.");
      }
    } catch(e) {
      console.log(e);
    }
    // Réinitialisez le modèle après l'ajout
    this.model = {};
  }
  
  
  dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

  async uploadImage(blob: any, imageData: any) {
    try {
      const currentDate = Date.now();
      const filePath = `produits/${currentDate}.${imageData.format}`;
      const fileRef = ref(this.storage, filePath);
      const task = await uploadBytes(fileRef, blob);
      console.log('task: ', task);
      const url = getDownloadURL(fileRef);
      return url;
    } catch(e) {
      throw(e);
    }    
  }

  addDocument(path: any, data: any) {
    const dataRef = collection(this.firestore, path);
    return addDoc(dataRef, data);
  }

  async MettreAjourPage() {
    this.produit = await this.produits.getProduits(); // Mettez à jour la liste des produits dans le composant
  }

  ngOnDestroy(): void {
    if(this.produitsSub) this.produitsSub.unsubscribe();
      
  }
}

