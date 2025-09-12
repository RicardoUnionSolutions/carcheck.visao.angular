import { OnlyLettersDirective } from "./onlyLetters.directive";

describe("OnlyLettersDirective", () => {
  let directive: OnlyLettersDirective;

  beforeEach(() => {
    directive = new OnlyLettersDirective();
  });

  function createEvent(key: string): any {
    return { key, preventDefault: jasmine.createSpy("preventDefault") };
  }

  it("should create an instance", () => {
    expect(directive).toBeTruthy();
  });

  it("should prevent default for numeric keys", () => {
    const event = createEvent("5");
    directive.onKeyPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("should prevent default for all digits", () => {
    "0123456789".split("").forEach((digit) => {
      const event = createEvent(digit);
      directive.onKeyPress(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  it("should allow alphabetic characters", () => {
    const event = createEvent("a");
    directive.onKeyPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("should allow non-numeric characters like space or dash", () => {
    const spaceEvent = createEvent(" ");
    directive.onKeyPress(spaceEvent);
    expect(spaceEvent.preventDefault).not.toHaveBeenCalled();

    const dashEvent = createEvent("-");
    directive.onKeyPress(dashEvent);
    expect(dashEvent.preventDefault).not.toHaveBeenCalled();
  });

  it("should allow special keys like Enter", () => {
    const event = createEvent("Enter");
    directive.onKeyPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
});
