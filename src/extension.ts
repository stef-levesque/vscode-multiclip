import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;
import Range = vscode.Range;

export function activate(context: vscode.ExtensionContext) {

	let bufSize = 10;
	var copyBuffer = new Array;
	var pasteIndex = 0;

	var disposables = [];
	disposables.push( vscode.commands.registerCommand('multiclip.clearBuffer', () => {
		copyBuffer = new Array;
		pasteIndex = 0;
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.copy', () => {
		let e = Window.activeTextEditor;
		let d = e.document;
		let sel = e.selection;

		let txt: string = d.getText(new Range(sel.start, sel.end));
		if (txt.trim().length > 0 && !copyBuffer.find(value=> value === txt)) {
			copyBuffer.unshift(txt);
			if (copyBuffer.length > bufSize){
				copyBuffer = copyBuffer.slice(0, bufSize);
			}
		}
		pasteIndex = 0;
		vscode.commands.executeCommand("editor.action.clipboardCopyAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.cut', () => {
		let e = Window.activeTextEditor;
		let d = e.document;
		let sel = e.selection;

		let txt: string = d.getText(new Range(sel.start, sel.end));
		if (txt.trim().length > 0 && !copyBuffer.find(value=> value === txt)) {
			copyBuffer.unshift(txt);
			if (copyBuffer.length > bufSize){
				copyBuffer = copyBuffer.slice(0, bufSize);
			}
		}
		pasteIndex = 0;
		vscode.commands.executeCommand("editor.action.clipboardCutAction");
	}));
	function doPaste(txt: string) {
		const e = Window.activeTextEditor;
		const d = e.document;
		e.edit(function (edit: vscode.TextEditorEdit) {
			e.selections.forEach(sel => {
				edit.replace(sel, txt);
			});
		}).then(() => {
			// Grab a copy of the current selection array
			const tmpSelections = e.selections;

			// Grab the current primary selection
			const sel = tmpSelections[ 0 ];

			// Change the current selection array to contain a single item
			// that encompasses the entire pasted block.
			e.selections = [ sel ];

			// Send the pasted value to the system clipboard.
			vscode.commands.executeCommand("editor.action.clipboardCopyAction")
				.then(() => {
					// Restore the previous selection(s)
					e.selections = tmpSelections;
				});
		});
	}
	disposables.push( vscode.commands.registerCommand('multiclip.paste', () => {
		if (copyBuffer.length == 0) {
			Window.setStatusBarMessage("Multiclip: Nothing to paste", 3000);
			return;
		}

		let e = Window.activeTextEditor;
		let d = e.document;

		let txt: string = d.getText(new Range(e.selection.start, e.selection.end));
		if (txt === copyBuffer[pasteIndex]) {
			pasteIndex = ++pasteIndex < copyBuffer.length ? pasteIndex : 0;
		}

		doPaste(copyBuffer[ pasteIndex ]);
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