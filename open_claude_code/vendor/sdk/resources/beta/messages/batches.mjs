// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../../resource.mjs";
import { isRequestOptions } from "../../../core.mjs";
import { Page } from "../../../pagination.mjs";
import { JSONLDecoder } from "../../../internal/decoders/jsonl.mjs";
import { AnthropicError } from "../../../error.mjs";
export class Batches extends APIResource {
    /**
     * Send a batch of Message creation requests.
     *
     * The Message Batches API can be used to process multiple Messages API requests at
     * once. Once a Message Batch is created, it begins processing immediately. Batches
     * can take up to 24 hours to complete.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    create(params, options) {
        const { betas, ...body } = params;
        return this._client.post('/v1/messages/batches?beta=true', {
            body,
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'message-batches-2024-09-24'].toString(),
                ...options?.headers,
            },
        });
    }
    retrieve(messageBatchId, params = {}, options) {
        if (isRequestOptions(params)) {
            return this.retrieve(messageBatchId, {}, params);
        }
        const { betas } = params;
        return this._client.get(`/v1/messages/batches/${messageBatchId}?beta=true`, {
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'message-batches-2024-09-24'].toString(),
                ...options?.headers,
            },
        });
    }
    list(params = {}, options) {
        if (isRequestOptions(params)) {
            return this.list({}, params);
        }
        const { betas, ...query } = params;
        return this._client.getAPIList('/v1/messages/batches?beta=true', BetaMessageBatchesPage, {
            query,
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'message-batches-2024-09-24'].toString(),
                ...options?.headers,
            },
        });
    }
    delete(messageBatchId, params = {}, options) {
        if (isRequestOptions(params)) {
            return this.delete(messageBatchId, {}, params);
        }
        const { betas } = params;
        return this._client.delete(`/v1/messages/batches/${messageBatchId}?beta=true`, {
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'message-batches-2024-09-24'].toString(),
                ...options?.headers,
            },
        });
    }
    cancel(messageBatchId, params = {}, options) {
        if (isRequestOptions(params)) {
            return this.cancel(messageBatchId, {}, params);
        }
        const { betas } = params;
        return this._client.post(`/v1/messages/batches/${messageBatchId}/cancel?beta=true`, {
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'message-batches-2024-09-24'].toString(),
                ...options?.headers,
            },
        });
    }
    async results(messageBatchId, params = {}, options) {
        if (isRequestOptions(params)) {
            return this.results(messageBatchId, {}, params);
        }
        const batch = await this.retrieve(messageBatchId);
        if (!batch.results_url) {
            throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
        }
        const { betas } = params;
        return this._client
            .get(batch.results_url, {
            ...options,
            headers: {
                'anthropic-beta': [...(betas ?? []), 'message-batches-2024-09-24'].toString(),
                Accept: 'application/binary',
                ...options?.headers,
            },
            __binaryResponse: true,
        })
            ._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
    }
}
export class BetaMessageBatchesPage extends Page {
}
Batches.BetaMessageBatchesPage = BetaMessageBatchesPage;
//# sourceMappingURL=batches.mjs.map