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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
const resource_1 = require("../../../resource.js");
const BatchesAPI = __importStar(require("./batches.js"));
const batches_1 = require("./batches.js");
const BetaMessageStream_1 = require("../../../lib/BetaMessageStream.js");
const DEPRECATED_MODELS = {
    'claude-1.3': 'November 6th, 2024',
    'claude-1.3-100k': 'November 6th, 2024',
    'claude-instant-1.1': 'November 6th, 2024',
    'claude-instant-1.1-100k': 'November 6th, 2024',
    'claude-instant-1.2': 'November 6th, 2024',
    'claude-3-sonnet-20240229': 'July 21st, 2025',
    'claude-2.1': 'July 21st, 2025',
    'claude-2.0': 'July 21st, 2025',
};
class Messages extends resource_1.APIResource {
    constructor() {
        super(...arguments);
        this.batches = new BatchesAPI.Batches(this._client);
    }
    create(params, options) {
        const { betas, ...body } = params;
        if (body.model in DEPRECATED_MODELS) {
            console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
        }
        return this._client.post('/v1/messages?beta=true', {
            body,
            timeout: this._client._options.timeout ?? 600000,
            ...options,
            headers: {
                ...(betas?.toString() != null ? { 'anthropic-beta': betas?.toString() } : undefined),
                ...options?.headers,
            },
            stream: params.stream ?? false,
        });
    }
    /**
     * Create a Message stream
     */
    stream(body, options) {
        return BetaMessageStream_1.BetaMessageStream.createMessage(this, body, options);
    }
    /**
     * Count the number of tokens in a Message.
     *
     * The Token Count API can be used to count the number of tokens in a Message,
     * including tools, images, and documents, without creating it.
     *
     * Learn more about token counting in our
     * [user guide](/en/docs/build-with-claude/token-counting)
     */
    countTokens(params, options) {
        const { betas, ...body } = params;
        return this._client.post('/v1/messages/count_tokens?beta=true', {
            body,
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'token-counting-2024-11-01'].toString(),
                ...options?.headers,
            },
        });
    }
}
exports.Messages = Messages;
Messages.Batches = batches_1.Batches;
Messages.BetaMessageBatchesPage = batches_1.BetaMessageBatchesPage;
//# sourceMappingURL=messages.js.map