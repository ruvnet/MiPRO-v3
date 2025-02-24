"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Models = exports.ModelInfosPage = exports.Messages = exports.Completions = exports.Beta = void 0;
__exportStar(require("./shared.js"), exports);
var beta_1 = require("./beta/beta.js");
Object.defineProperty(exports, "Beta", { enumerable: true, get: function () { return beta_1.Beta; } });
var completions_1 = require("./completions.js");
Object.defineProperty(exports, "Completions", { enumerable: true, get: function () { return completions_1.Completions; } });
var messages_1 = require("./messages/messages.js");
Object.defineProperty(exports, "Messages", { enumerable: true, get: function () { return messages_1.Messages; } });
var models_1 = require("./models.js");
Object.defineProperty(exports, "ModelInfosPage", { enumerable: true, get: function () { return models_1.ModelInfosPage; } });
Object.defineProperty(exports, "Models", { enumerable: true, get: function () { return models_1.Models; } });
//# sourceMappingURL=index.js.map