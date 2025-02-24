// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../resource.mjs";
import { isRequestOptions } from "../../core.mjs";
import { Page } from "../../pagination.mjs";
export class Models extends APIResource {
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
        if (isRequestOptions(query)) {
            return this.list({}, query);
        }
        return this._client.getAPIList('/v1/models?beta=true', BetaModelInfosPage, { query, ...options });
    }
}
export class BetaModelInfosPage extends Page {
}
Models.BetaModelInfosPage = BetaModelInfosPage;
//# sourceMappingURL=models.mjs.map