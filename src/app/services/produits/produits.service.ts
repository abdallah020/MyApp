import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface produits {
  title:string, 
  description:string,
  image:string,
  id?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  private _produits =new BehaviorSubject<produits[]>([]);

  get produits(){
    return this._produits.asObservable();
  }

  constructor(
    private firestore: Firestore,
  ) { }

  async addProduits(data: produits) {
    if (data.title.trim() === '' || data.description.trim() === '' || data.image.trim() === '') {
      throw new Error('Veuillez remplir tous les champs');
    }
    try {
      const dataRef: any = collection(this.firestore, 'produits');
      const response = await addDoc(dataRef, data);
      console.log(response);
      const id = await response?.id;

      // Mettez à jour l'image dans le même document avec le même ID
      await this.updateProduits(id, {
        title: '',
        description: '',
        image: data.image,
      });

      const currentProduits = this._produits.value;
      const produitId = uuidv4();
      const produit: produits = { ...data, id };
      const updateProduits = [produit, ...currentProduits];
      this._produits.next(updateProduits);
      return updateProduits;
    } catch (e) {
      throw (e);
    }
  }


  async getProduits(){
    try{
      const dataRef: any = collection(this.firestore, 'produits');
      const querySnapshot = await getDocs(dataRef);
      const produit:produits[] = await querySnapshot.docs.map((doc) => {
        let item: any = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log('produits: ', produit);
      this._produits.next(produit);
      return produit;

    }catch(e){
      console.error('Une erreur s\'est produite lors de la récupération des produits :', e);
      throw(e);
    }
  }

  async getProduitsById(id: string){
    try{
      const dataRef: any = doc(this.firestore, `produits/${id}`);
      const docSnap = await getDoc(dataRef);
      if (docSnap.exists()) {
        let item: any = docSnap.data();
        item.id = docSnap.id;
        return {...item} as produits;
        //return docSnap.data() as produits;
      }else{
        console.log("No such document!");
        throw("No such document!");
      }
    }catch(e){
      throw(e);
    }
  }

  async updateProduits(id: string, data: produits){
    try{
      const dataRef: any = doc(this.firestore, `produits/${id}`);
      await updateDoc(dataRef, data);
      let currentProduits = this._produits.value;
      const index = currentProduits.findIndex(x => x.id == id);
      const latestData = {id, ...data}
      currentProduits[index] = latestData;
      this._produits.next(currentProduits);
      return latestData;
    }catch(e){
      throw(e);
    }
  }
  async deleteProduits(id: string){
    try{
      const dataRef: any = doc(this.firestore, `produits/${id}`);
      await deleteDoc(dataRef);
      let currentProduits = this._produits.value;
      currentProduits = currentProduits.filter(x => x.id != id);
      this._produits.next(currentProduits);
    }catch(e){
      throw(e);
    }
  }



}
