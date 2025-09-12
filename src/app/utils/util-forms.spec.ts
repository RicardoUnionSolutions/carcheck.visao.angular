import { UtilForms } from './util-forms';

describe('UtilForms', () => {
  it('should provide UF options', () => {
    expect(UtilForms.options.uf.length).toBe(27);
    expect(UtilForms.options.uf[0]).toEqual({ label: 'AC', value: 'AC' });
  });

  it('should provide Estado options with São Paulo', () => {
    const sp = UtilForms.options.estado.find(e => e.value === 'SP');
    expect(sp?.label).toBe('São Paulo');
  });
});

