import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { CkModalMsgComponent } from './ck-modal-msg.component';
import { ModalService } from '../../../service/modal.service';
import { HttpClient } from '@angular/common/http';

class ModalServiceStub {
  msg$ = new BehaviorSubject<any>({
    status: '',
    title: '',
    text: '',
    html: false,
    cancel: { text: 'Fechar', status: null, event: null, show: true },
    ok: { text: 'Confirmar', status: null, event: null, show: true },
  });
  getMsg() {
    return this.msg$.asObservable();
  }
  closeModalMsg = jasmine.createSpy('closeModalMsg');
}

describe('CkModalMsgComponent', () => {
  let component: CkModalMsgComponent;
  let fixture: ComponentFixture<CkModalMsgComponent>;
  let service: ModalServiceStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [CkModalMsgComponent],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: HttpClient, useValue: {} }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkModalMsgComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ModalService) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update modal when service emits value', () => {
    service.msg$.next({ title: 'Teste' });
    expect(component.modal.title).toBe('Teste');
  });

  it('cancelEvent should close modal even without event', () => {
    component.modal.cancel.event = null;
    service.closeModalMsg.calls.reset();
    component.cancelEvent();
    expect(service.closeModalMsg).toHaveBeenCalled();
  });

  it('cancelEvent should trigger provided event', () => {
    const spy = jasmine.createSpy('cancel');
    component.modal.cancel.event = spy;
    service.closeModalMsg.calls.reset();
    component.cancelEvent();
    expect(service.closeModalMsg).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('okEvent should close modal even without event', () => {
    component.modal.ok.event = null;
    service.closeModalMsg.calls.reset();
    component.okEvent();
    expect(service.closeModalMsg).toHaveBeenCalled();
  });

  it('okEvent should trigger provided event', () => {
    const spy = jasmine.createSpy('ok');
    component.modal.ok.event = spy;
    service.closeModalMsg.calls.reset();
    component.okEvent();
    expect(service.closeModalMsg).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
