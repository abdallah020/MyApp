import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GetStartPage } from './get-start.page';

describe('GetStartPage', () => {
  let component: GetStartPage;
  let fixture: ComponentFixture<GetStartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GetStartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
