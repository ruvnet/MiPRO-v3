// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { AbstractPage } from "./core.mjs";
export class Page extends AbstractPage {
    constructor(client, response, body, options) {
        super(client, response, body, options);
        this.data = body.data || [];
        this.has_more = body.has_more || false;
        this.first_id = body.first_id || null;
        this.last_id = body.last_id || null;
    }
    getPaginatedItems() {
        return this.data ?? [];
    }
    hasNextPage() {
        if (this.has_more === false) {
            return false;
        }
        return super.hasNextPage();
    }
    // @deprecated Please use `nextPageInfo()` instead
    nextPageParams() {
        const info = this.nextPageInfo();
        if (!info)
            return null;
        if ('params' in info)
            return info.params;
        const params = Object.fromEntries(info.url.searchParams);
        if (!Object.keys(params).length)
            return null;
        return params;
    }
    nextPageInfo() {
        if (this.options.query?.['before_id']) {
            // in reverse
            const firstId = this.first_id;
            if (!firstId) {
                return null;
            }
            return {
                params: {
                    before_id: firstId,
                },
            };
        }
        const cursor = this.last_id;
        if (!cursor) {
            return null;
        }
        return {
            params: {
                after_id: cursor,
            },
        };
    }
}
//# sourceMappingURL=pagination.mjs.map