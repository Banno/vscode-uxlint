'use strict';
const { customMatchers } = require('./helpers');

describe('client extension', () => {

  let clientName, clientOptions, serverOptions;

  // Stub out the VSCode stuff.
  const proxyquire = require('proxyquire').noCallThru();
  const disposable = {};
  function StubLanguageClient(...args) {
    [clientName, serverOptions, clientOptions] = args;
    this.start = jasmine.createSpy('start').and.returnValue(disposable);
  }
  const vscodeStub = {
    LanguageClient: StubLanguageClient,
    TransportKind: { ipc: {}}
  };

  // Load the things we are testing.
  const client = proxyquire('../client', {
    'vscode-languageclient': vscodeStub
  });
  const pkg = require('../package.json');

  beforeAll(() => {
    jasmine.addMatchers(customMatchers);
  });

  describe('activate()', () => {

    let context;

    beforeEach(() => {
      context = {
        asAbsolutePath: path => path,
        subscriptions: []
      };
      client.activate(context);
    });

    it('should create a "ux-lint" client', () => {
      expect(clientName).toBe('ux-lint');
    });

    it('should run the server.js module', () => {
      expect(serverOptions.run.module).toBe('server.js');
    });

    it('should operate on HTML and JS documents', () => {
      expect(clientOptions.documentSelector).toContain('html');
      expect(clientOptions.documentSelector).toContain('javascript');
    });

    it('should sync the "uxlint" configuration', () => {
      expect(clientOptions.synchronize.configurationSection).toBe('uxlint');
    });

    it('should subscribe to a disposable', () => {
      expect(context.subscriptions.length).toBe(1);
      expect(context.subscriptions[0]).toBe(disposable);
    });

  });

  describe('activation events', () => {

    it('should include HTML language activation', () => {
      expect(pkg.activationEvents).toContain('onLanguage:html');
    });

    it('should include JS language activation', () => {
      expect(pkg.activationEvents).toContain('onLanguage:javascript');
    });

  });

  describe('configuration', () => {

    const props = pkg.contributes.configuration.properties;

    it('should have an "enable" setting', () => {
      expect(props['uxlint.enable']).toBeConfigurationDefinition();
    });

    it('should have an "exclude" setting', () => {
      expect(props['uxlint.exclude']).toBeConfigurationDefinition();
    });

    it('should have an "options" setting', () => {
      expect(props['uxlint.options']).toBeConfigurationDefinition();
    });

    it('should have an "path" setting', () => {
      expect(props['uxlint.path']).toBeConfigurationDefinition();
    });

  });

});
