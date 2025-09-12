import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PixComponent } from './pix.component';

describe('PixComponent', () => {
  let component: PixComponent;
  let fixture: ComponentFixture<PixComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PixComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

