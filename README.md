# vscode-uxlint

VSCode extension for [ux-lint](https://github.com/Banno/ux-lint) linting of JS and HTML code.

**(This is not actually implemented yet.)** The extension uses the ux-lint module installed in the opened workspace folder. If ux-lint is installed elsewhere, you can configure the `path` option to point to it (see "Options" below).

## Installation

Go to the [Releases page](https://github.com/Banno/vscode-uxlint/releases) to download the VSIX file. Then install it through the VSCode Extensions panel, Command Palette, or command line -- see the [VSCode documentation](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix) for details.

## Options

**These options are not yet implemented.**

This extension contributes the following variables to the [settings](https://code.visualstudio.com/docs/customization/userandworkspace):

* `uxlint.enable`: Enable/disable linting. It is enabled by default.
* `uxlint.exclude`: File pattern, or array of file patterns, to ignore.
* `uxlint.options`: Linter options. Uses the default rules if not set. Can be either a string, pointing to a filename, or an object containing the rules.
* `uxlint.path`: Path to the ux-lint module. Defaults to `node_modules/ux-lint`.

## Development

* Press F5 (or use the Debug panel) in VSCode to launch the extension for testing.
* Run `npm start`, or press cmd+shift+b in VSCode, to manually start the server.

Please use the existing conventions when modifying the project. Use the `lint` and `test` npm scripts to check the code.

## Packaging & Publishing

You'll need the `vsce` tool installed. See the [VSCode documentation](https://code.visualstudio.com/docs/extensions/publish-extension) for details.

When a new release is ready:

1. Run `vsce package`.
2. Upload the VSIX file as a the release binary. See [Github's "Creating Releases" docs](https://help.github.com/articles/creating-releases/).
