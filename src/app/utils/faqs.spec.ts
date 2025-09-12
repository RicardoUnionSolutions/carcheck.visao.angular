import { faqs } from './faqs';

describe('faqs', () => {
  it('should load FAQ data', () => {
    expect(faqs.length).toBeGreaterThan(0);
    expect(faqs[0].question).toContain('Carcheck Brasil');
  });
});

