import { HttpClient } from "@angular/common/http";
import { ModalService, MODAL_MSG } from "./modal.service";
import { TokenService } from "./token.service";
import { VariableGlobal } from "./variable.global.service";

describe("ModalService", () => {
  let service: ModalService;
  let http: jasmine.SpyObj<HttpClient>;
  let variable: jasmine.SpyObj<VariableGlobal>;
  let token: jasmine.SpyObj<TokenService>;

  const defaultMsg = {
    status: "",
    title: "",
    text: "",
    html: false,
    cancel: {
      text: "Fechar",
      status: null,
      event: null,
      show: true,
    },
    ok: {
      text: "Confirmar",
      status: null,
      event: null,
      show: true,
    },
  };

  beforeEach(() => {
    http = jasmine.createSpyObj<HttpClient>("HttpClient", ["get"]);
    variable = jasmine.createSpyObj<VariableGlobal>("VariableGlobal", [
      "getUrl",
    ]);
    token = jasmine.createSpyObj<TokenService>("TokenService", [
      "getToken",
      "setToken",
      "removeToken",
    ]);

    service = new ModalService(http, variable, token);

    // Adiciona os modais padrão esperados por outros testes
    service.add({
      id: "default-loading",
      open: jasmine.createSpy("open"),
      close: jasmine.createSpy("close"),
    });

    service.add({
      id: "default-modal-msg",
      open: jasmine.createSpy("open"),
      close: jasmine.createSpy("close"),
    });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should add and remove modals", () => {
    // LIMPA os modais existentes para este teste ser isolado
    (service as any).modals = [];

    const modal1: any = { id: "1" };
    const modal2: any = { id: "2" };

    service.add(modal1);
    service.add(modal2);
    expect((service as any).modals.length).toBe(2);

    service.remove("1");
    expect((service as any).modals).toEqual([modal2]);
  });

  it("should open and close modal by id", () => {
    const modal: any = {
      id: "test",
      open: jasmine.createSpy("open"),
      close: jasmine.createSpy("close"),
    };

    service.add(modal);

    service.open("test");
    expect(modal.open).toHaveBeenCalled();

    service.close("test");
    expect(modal.close).toHaveBeenCalled();
  });

  it("should return default message initially", () => {
    let result: any;
    const sub = service.getMsg().subscribe((msg) => (result = msg));
    sub.unsubscribe();
    expect(result).toEqual(defaultMsg);
  });

  it("should reset message after setMsg", () => {
    service.setMsg({ title: "Teste" });
    service.resetMsg();
    let result: any;
    const sub = service.getMsg().subscribe((msg) => (result = msg));
    sub.unsubscribe();
    expect(result).toEqual(defaultMsg);
  });

  it("should merge provided data in setMsg", () => {
    const cancelEvent = () => {};
    const okEvent = () => {};
    const desc: MODAL_MSG = {
      status: 1,
      title: "Titulo",
      text: "Texto",
      html: true,
      cancel: { text: "C", status: 9, event: cancelEvent, show: false },
      ok: { text: "O", status: 8, event: okEvent, show: true },
    };

    service.setMsg(desc);

    let result: any;
    const sub = service.getMsg().subscribe((msg) => (result = msg));
    sub.unsubscribe();

    expect(result).toEqual(desc as any);
  });

  it("should default show properties to true when not boolean", () => {
    const desc: any = { cancel: { show: "maybe" }, ok: { show: undefined } };
    service.setMsg(desc);
    let result: any;
    const sub = service.getMsg().subscribe((msg) => (result = msg));
    sub.unsubscribe();
    expect(result.cancel.show).toBe(true);
    expect(result.ok.show).toBe(true);
  });

  it("should handle loading helpers", () => {
    const openSpy = spyOn(service, "open").and.callThrough();
    const closeSpy = spyOn(service, "close").and.callThrough();
    const setSpy = spyOn(service, "setMsg").and.callThrough();
    const resetSpy = spyOn(service, "resetMsg").and.callThrough();

    service.openLoading({ title: "load" });
    expect(setSpy).toHaveBeenCalledWith({ title: "load" } as any);
    expect(openSpy).toHaveBeenCalledWith("default-loading");

    service.openLoading(null as any);
    expect(openSpy).toHaveBeenCalledWith("default-loading");

    service.closeLoading();
    expect(resetSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledWith("default-loading");
  });

  it("should handle modal message helpers", () => {
    const openSpy = spyOn(service, "open").and.callThrough();
    const closeSpy = spyOn(service, "close").and.callThrough();
    const setSpy = spyOn(service, "setMsg").and.callThrough();
    const resetSpy = spyOn(service, "resetMsg").and.callThrough();

    const desc: MODAL_MSG = { title: "msg" } as any;
    service.openModalMsg(desc);
    expect(setSpy).toHaveBeenCalledWith(desc);
    expect(openSpy).toHaveBeenCalledWith("default-modal-msg");

    service.openModalMsg(null as any);
    expect(openSpy).toHaveBeenCalledWith("default-modal-msg");

    service.closeModalMsg();
    expect(resetSpy).toHaveBeenCalled();
    expect(closeSpy).toHaveBeenCalledWith("default-modal-msg");
  });
});
