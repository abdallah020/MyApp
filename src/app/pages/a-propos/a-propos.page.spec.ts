import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AProposPage } from './a-propos.page';

describe('AProposPage', () => {
  let component: AProposPage;
  let fixture: ComponentFixture<AProposPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AProposPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
