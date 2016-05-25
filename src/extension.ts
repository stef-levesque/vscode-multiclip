import * as vscode from 'vscode';
import Window = vscode.window;
import QuickPickItem = vscode.QuickPickItem;
import QuickPickOptions = vscode.QuickPickOptions;
import Range = vscode.Range;

export function activate(context: vscode.ExtensionContext) {

	let bufSize = 10;
	var copyBuffer = new Array;
	var pasteIndex = 0;

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
		newCopyBuf(Window.activeTextEditor,true);
		vscode.commands.executeCommand("editor.action.clipboardCopyAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.copy', () => {
		newCopyBuf(Window.activeTextEditor);
		vscode.commands.executeCommand("editor.action.clipboardCopyAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.cutMerge', () => {
		newCopyBuf(Window.activeTextEditor,true);
		vscode.commands.executeCommand("editor.action.clipboardCutAction");
	}));
	disposables.push( vscode.commands.registerCommand('multiclip.cut', () => {
		newCopyBuf(Window.activeTextEditor);
		vscode.commands.executeCommand("editor.action.clipboardCutAction");
	}));
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

		let sel = e.selections;
		e.edit( function(edit) {
			e.selections.forEach(sel => {
				let txt = copyBuffer[pasteIndex];
				edit.replace(sel, txt);
				//TODO: Put selection in clipboard
			});
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
			let e = Window.activeTextEditor;
			let d = e.document;
			let sel = e.selections;

			e.edit( function(edit) {
				e.selections.forEach(sel => {
					let txt = item.description;
					edit.replace(sel, txt);
					//TODO: Put selection in clipboard
				});
			});

		})

	}));

	context.subscriptions.concat(disposables);
}

export function deactivate() {
}