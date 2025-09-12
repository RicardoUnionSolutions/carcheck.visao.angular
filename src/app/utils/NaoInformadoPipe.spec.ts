import { NaoInformadoPipe } from './NaoInformadoPipe';

describe('NaoInformadoPipe', () => {
  const pipe = new NaoInformadoPipe();

  it('should return placeholder for empty values', () => {
    expect(pipe.transform('')).toBe('----');
    expect(pipe.transform(null)).toBe('----');
  });

  it('should return original value when provided', () => {
    expect(pipe.transform('valor')).toBe('valor');
  });
});

