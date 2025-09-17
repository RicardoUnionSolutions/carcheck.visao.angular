import {
  __commonJS
} from "./chunk-TXDUYLVM.js";

// node_modules/text-mask-core/dist/textMaskCore.js
var require_textMaskCore = __commonJS({
  "node_modules/text-mask-core/dist/textMaskCore.js"(exports, module) {
    !function(e, r) {
      "object" == typeof exports && "object" == typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define([], r) : "object" == typeof exports ? exports.textMaskCore = r() : e.textMaskCore = r();
    }(exports, function() {
      return function(e) {
        function r(n) {
          if (t[n]) return t[n].exports;
          var o = t[n] = { exports: {}, id: n, loaded: false };
          return e[n].call(o.exports, o, o.exports, r), o.loaded = true, o.exports;
        }
        var t = {};
        return r.m = e, r.c = t, r.p = "", r(0);
      }([function(e, r, t) {
        "use strict";
        function n(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        Object.defineProperty(r, "__esModule", { value: true });
        var o = t(3);
        Object.defineProperty(r, "conformToMask", { enumerable: true, get: function() {
          return n(o).default;
        } });
        var i = t(2);
        Object.defineProperty(r, "adjustCaretPosition", { enumerable: true, get: function() {
          return n(i).default;
        } });
        var a = t(5);
        Object.defineProperty(r, "createTextMaskInputElement", { enumerable: true, get: function() {
          return n(a).default;
        } });
      }, function(e, r) {
        "use strict";
        Object.defineProperty(r, "__esModule", { value: true }), r.placeholderChar = "_", r.strFunction = "function";
      }, function(e, r) {
        "use strict";
        function t(e2) {
          var r2 = e2.previousConformedValue, t2 = void 0 === r2 ? o : r2, i = e2.previousPlaceholder, a = void 0 === i ? o : i, u = e2.currentCaretPosition, l = void 0 === u ? 0 : u, s = e2.conformedValue, f = e2.rawValue, d = e2.placeholderChar, c = e2.placeholder, p = e2.indexesOfPipedChars, v = void 0 === p ? n : p, h = e2.caretTrapIndexes, m = void 0 === h ? n : h;
          if (0 === l || !f.length) return 0;
          var y = f.length, g = t2.length, b = c.length, C = s.length, P = y - g, k = P > 0, x = 0 === g, O = P > 1 && !k && !x;
          if (O) return l;
          var T = k && (t2 === s || s === c), w = 0, M = void 0, S = void 0;
          if (T) w = l - P;
          else {
            var j = s.toLowerCase(), _ = f.toLowerCase(), V = _.substr(0, l).split(o), A = V.filter(function(e3) {
              return j.indexOf(e3) !== -1;
            });
            S = A[A.length - 1];
            var N = a.substr(0, A.length).split(o).filter(function(e3) {
              return e3 !== d;
            }).length, E = c.substr(0, A.length).split(o).filter(function(e3) {
              return e3 !== d;
            }).length, F = E !== N, R = void 0 !== a[A.length - 1] && void 0 !== c[A.length - 2] && a[A.length - 1] !== d && a[A.length - 1] !== c[A.length - 1] && a[A.length - 1] === c[A.length - 2];
            !k && (F || R) && N > 0 && c.indexOf(S) > -1 && void 0 !== f[l] && (M = true, S = f[l]);
            for (var I = v.map(function(e3) {
              return j[e3];
            }), J = I.filter(function(e3) {
              return e3 === S;
            }).length, W = A.filter(function(e3) {
              return e3 === S;
            }).length, q = c.substr(0, c.indexOf(d)).split(o).filter(function(e3, r3) {
              return e3 === S && f[r3] !== e3;
            }).length, L = q + W + J + (M ? 1 : 0), z = 0, B = 0; B < C; B++) {
              var D = j[B];
              if (w = B + 1, D === S && z++, z >= L) break;
            }
          }
          if (k) {
            for (var G = w, H = w; H <= b; H++) if (c[H] === d && (G = H), c[H] === d || m.indexOf(H) !== -1 || H === b) return G;
          } else if (M) {
            for (var K = w - 1; K >= 0; K--) if (s[K] === S || m.indexOf(K) !== -1 || 0 === K) return K;
          } else for (var Q = w; Q >= 0; Q--) if (c[Q - 1] === d || m.indexOf(Q) !== -1 || 0 === Q) return Q;
        }
        Object.defineProperty(r, "__esModule", { value: true }), r.default = t;
        var n = [], o = "";
      }, function(e, r, t) {
        "use strict";
        function n() {
          var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : l, r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : u, t2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
          if (!(0, i.isArray)(r2)) {
            if (("undefined" == typeof r2 ? "undefined" : o(r2)) !== a.strFunction) throw new Error("Text-mask:conformToMask; The mask property must be an array.");
            r2 = r2(e2, t2), r2 = (0, i.processCaretTraps)(r2).maskWithoutCaretTraps;
          }
          var n2 = t2.guide, s = void 0 === n2 || n2, f = t2.previousConformedValue, d = void 0 === f ? l : f, c = t2.placeholderChar, p = void 0 === c ? a.placeholderChar : c, v = t2.placeholder, h = void 0 === v ? (0, i.convertMaskToPlaceholder)(r2, p) : v, m = t2.currentCaretPosition, y = t2.keepCharPositions, g = s === false && void 0 !== d, b = e2.length, C = d.length, P = h.length, k = r2.length, x = b - C, O = x > 0, T = m + (O ? -x : 0), w = T + Math.abs(x);
          if (y === true && !O) {
            for (var M = l, S = T; S < w; S++) h[S] === p && (M += p);
            e2 = e2.slice(0, T) + M + e2.slice(T, b);
          }
          for (var j = e2.split(l).map(function(e3, r3) {
            return { char: e3, isNew: r3 >= T && r3 < w };
          }), _ = b - 1; _ >= 0; _--) {
            var V = j[_].char;
            if (V !== p) {
              var A = _ >= T && C === k;
              V === h[A ? _ - x : _] && j.splice(_, 1);
            }
          }
          var N = l, E = false;
          e: for (var F = 0; F < P; F++) {
            var R = h[F];
            if (R === p) {
              if (j.length > 0) for (; j.length > 0; ) {
                var I = j.shift(), J = I.char, W = I.isNew;
                if (J === p && g !== true) {
                  N += p;
                  continue e;
                }
                if (r2[F].test(J)) {
                  if (y === true && W !== false && d !== l && s !== false && O) {
                    for (var q = j.length, L = null, z = 0; z < q; z++) {
                      var B = j[z];
                      if (B.char !== p && B.isNew === false) break;
                      if (B.char === p) {
                        L = z;
                        break;
                      }
                    }
                    null !== L ? (N += J, j.splice(L, 1)) : F--;
                  } else N += J;
                  continue e;
                }
                E = true;
              }
              g === false && (N += h.substr(F, P));
              break;
            }
            N += R;
          }
          if (g && O === false) {
            for (var D = null, G = 0; G < N.length; G++) h[G] === p && (D = G);
            N = null !== D ? N.substr(0, D + 1) : l;
          }
          return { conformedValue: N, meta: { someCharsRejected: E } };
        }
        Object.defineProperty(r, "__esModule", { value: true });
        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
          return typeof e2;
        } : function(e2) {
          return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
        };
        r.default = n;
        var i = t(4), a = t(1), u = [], l = "";
      }, function(e, r, t) {
        "use strict";
        function n() {
          var e2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : f, r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : s.placeholderChar;
          if (!o(e2)) throw new Error("Text-mask:convertMaskToPlaceholder; The mask property must be an array.");
          if (e2.indexOf(r2) !== -1) throw new Error("Placeholder character must not be used as part of the mask. Please specify a character that is not present in your mask as your placeholder character.\n\n" + ("The placeholder character that was received is: " + JSON.stringify(r2) + "\n\n") + ("The mask that was received is: " + JSON.stringify(e2)));
          return e2.map(function(e3) {
            return e3 instanceof RegExp ? r2 : e3;
          }).join("");
        }
        function o(e2) {
          return Array.isArray && Array.isArray(e2) || e2 instanceof Array;
        }
        function i(e2) {
          return "string" == typeof e2 || e2 instanceof String;
        }
        function a(e2) {
          return "number" == typeof e2 && void 0 === e2.length && !isNaN(e2);
        }
        function u(e2) {
          return "undefined" == typeof e2 || null === e2;
        }
        function l(e2) {
          for (var r2 = [], t2 = void 0; t2 = e2.indexOf(d), t2 !== -1; ) r2.push(t2), e2.splice(t2, 1);
          return { maskWithoutCaretTraps: e2, indexes: r2 };
        }
        Object.defineProperty(r, "__esModule", { value: true }), r.convertMaskToPlaceholder = n, r.isArray = o, r.isString = i, r.isNumber = a, r.isNil = u, r.processCaretTraps = l;
        var s = t(1), f = [], d = "[]";
      }, function(e, r, t) {
        "use strict";
        function n(e2) {
          return e2 && e2.__esModule ? e2 : { default: e2 };
        }
        function o(e2) {
          var r2 = { previousConformedValue: void 0, previousPlaceholder: void 0 };
          return { state: r2, update: function(t2) {
            var n2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : e2, o2 = n2.inputElement, s2 = n2.mask, d2 = n2.guide, m2 = n2.pipe, g2 = n2.placeholderChar, b2 = void 0 === g2 ? v.placeholderChar : g2, C = n2.keepCharPositions, P = void 0 !== C && C, k = n2.showMask, x = void 0 !== k && k;
            if ("undefined" == typeof t2 && (t2 = o2.value), t2 !== r2.previousConformedValue) {
              ("undefined" == typeof s2 ? "undefined" : l(s2)) === y && void 0 !== s2.pipe && void 0 !== s2.mask && (m2 = s2.pipe, s2 = s2.mask);
              var O = void 0, T = void 0;
              if (s2 instanceof Array && (O = (0, p.convertMaskToPlaceholder)(s2, b2)), s2 !== false) {
                var w = a(t2), M = o2.selectionEnd, S = r2.previousConformedValue, j = r2.previousPlaceholder, _ = void 0;
                if (("undefined" == typeof s2 ? "undefined" : l(s2)) === v.strFunction) {
                  if (T = s2(w, { currentCaretPosition: M, previousConformedValue: S, placeholderChar: b2 }), T === false) return;
                  var V = (0, p.processCaretTraps)(T), A = V.maskWithoutCaretTraps, N = V.indexes;
                  T = A, _ = N, O = (0, p.convertMaskToPlaceholder)(T, b2);
                } else T = s2;
                var E = { previousConformedValue: S, guide: d2, placeholderChar: b2, pipe: m2, placeholder: O, currentCaretPosition: M, keepCharPositions: P }, F = (0, c.default)(w, T, E), R = F.conformedValue, I = ("undefined" == typeof m2 ? "undefined" : l(m2)) === v.strFunction, J = {};
                I && (J = m2(R, u({ rawValue: w }, E)), J === false ? J = { value: S, rejected: true } : (0, p.isString)(J) && (J = { value: J }));
                var W = I ? J.value : R, q = (0, f.default)({ previousConformedValue: S, previousPlaceholder: j, conformedValue: W, placeholder: O, rawValue: w, currentCaretPosition: M, placeholderChar: b2, indexesOfPipedChars: J.indexesOfPipedChars, caretTrapIndexes: _ }), L = W === O && 0 === q, z = x ? O : h, B = L ? z : W;
                r2.previousConformedValue = B, r2.previousPlaceholder = O, o2.value !== B && (o2.value = B, i(o2, q));
              }
            }
          } };
        }
        function i(e2, r2) {
          document.activeElement === e2 && (g ? b(function() {
            return e2.setSelectionRange(r2, r2, m);
          }, 0) : e2.setSelectionRange(r2, r2, m));
        }
        function a(e2) {
          if ((0, p.isString)(e2)) return e2;
          if ((0, p.isNumber)(e2)) return String(e2);
          if (void 0 === e2 || null === e2) return h;
          throw new Error("The 'value' provided to Text Mask needs to be a string or a number. The value received was:\n\n " + JSON.stringify(e2));
        }
        Object.defineProperty(r, "__esModule", { value: true });
        var u = Object.assign || function(e2) {
          for (var r2 = 1; r2 < arguments.length; r2++) {
            var t2 = arguments[r2];
            for (var n2 in t2) Object.prototype.hasOwnProperty.call(t2, n2) && (e2[n2] = t2[n2]);
          }
          return e2;
        }, l = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e2) {
          return typeof e2;
        } : function(e2) {
          return e2 && "function" == typeof Symbol && e2.constructor === Symbol && e2 !== Symbol.prototype ? "symbol" : typeof e2;
        };
        r.default = o;
        var s = t(2), f = n(s), d = t(3), c = n(d), p = t(4), v = t(1), h = "", m = "none", y = "object", g = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent), b = "undefined" != typeof requestAnimationFrame ? requestAnimationFrame : setTimeout;
      }]);
    });
  }
});
export default require_textMaskCore();
//# sourceMappingURL=text-mask-core.js.map
