# VSCode ux-lint extension

Integrates [ux-lint](https://github.com/Banno/ux-lint) into VSCode.

**(This is not actually implemented yet.)** The extension uses the ux-lint module installed in the opened workspace folder. If ux-lint is installed elsewhere, you can configure the `path` option to point to it (see "Options" below).

## Options

**These options are not yet implemented.**

This extension contributes the following variables to the [settings](https://code.visualstudio.com/docs/customization/userandworkspace):

* `uxlint.enable`: Enable/disable linting. It is enabled by default.
* `uxlint.exclude`: File pattern, or array of file patterns, to ignore.
* `uxlint.options`: Linter options. Uses the default rules if not set. Can be either a string, pointing to a filename, or an object containing the rules.
* `uxlint.path`: Path to the ux-lint module. Defaults to `node_modules/ux-lint`.

## Development

Use the Debug panel (cmd+shift+d) in VSCode to launch the extension for testing.

Please use the existing conventions when modifying the project. Use the `lint` and `test` npm scripts to check the code.
