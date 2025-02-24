"use strict";
// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetaModelInfosPage = exports.Models = void 0;
const resource_1 = require("../../resource.js");
const core_1 = require("../../core.js");
const pagination_1 = require("../../pagination.js");
class Models extends resource_1.APIResource {
    /**
     * Get a specific model.
     *
     * The Models API response can be used to determine information about a specific
     * model or resolve a model alias to a model ID.
     */
    retrieve(modelId, options) {
        return this._client.get(`/v1/models/${modelId}?beta=true`, options);
    }
    list(query = {}, options) {
        if ((0, core_1.isRequestOptions)(query)) {
            return this.list({}, query);
        }
        return this._client.getAPIList('/v1/models?beta=true', BetaModelInfosPage, { query, ...options });
    }
}
exports.Models = Models;
class BetaModelInfosPage extends pagination_1.Page {
}
exports.BetaModelInfosPage = BetaModelInfosPage;
Models.BetaModelInfosPage = BetaModelInfosPage;
//# sourceMappingURL=models.js.map