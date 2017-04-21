'use strict';

const path = require('path');

const { LanguageClient, TransportKind } = require('vscode-languageclient');

function activate(context) {
  let serverModule = context.asAbsolutePath('server.js');
  let debugOptions = { execArgv: ['--nolazy', '--debug=6009'] };

  // If the extension is launched in debug mode then the debug server options are used.
  // Otherwise the run options are used.
  let serverOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
  };

  // Options to control the language client.
  let clientOptions = {
    documentSelector: ['html', 'javascript'],
    synchronize: {
      // Synchronize the setting section 'uxlint' to the server.
      configurationSection: 'uxlint',
    }
  };

  // Create the language client and start the client.
  let disposable = new LanguageClient('ux-lint', serverOptions, clientOptions).start();

  // Push the disposable to the context's subscriptions so that the
  //   client can be deactivated on extension deactivation.
  context.subscriptions.push(disposable);
}

exports.activate = activate;
