import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { CkModalComponent } from "./ck-modal.component";
import { ModalService } from "../../service/modal.service";

class ModalServiceStub {
  add = jasmine.createSpy("add");
  remove = jasmine.createSpy("remove");
}

describe("CkModalComponent", () => {
  let component: CkModalComponent;
  let fixture: ComponentFixture<CkModalComponent>;
  let service: ModalServiceStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CkModalComponent],
      providers: [{ provide: ModalService, useClass: ModalServiceStub }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CkModalComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(ModalService) as any;
  });

  afterEach(() => {
    document.body.classList.remove("ck-modal-open");
    const el = document.querySelector("ck-modal");
    if (el && el.parentNode === document.body) {
      document.body.removeChild(el);
    }
  });

  it("should create", () => {
    component.id = "test";
    component.ngOnInit();
    expect(component).toBeTruthy();
    component.ngOnDestroy();
  });

  it("ngOnInit should log error when no id provided", () => {
    const errorSpy = spyOn(console, "error");
    component.ngOnInit();
    expect(errorSpy).toHaveBeenCalledWith("modal must have an id");
    expect(service.add).not.toHaveBeenCalled();
  });

  it("ngOnInit should append element to body and register service when id is set", () => {
    component.id = "modal1";
    component.ngOnInit();
    expect(service.add).toHaveBeenCalledWith(component);
    expect(component["element"].parentNode).toBe(document.body);
    component.ngOnDestroy();
  });

  it("open and close should toggle display and body class", () => {
    component.id = "modal2";
    component.ngOnInit();
    component.open();
    expect(component["element"].style.display).toBe("block");
    expect(document.body.classList.contains("ck-modal-open")).toBeTruthy();
    component.close();
    expect(component["element"].style.display).toBe("none");
    expect(document.body.classList.contains("ck-modal-open")).toBeFalsy();
    component.ngOnDestroy();
  });

  it("ngOnDestroy should remove element and unregister service", () => {
    component.id = "modal3";
    component.ngOnInit();
    const element = component["element"];
    component.ngOnDestroy();
    expect(service.remove).toHaveBeenCalledWith("modal3");
    expect(document.body.contains(element)).toBeFalsy();
  });
});
