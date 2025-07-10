import * as vscode from 'vscode';

export class ApiTreeProvider implements vscode.TreeDataProvider<number> {
  private _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter<undefined>();
  readonly onDidChangeTreeData: vscode.Event<undefined> = this._onDidChangeTreeData.event;

  // private tree: any[];
  private editor: vscode.TextEditor | undefined;

  constructor() {
    vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
    vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));
    this.onActiveEditorChanged();
  }

  refresh(): void {
    this.parseTree();
    this._onDidChangeTreeData.fire(undefined);
  }

  private onActiveEditorChanged(): void {
    if (vscode.window.activeTextEditor) {
      if (vscode.window.activeTextEditor.document.uri.scheme === 'file') {
        const enabled = vscode.window.activeTextEditor.document.languageId === 'markdown' || vscode.window.activeTextEditor.document.languageId === 'http';
        vscode.commands.executeCommand('setContext', 'apiExplorerDoEnabled', enabled);
        if (enabled) {
          this.refresh();
        }
      }
    } else {
      vscode.commands.executeCommand('setContext', 'apiExplorerDoEnabled', false);
    }
  }

  private onDocumentChanged(changeEvent: vscode.TextDocumentChangeEvent): void {
    // if (this.tree && this.autoRefresh && changeEvent.document.uri.toString() === this.editor?.document.uri.toString()) {
    //   for (const change of changeEvent.contentChanges) {
    //     const path = json.getLocation(this.text, this.editor.document.offsetAt(change.range.start)).path;
    //     path.pop();
    //     const node = path.length ? json.findNodeAtLocation(this.tree, path) : void 0;
    //     this.parseTree();
    //     this._onDidChangeTreeData.fire(node ? node.offset : void 0);
    //   }
    // }
  }

  private parseTree(): void {
    // this.tree = [];
    this.editor = vscode.window.activeTextEditor;
    if (this.editor && this.editor.document) {
      // this.text = this.editor.document.getText();
      // this.tree = json.parseTree(this.text);
    }
  }

  getChildren(offset?: number): Thenable<number[]> {
    // if (offset && this.tree) {
    //   const path = json.getLocation(this.text, offset).path;
    //   const node = json.findNodeAtLocation(this.tree, path);
    //   return Promise.resolve(this.getChildrenOffsets(node));
    // } else {
    //   return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
    // }
    return Promise.resolve([]);
  }

  getTreeItem(offset: number): vscode.TreeItem {
    // if (!this.tree) {
    //   throw new Error('Invalid tree');
    // }
    // if (!this.editor) {
    //   throw new Error('Invalid editor');
    // }

    // const path = json.getLocation(this.text, offset).path;
    // const valueNode = json.findNodeAtLocation(this.tree, path);
    // if (valueNode) {
    //   const hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
    //   const treeItem: vscode.TreeItem = new vscode.TreeItem(this.getLabel(valueNode), hasChildren ? valueNode.type === 'object' ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
    //   treeItem.command = {
    //     command: 'extension.openJsonSelection',
    //     title: '',
    //     arguments: [new vscode.Range(this.editor.document.positionAt(valueNode.offset), this.editor.document.positionAt(valueNode.offset + valueNode.length))]
    //   };
    //   treeItem.iconPath = this.getIcon(valueNode);
    //   treeItem.contextValue = valueNode.type;
    //   return treeItem;
    // }
    // throw (new Error(`Could not find json node at ${path}`));
    return new vscode.TreeItem('example', vscode.TreeItemCollapsibleState.None)
  }

  // private getIcon(node: json.Node): any {
  //   const nodeType = node.type;
  //   if (nodeType === 'boolean') {
  //     return {
  //       light: this.context.asAbsolutePath(path.join('resources', 'light', 'boolean.svg')),
  //       dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'boolean.svg'))
  //     };
  //   }
  //   if (nodeType === 'string') {
  //     return {
  //       light: this.context.asAbsolutePath(path.join('resources', 'light', 'string.svg')),
  //       dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'string.svg'))
  //     };
  //   }
  //   if (nodeType === 'number') {
  //     return {
  //       light: this.context.asAbsolutePath(path.join('resources', 'light', 'number.svg')),
  //       dark: this.context.asAbsolutePath(path.join('resources', 'dark', 'number.svg'))
  //     };
  //   }
  //   return null;
  // }

  // private getLabel(): string {
  //   if (node.parent?.type === 'array') {
  //     const prefix = node.parent.children?.indexOf(node).toString();
  //     if (node.type === 'object') {
  //       return prefix + ':{ }';
  //     }
  //     if (node.type === 'array') {
  //       return prefix + ':[ ]';
  //     }
  //     return prefix + ':' + node.value.toString();
  //   } else {
  //     const property = node.parent?.children ? node.parent.children[0].value.toString() : '';
  //     if (node.type === 'array' || node.type === 'object') {
  //       if (node.type === 'object') {
  //         return '{ } ' + property;
  //       }
  //       if (node.type === 'array') {
  //         return '[ ] ' + property;
  //       }
  //     }
  //     const value = this.editor?.document.getText(new vscode.Range(this.editor.document.positionAt(node.offset), this.editor.document.positionAt(node.offset + node.length)));
  //     return `${property}: ${value}`;
  //   }
  // }
}
