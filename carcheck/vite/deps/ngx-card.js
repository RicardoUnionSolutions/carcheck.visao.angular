import {
  Attribute,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  NgModule
} from "./chunk-VXVJ7NXR.js";
import "./chunk-XQIII63V.js";
import "./chunk-OUVCBQFH.js";
import "./chunk-E43UC4YD.js";
import "./chunk-4PXKNON4.js";
import "./chunk-TXDUYLVM.js";

// node_modules/ngx-card/util.js
var uniqueId = /* @__PURE__ */ function() {
  var idCounter = 0;
  return function(prefix) {
    if (prefix === void 0) {
      prefix = "uid";
    }
    return "card_" + prefix + "_" + ++idCounter;
  };
}();

// node_modules/ngx-card/inputs.js
var NgxCardNumberTemplate = function() {
  function NgxCardNumberTemplate2(elementRef, name) {
    this.elementRef = elementRef;
    this.name = name;
  }
  NgxCardNumberTemplate2.prototype.ngOnInit = function() {
    this.name = this.name || uniqueId("number");
  };
  return NgxCardNumberTemplate2;
}();
NgxCardNumberTemplate.decorators = [
  { type: Directive, args: [{
    selector: "[card-number]",
    host: {
      "[name]": "name"
    }
  }] }
];
NgxCardNumberTemplate.ctorParameters = function() {
  return [
    { type: ElementRef },
    { type: void 0, decorators: [{ type: Attribute, args: ["name"] }] }
  ];
};
var NgxCardNameTemplate = function() {
  function NgxCardNameTemplate2(elementRef, name) {
    this.elementRef = elementRef;
    this.name = name;
  }
  NgxCardNameTemplate2.prototype.ngOnInit = function() {
    this.name = this.name || uniqueId("name");
  };
  return NgxCardNameTemplate2;
}();
NgxCardNameTemplate.decorators = [
  { type: Directive, args: [{
    selector: "[card-name]",
    host: {
      "[name]": "name"
    }
  }] }
];
NgxCardNameTemplate.ctorParameters = function() {
  return [
    { type: ElementRef },
    { type: void 0, decorators: [{ type: Attribute, args: ["name"] }] }
  ];
};
var NgxCardExpiryTemplate = function() {
  function NgxCardExpiryTemplate2(elementRef, name) {
    this.elementRef = elementRef;
    this.name = name;
  }
  NgxCardExpiryTemplate2.prototype.ngOnInit = function() {
    this.name = this.name || uniqueId("expiry");
  };
  return NgxCardExpiryTemplate2;
}();
NgxCardExpiryTemplate.decorators = [
  { type: Directive, args: [{
    selector: "[card-expiry]",
    host: {
      "[name]": "name"
    }
  }] }
];
NgxCardExpiryTemplate.ctorParameters = function() {
  return [
    { type: ElementRef },
    { type: void 0, decorators: [{ type: Attribute, args: ["name"] }] }
  ];
};
var NgxCardCvcTemplate = function() {
  function NgxCardCvcTemplate2(elementRef, name) {
    this.elementRef = elementRef;
    this.name = name;
  }
  NgxCardCvcTemplate2.prototype.ngOnInit = function() {
    this.name = this.name || uniqueId("cvc");
  };
  return NgxCardCvcTemplate2;
}();
NgxCardCvcTemplate.decorators = [
  { type: Directive, args: [{
    selector: "[card-cvc]",
    host: {
      "[name]": "name"
    }
  }] }
];
NgxCardCvcTemplate.ctorParameters = function() {
  return [
    { type: ElementRef },
    { type: void 0, decorators: [{ type: Attribute, args: ["name"] }] }
  ];
};

// node_modules/ngx-card/card.js
var defaultPlaceholders = {
  number: "•••• •••• •••• ••••",
  name: "Full Name",
  expiry: "••/••",
  cvc: "•••"
};
var defaultMessages = {
  validDate: "valid\nthru",
  monthYear: "month/year"
};
var NgxCard = function() {
  function NgxCard2(element) {
    this.element = element;
    this.formatting = true;
    this.debug = false;
  }
  Object.defineProperty(NgxCard2.prototype, "messages", {
    get: function() {
      return this._messages;
    },
    set: function(_messages) {
      this._messages = Object.assign({}, defaultMessages, _messages);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(NgxCard2.prototype, "placeholders", {
    get: function() {
      return this._placeholders;
    },
    set: function(_placeholders) {
      this._placeholders = Object.assign({}, defaultPlaceholders, _placeholders);
    },
    enumerable: true,
    configurable: true
  });
  NgxCard2.prototype.ngAfterViewInit = function() {
    new Card({
      form: this.element.nativeElement,
      container: this.container,
      width: this.width,
      formSelectors: {
        numberInput: this.findSelectors(this.numbers),
        expiryInput: this.findSelectors(this.expiries),
        cvcInput: this.findSelectors(this.cvcs),
        nameInput: this.findSelectors(this.names)
      },
      formatting: this.formatting,
      messages: this.messages,
      placeholders: this.placeholders,
      masks: this.masks,
      debug: this.debug
    });
  };
  NgxCard2.prototype.findSelectors = function(list) {
    return list.map(function(template) {
      return template.elementRef.nativeElement.tagName.toLowerCase() + '[name="' + template.name + '"]';
    }).join(", ");
  };
  return NgxCard2;
}();
NgxCard.decorators = [
  { type: Directive, args: [{
    selector: "[card]"
  }] }
];
NgxCard.ctorParameters = function() {
  return [
    { type: ElementRef }
  ];
};
NgxCard.propDecorators = {
  "container": [{ type: Input }],
  "width": [{ type: Input, args: ["card-width"] }],
  "messages": [{ type: Input }],
  "placeholders": [{ type: Input }],
  "masks": [{ type: Input }],
  "formatting": [{ type: Input }],
  "debug": [{ type: Input }],
  "numbers": [{ type: ContentChildren, args: [NgxCardNumberTemplate, { descendants: true }] }],
  "names": [{ type: ContentChildren, args: [NgxCardNameTemplate, { descendants: true }] }],
  "expiries": [{ type: ContentChildren, args: [NgxCardExpiryTemplate, { descendants: true }] }],
  "cvcs": [{ type: ContentChildren, args: [NgxCardCvcTemplate, { descendants: true }] }]
};

// node_modules/ngx-card/module.js
var CARD_DIRECTIVES = [
  NgxCard,
  NgxCardNumberTemplate,
  NgxCardNameTemplate,
  NgxCardExpiryTemplate,
  NgxCardCvcTemplate
];
var CardModule = /* @__PURE__ */ function() {
  function CardModule2() {
  }
  return CardModule2;
}();
CardModule.decorators = [
  { type: NgModule, args: [{
    declarations: [CARD_DIRECTIVES],
    exports: [CARD_DIRECTIVES]
  }] }
];
CardModule.ctorParameters = function() {
  return [];
};
export {
  CardModule
};
//# sourceMappingURL=ngx-card.js.map
