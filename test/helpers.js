'use strict';

function toBeConfigurationDefinition(util, customEqualityTesters) {
  return {
    compare: function(actual) {
      let result = { pass: true };
      if (typeof actual.type === 'undefined') { result.pass = false; }
      if (typeof actual.default === 'undefined') { result.pass = false; }
      if (typeof actual.description === 'undefined') { result.pass = false; }
      return result;
    }
  };
}

function toBeDiagnostics(util, customEqualityTesters) {
  return {
    compare: function(actual) {
      let result = { pass: true };
      if (typeof actual.code === 'undefined') { result.pass = false; }
      if (typeof actual.severity === 'undefined') { result.pass = false; }
      if (typeof actual.range === 'undefined') { result.pass = false; }
      if (typeof actual.range.start === 'undefined') { result.pass = false; }
      if (typeof actual.range.start.line === 'undefined') { result.pass = false; }
      if (typeof actual.range.start.character === 'undefined') { result.pass = false; }
      if (typeof actual.range.end === 'undefined') { result.pass = false; }
      if (typeof actual.range.end.line === 'undefined') { result.pass = false; }
      if (typeof actual.range.end.character === 'undefined') { result.pass = false; }
      if (typeof actual.message === 'undefined') { result.pass = false; }
      if (typeof actual.source === 'undefined') { result.pass = false; }
      if (!/^ux-lint/.test(actual.source)) { result.pass = false; }
      return result;
    }
  };
}

exports.customMatchers = {
  toBeConfigurationDefinition,
  toBeDiagnostics,
};
