'use strict';
const { customMatchers } = require('./helpers');

describe('server', () => {

  const linter = require('ux-lint');
  const proxyquire = require('proxyquire').noCallThru();

  // Stub out the VSCode connection.
  const fakeConsole = jasmine.createSpyObj('console', ['error']);
  const connection = jasmine.createSpyObj('connection', [
    'console',
    'listen',
    'onInitialize',
    'sendDiagnostics'
  ]);
  connection.console.and.returnValue(fakeConsole);

  // Stub out the VSCode documents.
  const documents = jasmine.createSpyObj('documents', [
    'listen',
    'onDidChangeContent'
  ]);
  documents.syncKind = 'full';

  beforeAll(() => {
    jasmine.addMatchers(customMatchers);
  });

  beforeEach(() => {
    // Spy on the ux-lint module.
    spyOn(linter, 'checkCode').and.callThrough();

    // Load the module with the stubs.
    proxyquire('../server', {
      'ux-lint': linter,
      'vscode-languageserver': {
        createConnection: function() { return connection; },
        DiagnosticSeverity: { Error: 1, Warning: 2 },
        IPCMessageReader: function() {},
        IPCMessageWriter: function() {},
        TextDocuments: function() { return documents; },
      },
    });
  });

  it('should have the documents listen to the connection', () => {
    expect(documents.listen).toHaveBeenCalledWith(connection);
  });

  it('should set the connection initialization callback', () => {
    expect(connection.onInitialize).toHaveBeenCalled();
  });

  it('should set the documents change callback', () => {
    expect(documents.onDidChangeContent).toHaveBeenCalled();
  });

  it('should listen on the connection', () => {
    expect(connection.listen).toHaveBeenCalled();
  });

  describe('when the connection is initialized', () => {

    it('should return a request with the capabilities', () => {
      let callback = connection.onInitialize.calls.mostRecent().args[0];
      let req = callback();
      expect(req.capabilities.textDocumentSync).toBe(documents.syncKind);
    });

  });

  describe('when the document content changes', () => {

    const code = 'var x';
    const language = 'javascript';
    const uri = 'document URI';

    let change;

    beforeEach(done => {
      let callback = documents.onDidChangeContent.calls.mostRecent().args[0];
      connection.sendDiagnostics.and.callFake(done);
      change = {
        document: {
          getText: () => code,
          languageId: language,
          uri,
        }
      };
      callback(change);
    });

    it('should run the linter against the code, passing the appropriate language', () => {
      expect(linter.checkCode).toHaveBeenCalledWith(
        code,
        { language },
        jasmine.any(Function)
      );
    });

    it('should send diagnostics back to the client', () => {
      let {
        diagnostics: sentDiagnostics,
        uri: sentUri,
      } = connection.sendDiagnostics.calls.mostRecent().args[0];
      expect(sentUri).toBe(uri);
      expect(sentDiagnostics[0]).toBeDiagnostics();
    });

  });

});
