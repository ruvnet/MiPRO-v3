import { APIResource } from "../resource.js";
import * as Core from "../core.js";
import { Page, type PageParams } from "../pagination.js";
export declare class Models extends APIResource {
    /**
     * Get a specific model.
     *
     * The Models API response can be used to determine information about a specific
     * model or resolve a model alias to a model ID.
     */
    retrieve(modelId: string, options?: Core.RequestOptions): Core.APIPromise<ModelInfo>;
    /**
     * List available models.
     *
     * The Models API response can be used to determine which models are available for
     * use in the API. More recently released models are listed first.
     */
    list(query?: ModelListParams, options?: Core.RequestOptions): Core.PagePromise<ModelInfosPage, ModelInfo>;
    list(options?: Core.RequestOptions): Core.PagePromise<ModelInfosPage, ModelInfo>;
}
export declare class ModelInfosPage extends Page<ModelInfo> {
}
export interface ModelInfo {
    /**
     * Unique model identifier.
     */
    id: string;
    /**
     * RFC 3339 datetime string representing the time at which the model was released.
     * May be set to an epoch value if the release date is unknown.
     */
    created_at: string;
    /**
     * A human-readable name for the model.
     */
    display_name: string;
    /**
     * Object type.
     *
     * For Models, this is always `"model"`.
     */
    type: 'model';
}
export interface ModelListParams extends PageParams {
}
export declare namespace Models {
    export { type ModelInfo as ModelInfo, ModelInfosPage as ModelInfosPage, type ModelListParams as ModelListParams, };
}
//# sourceMappingURL=models.d.ts.map