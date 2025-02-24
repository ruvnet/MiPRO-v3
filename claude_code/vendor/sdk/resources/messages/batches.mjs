// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../resource.mjs";
import { isRequestOptions } from "../../core.mjs";
import { Page } from "../../pagination.mjs";
import { JSONLDecoder } from "../../internal/decoders/jsonl.mjs";
import { AnthropicError } from "../../error.mjs";
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
    create(body, options) {
        return this._client.post('/v1/messages/batches', { body, ...options });
    }
    /**
     * This endpoint is idempotent and can be used to poll for Message Batch
     * completion. To access the results of a Message Batch, make a request to the
     * `results_url` field in the response.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    retrieve(messageBatchId, options) {
        return this._client.get(`/v1/messages/batches/${messageBatchId}`, options);
    }
    list(query = {}, options) {
        if (isRequestOptions(query)) {
            return this.list({}, query);
        }
        return this._client.getAPIList('/v1/messages/batches', MessageBatchesPage, { query, ...options });
    }
    /**
     * Delete a Message Batch.
     *
     * Message Batches can only be deleted once they've finished processing. If you'd
     * like to delete an in-progress batch, you must first cancel it.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    delete(messageBatchId, options) {
        return this._client.delete(`/v1/messages/batches/${messageBatchId}`, options);
    }
    /**
     * Batches may be canceled any time before processing ends. Once cancellation is
     * initiated, the batch enters a `canceling` state, at which time the system may
     * complete any in-progress, non-interruptible requests before finalizing
     * cancellation.
     *
     * The number of canceled requests is specified in `request_counts`. To determine
     * which requests were canceled, check the individual results within the batch.
     * Note that cancellation may not result in any canceled requests if they were
     * non-interruptible.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    cancel(messageBatchId, options) {
        return this._client.post(`/v1/messages/batches/${messageBatchId}/cancel`, options);
    }
    /**
     * Streams the results of a Message Batch as a `.jsonl` file.
     *
     * Each line in the file is a JSON object containing the result of a single request
     * in the Message Batch. Results are not guaranteed to be in the same order as
     * requests. Use the `custom_id` field to match results to requests.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    async results(messageBatchId, options) {
        const batch = await this.retrieve(messageBatchId);
        if (!batch.results_url) {
            throw new AnthropicError(`No batch \`results_url\`; Has it finished processing? ${batch.processing_status} - ${batch.id}`);
        }
        return this._client
            .get(batch.results_url, {
            ...options,
            headers: {
                Accept: 'application/binary',
                ...options?.headers,
            },
            __binaryResponse: true,
        })
            ._thenUnwrap((_, props) => JSONLDecoder.fromResponse(props.response, props.controller));
    }
}
export class MessageBatchesPage extends Page {
}
Batches.MessageBatchesPage = MessageBatchesPage;
//# sourceMappingURL=batches.mjs.map