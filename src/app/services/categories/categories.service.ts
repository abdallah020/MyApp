import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc, } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

export interface categories {
  title:string, 
  description:string,
  id?: string,
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private _categories =new BehaviorSubject<categories[]>([]);

  get categories(){
    return this._categories.asObservable();
  }

  constructor(
    private firestore: Firestore,
  ) { }

  async addCategories(data: categories){
    try{
      const dataRef: any = collection(this.firestore, 'categories');
      const response = await addDoc(dataRef, data);
      console.log(response);
      const id = await response?.id;
      const currentCategories = this._categories.value;
      const categoryId = uuidv4(); // Utilisation de uuidv4 pour générer un id unique
      const categorie: categories = { ...data, id };
      const updateCategories = [categorie, ...currentCategories];
      this._categories.next(updateCategories);
      return updateCategories;
    }catch(e){
      throw(e);
    }
  }

  async getCategories(){
    try{
      const dataRef: any = collection(this.firestore, 'categories');
      const querySnapshot = await getDocs(dataRef);
      const categorie:categories[] = await querySnapshot.docs.map((doc) => {
        let item: any = doc.data();
        item.id = doc.id;
        return item;
      });
      console.log('categories: ', categorie);
      this._categories.next(categorie);
      return categorie;

    }catch(e){
      throw(e);
    }
  }

  async getCategoriesById(id: string){
    try{
      const dataRef: any = doc(this.firestore, `categories/${id}`);
      const docSnap = await getDoc(dataRef);
      if (docSnap.exists()) {
        let item: any = docSnap.data();
        item.id = docSnap.id;
        return {...item} as categories;
        //return docSnap.data() as categories;
      }else{
        console.log("No such document!");
        throw("No such document!");
      }
    }catch(e){
      throw(e);
    }
  }

  async updateCategories(id: string, data: categories){
    try{
      const dataRef: any = doc(this.firestore, `categories/${id}`);
      await updateDoc(dataRef, data);
      let currentCategories = this._categories.value;
      const index = currentCategories.findIndex(x => x.id == id);
      const latestData = {id, ...data}
      currentCategories[index] = latestData;
      this._categories.next(currentCategories);
      return latestData;
    }catch(e){
      throw(e);
    }
  }
  async deleteCategories(id: string){
    try{
      const dataRef: any = doc(this.firestore, `categories/${id}`);
      await deleteDoc(dataRef);
      let currentCategories = this._categories.value;
      currentCategories = currentCategories.filter(x => x.id != id);
      this._categories.next(currentCategories);
    }catch(e){
      throw(e);
    }
  }



}
