import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;
import Range = vscode.Range;

export function activate(context: vscode.ExtensionContext) {

	let config = vscode.workspace.getConfiguration('multiclip');
	let formatAfterPaste = config.get('formatAfterPaste', false);
	let bufSize = config.get('bufferSize', 10);
	var copyBuffer = new Array;
	var pasteIndex = 0;
	var lastRange;

	function newCopyBuf(e:vscode.TextEditor,merge:boolean=false) : string {
		let d:vscode.TextDocument = e.document;
		let sel = e.selection;
		let txt: string = d.getText(new Range(sel.start, sel.end));

		// A copy of a zero length line means copy the whole line.
		if (txt.length === 0) {
			let eol;
			try {
				const files = vscode.workspace.getConfiguration("files");
				eol = files.get("eol","\n");
			} catch (e) {
				eol = "\n";
			}
			txt = d.lineAt(sel.start.line).text + eol ;
		}

		if (merge) {
			if (copyBuffer.length===0) {
				copyBuffer.push("");
			}
			copyBuffer[0] += txt;
		} else {
			if (txt.trim().length > 0 && !copyBuffer.find(value=> value === txt)) {
				copyBuffer.unshift(txt);
				if (copyBuffer.length > bufSize){
					copyBuffer = copyBuffer.slice(0, bufSize);
				}
			}
		}
		pasteIndex = 0;
		return txt;
	}

	var disposables = [];
	disposables.push( vscode.commands.registerCommand('multiclip.clearBuffer', () => {
		copyBuffer = new Array;
		pasteIndex = 0;
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.copyMerge', () => {
		let editor = Window.activeTextEditor;
		if (editor) {
			newCopyBuf(Window.activeTextEditor,true);
		}
		vscode.commands.executeCommand("editor.action.clipboardCopyAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.copy', () => {
		let editor = Window.activeTextEditor;
		if (editor) {
			newCopyBuf(Window.activeTextEditor);
		}
		vscode.commands.executeCommand("editor.action.clipboardCopyAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.cutMerge', () => {
		let editor = Window.activeTextEditor;
		if (editor) {
			newCopyBuf(Window.activeTextEditor,true);
		}
		vscode.commands.executeCommand("editor.action.clipboardCutAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.cut', () => {
		let editor = Window.activeTextEditor;
		if (editor) {
			newCopyBuf(Window.activeTextEditor);
		}
		vscode.commands.executeCommand("editor.action.clipboardCutAction");
	}));

	function doPaste(txt: string) {
		const e = Window.activeTextEditor;
		const d = e ? e.document : null;
		if (!e || !d) {
			return;
		}

		e.edit(function (edit: vscode.TextEditorEdit) {
			e.selections.forEach(sel => {
				edit.replace(sel, txt);
			});
		}).then(() => {
			setTimeout(() => {
				// Grab a copy of the current selection array
				const tmpSelections = e.selections;

				// Grab the current primary selection
				const sel = tmpSelections[0];

				// Change the current selection array to contain a single item
				// that encompasses the entire pasted block.
				e.selections = [sel];

				// Send the pasted value to the system clipboard.
				vscode.commands.executeCommand("editor.action.clipboardCopyAction").then(() => {
					setTimeout(() => {
						// Restore the previous selection(s)
						e.selections = tmpSelections;

						// Format the selection, if enabled
						if (formatAfterPaste) {
							vscode.commands.executeCommand("editor.action.formatSelection").then(() => {
								setTimeout(function () {
									lastRange = new Range(e.selection.start, e.selection.end);
								}, 100);
							});
						}
						else {
							lastRange = new Range(e.selection.start, e.selection.end);
						}
					}, 100);
				});
			}, 100);
		});
	}

	disposables.push( vscode.commands.registerCommand('multiclip.paste', () => {
		if (copyBuffer.length == 0) {
			Window.setStatusBarMessage("Multiclip: Nothing to paste", 3000);
			return;
		}

		let e = Window.activeTextEditor;
		if (!e) {
			return;
		}

		let newRange = new Range(e.selection.start, e.selection.end);
		if (lastRange && newRange.isEqual(lastRange)) {
			pasteIndex = ++pasteIndex < copyBuffer.length ? pasteIndex : 0;
		}

		doPaste(copyBuffer[ pasteIndex ]);
	}));

	disposables.push( vscode.commands.registerCommand('multiclip.regularPaste', () => {
		vscode.commands.executeCommand("editor.action.clipboardPasteAction")
			.then(() => {
				let e = Window.activeTextEditor;
				if (formatAfterPaste && e) {
					var start = e.selection.anchor;
					var end = e.selection.anchor;
					var selection = new vscode.Selection(start.line, start.character, end.line, end.character);
					Window.activeTextEditor.selection = selection;
					vscode.commands.executeCommand("editor.action.formatSelection").then(function () {
						setTimeout(function () {
							let newPos = Window.activeTextEditor.selection.active;
							Window.activeTextEditor.selection = new vscode.Selection(newPos, newPos);
						}, 100);
					});
				}
			});
	}));

	disposables.push( vscode.commands.registerCommand('multiclip.list', () => {
		if (copyBuffer.length == 0) {
			Window.setStatusBarMessage("Multiclip: Nothing to paste", 3000);
			return;
		}

		var opts: QuickPickOptions = { matchOnDescription: true, placeHolder: "What to paste" };
		var items: QuickPickItem[] = [];


		for (var i=0; i<copyBuffer.length; i++){
			items.push({ label: (i+1).toString(), description: copyBuffer[i]});
		};

		Window.showQuickPick(items).then( (item) => {
			if (!item) {
				return;
			}
			
			doPaste(item.description);
		})

	}));

	context.subscriptions.concat(disposables);
}

export function deactivate() {
}