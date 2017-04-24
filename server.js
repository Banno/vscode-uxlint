'use strict';

const {
  createConnection,
  DiagnosticSeverity,
  IPCMessageReader,
  IPCMessageWriter,
  TextDocuments
} = require('vscode-languageserver');
const linter = require('ux-lint');

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

// Create a simple text document manager.
// The text document manager supports full document sync only.
let documents = new TextDocuments();

// Make the text document manager listen on the connection
// for open, change and close text document events.
documents.listen(connection);

// After the server has started, the client sends an initialize request.
connection.onInitialize(params => {
  return {
    capabilities: {
      // Tell the client that the server works in FULL text document sync mode.
      textDocumentSync: documents.syncKind,
    }
  };
});

// The content of a text document has changed. This event is emitted
// when the text document is first opened or when its content has changed.
documents.onDidChangeContent(change => {
  let diagnostics = [];
  let code = change.document.getText();
  linter.checkCode(code, {
    language: change.document.languageId
  }, (err, lintErrors) => {
    if (err) {
      connection.console.error('Fatal error occurred when running ux-lint.');
      connection.console.error(err);
    } else {
      lintErrors.forEach(msg => {
        diagnostics.push({
          code: msg.code,
          severity: msg.type === 'error' ?
            DiagnosticSeverity.Error :
            DiagnosticSeverity.Warning,
          range: {
            start: { line: msg.line - 1, character: msg.character - 1 },
            end: { line: msg.line - 1, character: msg.character - 1 }
          },
          message: msg.description,
          source: `ux-lint ${msg.plugin}`
        });
      });
    }
    connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
  });
});

// Listen on the connection.
connection.listen();
