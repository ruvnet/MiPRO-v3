import { AbstractPage, Response, APIClient, FinalRequestOptions, PageInfo } from "./core.js";
export interface PageResponse<Item> {
    data: Array<Item>;
    has_more: boolean;
    first_id: string | null;
    last_id: string | null;
}
export interface PageParams {
    /**
     * Number of items per page.
     */
    limit?: number;
    before_id?: string;
    after_id?: string;
}
export declare class Page<Item> extends AbstractPage<Item> implements PageResponse<Item> {
    data: Array<Item>;
    has_more: boolean;
    first_id: string | null;
    last_id: string | null;
    constructor(client: APIClient, response: Response, body: PageResponse<Item>, options: FinalRequestOptions);
    getPaginatedItems(): Item[];
    hasNextPage(): boolean;
    nextPageParams(): Partial<PageParams> | null;
    nextPageInfo(): PageInfo | null;
}
//# sourceMappingURL=pagination.d.ts.map