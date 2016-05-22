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

## Installation

1. Install *Visual Studio Code* (0.10.1 or higher)
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

Visual Studio Code v0.10.x (November 2015)

## Credits

* [Visual Studio Code](https://code.visualstudio.com/)
* [vscode-docs on GitHub](https://github.com/Microsoft/vscode-docs)

## License

[MIT](LICENSE.md)

---

## Change log

### [0.0.4] - 2016-03-27

#### New

* Add command to clear the clipboard items
* Add command to paste and cycle through clipboard items (solve issue #3)

### [0.0.3] - 2016-01-19

#### Changes

* Don't add same text or empty text to buffer (thanks @windwp)

### [0.0.2] - 2016-01-14

#### Fix

* Fix keybindings for Windows and Linux

### 0.0.1 - 2016-01-13

#### New

* Override the regular Copy and Cut commands to keep selections in a clipboard ring

[0.0.4]: https://github.com/stef-levesque/vscode-multiclip/compare/d499c99c9d66d22db6d6c43a94a9f4bd5966c756...87e65d1e542a398045ae7e005940b47bd6179647
[0.0.3]: https://github.com/stef-levesque/vscode-multiclip/compare/9d87335cf1c079a86bd21c53f33c9573afe6fb4a...7f174cbf6cf9540e846059f576fc4daad1a87136
[0.0.2]: https://github.com/stef-levesque/vscode-multiclip/compare/f5499ab2e7d1175f2ded691fe98fe3fc4e34704e...9d87335cf1c079a86bd21c53f33c9573afe6fb4a
