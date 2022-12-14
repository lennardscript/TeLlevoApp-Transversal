import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UbicacionYchoferelegidoPage } from './ubicacion-ychoferelegido.page';

describe('UbicacionYchoferelegidoPage', () => {
  let component: UbicacionYchoferelegidoPage;
  let fixture: ComponentFixture<UbicacionYchoferelegidoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicacionYchoferelegidoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UbicacionYchoferelegidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
