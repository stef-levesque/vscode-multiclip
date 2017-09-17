# vscode-multiclip

[![GitHub issues](https://img.shields.io/github/issues/stef-levesque/vscode-multiclip.svg)](https://github.com/stef-levesque/vscode-multiclip/issues)
[![GitHub license button](https://img.shields.io/github/license/stef-levesque/vscode-multiclip.svg)](https://github.com/stef-levesque/vscode-multiclip/blob/master/LICENSE.md)

Multiple clipboards for Visual Studio Code

## Description

Override the regular `Copy` and `Cut` commands to keep selections in a clipboard ring. Also adds the
ability to copy several blocks of text into a single copy buffer.

## Commands

* Copy (`Cmd+c` on OSX or `Ctrl+c` on Windows and Linux)
* Merge-Copy (`Cmd+Shift+c` on OSX or `Ctrl+Shift+c` on Windows and Linux)
* Cut (`Cmd+x` on OSX or `Ctrl+x` on Windows and Linux)
* Merge-Cut (`Cmd+Shift+x` on OSX or `Ctrl+Shift+x` on Windows and Linux)
* Select clipboard to paste  (`Cmd+Alt+v` on OSX or `Ctrl+Alt+v` on Windows and Linux)
* Paste and cycle through clipboard items (`Cmd+Shift+v` on OSX or `Ctrl+Shift+v` on Windows and Linux)

## Configuration

* `multiclip.bufferSize` Maximum number of item to keep in the multiclip buffer
* `multiclip.formatAfterPaste` Specify if text should be formatted after pasting (disabled by default)

## Installation

1. Install *Visual Studio Code* (1.7.0 or higher)
2. Launch *Code*
3. From the command palette `Ctrl-Shift-P` (Windows, Linux) or `Cmd-Shift-P` (OSX)
4. Select `Install Extension`
5. Choose the extension `Multiple clipboards for VSCode`
6. Reload *Visual Studio Code*

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Requirements

Visual Studio Code 1.7

## Credits

* [Visual Studio Code](https://code.visualstudio.com/)
* [vscode-docs on GitHub](https://github.com/Microsoft/vscode-docs)

## License

[MIT](LICENSE.md)
