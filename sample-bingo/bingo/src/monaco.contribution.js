define(["require", "exports", "vs/editor/editor.main"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright 2018 (c) Huawei Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *  Copyright 2017 (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Emitter = monaco.Emitter;
    // --- TypeScript configuration and defaults, copied from monaco-typescript ---------
    var LanguageServiceDefaultsImpl = (function () {
        function LanguageServiceDefaultsImpl(compilerOptions, diagnosticsOptions) {
            this._onDidChange = new Emitter();
            this._extraLibs = Object.create(null);
            this._workerMaxIdleTime = 2 * 60 * 1000;
            this.setCompilerOptions(compilerOptions);
            this.setDiagnosticsOptions(diagnosticsOptions);
        }
        Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
            get: function () {
                return this._onDidChange.event;
            },
            enumerable: true,
            configurable: true
        });
        LanguageServiceDefaultsImpl.prototype.getExtraLibs = function () {
            var result = Object.create(null);
            for (var key in this._extraLibs) {
                result[key] = this._extraLibs[key];
            }
            return Object.freeze(result);
        };
        LanguageServiceDefaultsImpl.prototype.addExtraLib = function (content, filePath) {
            var _this = this;
            if (typeof filePath === 'undefined') {
                filePath = "bs:extralib-" + Date.now();
            }
            if (this._extraLibs[filePath]) {
                throw new Error(filePath + " already a extra lib");
            }
            this._extraLibs[filePath] = content;
            this._onDidChange.fire(this);
            return {
                dispose: function () {
                    if (delete _this._extraLibs[filePath]) {
                        _this._onDidChange.fire(_this);
                    }
                }
            };
        };
        LanguageServiceDefaultsImpl.prototype.getCompilerOptions = function () {
            return this._compilerOptions;
        };
        LanguageServiceDefaultsImpl.prototype.setCompilerOptions = function (options) {
            this._compilerOptions = options || Object.create(null);
            this._onDidChange.fire(this);
        };
        LanguageServiceDefaultsImpl.prototype.getDiagnosticsOptions = function () {
            return this._diagnosticsOptions;
        };
        LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
            this._diagnosticsOptions = options || Object.create(null);
            this._onDidChange.fire(this);
        };
        LanguageServiceDefaultsImpl.prototype.setMaximunWorkerIdleTime = function (value) {
            // doesn't fire an event since no
            // worker restart is required here
            this._workerMaxIdleTime = value;
        };
        LanguageServiceDefaultsImpl.prototype.getWorkerMaxIdleTime = function () {
            return this._workerMaxIdleTime;
        };
        LanguageServiceDefaultsImpl.prototype.setEagerModelSync = function (value) {
            // doesn't fire an event since no
            // worker restart is required here
            this._eagerModelSync = value;
        };
        LanguageServiceDefaultsImpl.prototype.getEagerModelSync = function () {
            return this._eagerModelSync;
        };
        return LanguageServiceDefaultsImpl;
    }());
    // exports.LanguageServiceDefaultsImpl = LanguageServiceDefaultsImpl;
    // --- BEGIN enums copied from typescript to prevent loading the entire typescriptServices ---
    // var ModuleKind;
    // (function (ModuleKind) {
    //     ModuleKind[ModuleKind["None"] = 0] = "None";
    //     ModuleKind[ModuleKind["CommonJS"] = 1] = "CommonJS";
    //     ModuleKind[ModuleKind["AMD"] = 2] = "AMD";
    //     ModuleKind[ModuleKind["UMD"] = 3] = "UMD";
    //     ModuleKind[ModuleKind["System"] = 4] = "System";
    //     ModuleKind[ModuleKind["ES2015"] = 5] = "ES2015";
    // })(ModuleKind || (ModuleKind = {}));
    // var JsxEmit;
    // (function (JsxEmit) {
    //     JsxEmit[JsxEmit["None"] = 0] = "None";
    //     JsxEmit[JsxEmit["Preserve"] = 1] = "Preserve";
    //     JsxEmit[JsxEmit["React"] = 2] = "React";
    // })(JsxEmit || (JsxEmit = {}));
    // var NewLineKind;
    // (function (NewLineKind) {
    //     NewLineKind[NewLineKind["CarriageReturnLineFeed"] = 0] = "CarriageReturnLineFeed";
    //     NewLineKind[NewLineKind["LineFeed"] = 1] = "LineFeed";
    // })(NewLineKind || (NewLineKind = {}));
    // var ScriptKind;
    // (function (ScriptKind) {
    //     ScriptKind[ScriptKind["Unknown"] = 0] = "Unknown";
    //     ScriptKind[ScriptKind["JS"] = 1] = "JS";
    //     ScriptKind[ScriptKind["JSX"] = 2] = "JSX";
    //     ScriptKind[ScriptKind["TS"] = 3] = "TS";
    //     ScriptKind[ScriptKind["TSX"] = 4] = "TSX";
    // })(ScriptKind || (ScriptKind = {}));
    // var ScriptTarget;
    // (function (ScriptTarget) {
    //     ScriptTarget[ScriptTarget["ES3"] = 0] = "ES3";
    //     ScriptTarget[ScriptTarget["ES5"] = 1] = "ES5";
    //     ScriptTarget[ScriptTarget["ES2015"] = 2] = "ES2015";
    //     ScriptTarget[ScriptTarget["ES2016"] = 3] = "ES2016";
    //     ScriptTarget[ScriptTarget["ES2017"] = 4] = "ES2017";
    //     ScriptTarget[ScriptTarget["ESNext"] = 5] = "ESNext";
    //     ScriptTarget[ScriptTarget["Latest"] = 5] = "Latest";
    // })(ScriptTarget || (ScriptTarget = {}));
    // var LanguageVariant;
    // (function (LanguageVariant) {
    //     LanguageVariant[LanguageVariant["Standard"] = 0] = "Standard";
    //     LanguageVariant[LanguageVariant["JSX"] = 1] = "JSX";
    // })(LanguageVariant || (LanguageVariant = {}));
    // var ModuleResolutionKind;
    // (function (ModuleResolutionKind) {
    //     ModuleResolutionKind[ModuleResolutionKind["Classic"] = 1] = "Classic";
    //     ModuleResolutionKind[ModuleResolutionKind["NodeJs"] = 2] = "NodeJs";
    // })(ModuleResolutionKind || (ModuleResolutionKind = {}));
    // // --- END enums copied from typescript to prevent loading the entire typescriptServices ---
    var bingoscriptDefaults = new LanguageServiceDefaultsImpl({ allowNonTsExtensions: true, target: monaco.languages.typescript.ScriptTarget.Latest }, { noSemanticValidation: false, noSyntaxValidation: false });
    // var javascriptDefaults = new LanguageServiceDefaultsImpl({ allowNonTsExtensions: true, allowJs: true, target: ScriptTarget.Latest }, { noSemanticValidation: true, noSyntaxValidation: false });
    // function getTypeScriptWorker() {
    //     return new monaco.Promise(function (resolve, reject) {
    //         withMode(function (mode) {
    //             mode.getTypeScriptWorker()
    //                 .then(resolve, reject);
    //         });
    //     });
    // }
    // function getJavaScriptWorker() {
    //     return new monaco.Promise(function (resolve, reject) {
    //         withMode(function (mode) {
    //             mode.getJavaScriptWorker()
    //                 .then(resolve, reject);
    //         });
    //     });
    // }
    function getBingoScriptWorker() {
        return new monaco.Promise(function (resolve, reject) {
            withMode(function (mode) {
                mode.getBingoScriptWorker()
                    .then(resolve, reject);
            });
        });
    }
    // // Export API
    // function createAPI() {
    //     return {
    //         ModuleKind: ModuleKind,
    //         JsxEmit: JsxEmit,
    //         NewLineKind: NewLineKind,
    //         ScriptTarget: ScriptTarget,
    //         ModuleResolutionKind: ModuleResolutionKind,
    //         typescriptDefaults: typescriptDefaults,
    //         getTypeScriptWorker: getTypeScriptWorker,
    //         getJavaScriptWorker: getJavaScriptWorker
    //     };
    // }
    // monaco.languages.typescript = createAPI();
    monaco.languages.typescript.getBingoScriptWorker = getBingoScriptWorker;
    monaco.languages.typescript.bingoScriptDefaults = bingoscriptDefaults;
    // --- Registration to monaco editor ---
    function withMode(callback) {
        // require(['vs/language/typescript/src/mode'], callback);
        require(['bingo/src/mode'], callback);
    }
    // monaco.languages.register({
    //     id: 'typescript',
    //     extensions: ['.ts', '.tsx'],
    //     aliases: ['TypeScript', 'ts', 'typescript'],
    //     mimetypes: ['text/typescript']
    // });
    // monaco.languages.onLanguage('typescript', function () {
    //     console.log('bingo')
    //     withMode(function (mode) { return mode.setupTypeScript(typescriptDefaults); });
    // });
    // monaco.languages.register({
    //     id: 'javascript',
    //     extensions: ['.js', '.es6', '.jsx'],
    //     firstLine: '^#!.*\\bnode',
    //     filenames: ['jakefile'],
    //     aliases: ['JavaScript', 'javascript', 'js'],
    //     mimetypes: ['text/javascript'],
    // });
    // monaco.languages.onLanguage('javascript', function () {
    //     withMode(function (mode) { return mode.setupJavaScript(javascriptDefaults); });
    // });
    monaco.languages.register({
        id: 'bingoscript',
        extensions: ['.bs'],
        aliases: ['BingoScript', 'bingoscript', 'bs'],
        mimetypes: ['text/bingoscript']
    });
    monaco.languages.onLanguage('bingoscript', function () {
        withMode(function (mode) { return mode.setupBingoScript(bingoscriptDefaults); });
    });
});
