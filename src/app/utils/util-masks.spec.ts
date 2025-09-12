import { UtilMasks } from "./util-masks";

describe("UtilMasks", () => {
  it("should expose mask patterns", () => {
    expect(Array.isArray(UtilMasks.cpf)).toBeTruthy();
    expect(Array.isArray(UtilMasks.cnpj)).toBeTruthy();
    expect(Array.isArray(UtilMasks.cep)).toBeTruthy();
    expect(UtilMasks.placa.length).toBe(7);
    expect(Array.isArray(UtilMasks.dataBr)).toBeTruthy();
    expect(UtilMasks.cvv.length).toBe(4);
    expect(Array.isArray(UtilMasks.vencimentoCartao)).toBeTruthy();
    expect(Array.isArray(UtilMasks.creditCard)).toBeTruthy();
  });

  it("should choose telephone mask based on number length", () => {
    expect(UtilMasks.tel("11999999999").length).toBe(16);
    expect(UtilMasks.tel("1199999999").length).toBe(14);
  });
});
