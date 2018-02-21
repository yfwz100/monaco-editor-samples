define(["require", "exports", "./tokenization", "./workerManager", "./languageFeatures"], function (require, exports, tokenization, workerManager, languageFeatures) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var bingoScriptWorker;
    function setupBingoScript(defaults) {
        bingoScriptWorker = setupMode(defaults, 'bingoscript', tokenization.Language.TypeScript);
    }
    exports.setupBingoScript = setupBingoScript;
    function getBingoScriptWorker() {
        return new monaco.Promise(function (resolve, reject) {
            if (!bingoScriptWorker) {
                return reject("BingoScript not registered!");
            }
            resolve(bingoScriptWorker);
        });
    }
    exports.getBingoScriptWorker = getBingoScriptWorker;
    function setupMode(defaults, modeId, language) {
        var disposables = [];
        var client = new workerManager.WorkerManager(modeId, defaults);
        disposables.push(client);
        var worker = function (first) {
            var more = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                more[_i - 1] = arguments[_i];
            }
            return client.getLanguageServiceWorker.apply(client, [first].concat(more));
        };
        disposables.push(monaco.languages.registerCompletionItemProvider(modeId, new languageFeatures.SuggestAdapter(worker)));
        disposables.push(monaco.languages.registerSignatureHelpProvider(modeId, new languageFeatures.SignatureHelpAdapter(worker)));
        disposables.push(monaco.languages.registerHoverProvider(modeId, new languageFeatures.QuickInfoAdapter(worker)));
        disposables.push(monaco.languages.registerDocumentHighlightProvider(modeId, new languageFeatures.OccurrencesAdapter(worker)));
        disposables.push(monaco.languages.registerDefinitionProvider(modeId, new languageFeatures.DefinitionAdapter(worker)));
        disposables.push(monaco.languages.registerReferenceProvider(modeId, new languageFeatures.ReferenceAdapter(worker)));
        disposables.push(monaco.languages.registerDocumentSymbolProvider(modeId, new languageFeatures.OutlineAdapter(worker)));
        disposables.push(monaco.languages.registerDocumentRangeFormattingEditProvider(modeId, new languageFeatures.FormatAdapter(worker)));
        disposables.push(monaco.languages.registerOnTypeFormattingEditProvider(modeId, new languageFeatures.FormatOnTypeAdapter(worker)));
        disposables.push(new languageFeatures.DiagnostcsAdapter(defaults, modeId, worker));
        disposables.push(monaco.languages.setLanguageConfiguration(modeId, richEditConfiguration));
        disposables.push(monaco.languages.setTokensProvider(modeId, tokenization.createTokenizationSupport(language)));
        return worker;
    }
    var richEditConfiguration = {
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        onEnterRules: [
            {
                // e.g. /** | */
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                afterText: /^\s*\*\/$/,
                action: { indentAction: monaco.languages.IndentAction.IndentOutdent, appendText: ' * ' }
            },
            {
                // e.g. /** ...|
                beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
                action: { indentAction: monaco.languages.IndentAction.None, appendText: ' * ' }
            },
            {
                // e.g.  * ...|
                beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
                action: { indentAction: monaco.languages.IndentAction.None, appendText: '* ' }
            },
            {
                // e.g.  */|
                beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
                action: { indentAction: monaco.languages.IndentAction.None, removeText: 1 }
            }
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"', notIn: ['string'] },
            { open: '\'', close: '\'', notIn: ['string', 'comment'] },
            { open: '`', close: '`', notIn: ['string', 'comment'] },
            { open: "/**", close: " */", notIn: ["string"] }
        ]
    };
});
