import { OnlyNumbersDirective } from './onlyNumbers.directive';

function createKeyboardEvent(key: string): KeyboardEvent {
  return {
    key,
    preventDefault: jasmine.createSpy('preventDefault')
  } as unknown as KeyboardEvent;
}

describe('OnlyNumbersDirective', () => {
  let directive: OnlyNumbersDirective;

  beforeEach(() => {
    directive = new OnlyNumbersDirective();
  });

  it('should allow numeric characters', () => {
    const digits = ['0', '5', '9'];
    digits.forEach(d => {
      const event = createKeyboardEvent(d);
      directive.onKeyPress(event);
      expect(event.preventDefault).not.toHaveBeenCalled();
    });
  });

  it('should prevent alphabetic characters', () => {
    const event = createKeyboardEvent('a');
    directive.onKeyPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prevent special characters', () => {
    const event = createKeyboardEvent('.');
    directive.onKeyPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should prevent control keys like Backspace', () => {
    const event = createKeyboardEvent('Backspace');
    directive.onKeyPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });
});

