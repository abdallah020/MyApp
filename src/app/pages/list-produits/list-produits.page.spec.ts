import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListProduitsPage } from './list-produits.page';

describe('ListProduitsPage', () => {
  let component: ListProduitsPage;
  let fixture: ComponentFixture<ListProduitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListProduitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
