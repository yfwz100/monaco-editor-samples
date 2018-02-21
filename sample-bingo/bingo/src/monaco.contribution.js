define(["require", "exports", "vs/editor/editor.main"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
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
    var bingoscriptDefaults = new LanguageServiceDefaultsImpl({
        allowNonTsExtensions: true,
        target: monaco.languages.typescript.ScriptTarget.Latest
    }, {noSemanticValidation: false, noSyntaxValidation: false });

    // --- Registration to monaco editor ---
    monaco.languages.typescript.getBingoScriptWorker = getBingoScriptWorker;
    monaco.languages.typescript.bingoScriptDefaults = bingoscriptDefaults;
    monaco.languages.register({
        id: 'bingoscript',
        extensions: ['.bs'],
        aliases: ['BingoScript', 'bingoscript', 'bs'],
        mimetypes: ['text/bingoscript']
    });
    monaco.languages.onLanguage('bingoscript', function () {
        require(['bingo/src/mode'], function (mode) { return mode.setupBingoScript(bingoscriptDefaults); });
    });

    function getBingoScriptWorker() {
        return new monaco.Promise(function (resolve, reject) {
            withMode(function (mode) {
                mode.getBingoScriptWorker()
                    .then(resolve, reject);
            });
        });
    }
});
