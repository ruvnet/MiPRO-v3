import { APIResource } from "../../resource.js";
import * as Core from "../../core.js";
import * as Shared from "../shared.js";
import * as MessagesAPI from "./messages.js";
import { Page, type PageParams } from "../../pagination.js";
import { JSONLDecoder } from "../../internal/decoders/jsonl.js";
export declare class Batches extends APIResource {
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
    create(body: BatchCreateParams, options?: Core.RequestOptions): Core.APIPromise<MessageBatch>;
    /**
     * This endpoint is idempotent and can be used to poll for Message Batch
     * completion. To access the results of a Message Batch, make a request to the
     * `results_url` field in the response.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    retrieve(messageBatchId: string, options?: Core.RequestOptions): Core.APIPromise<MessageBatch>;
    /**
     * List all Message Batches within a Workspace. Most recently created batches are
     * returned first.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    list(query?: BatchListParams, options?: Core.RequestOptions): Core.PagePromise<MessageBatchesPage, MessageBatch>;
    list(options?: Core.RequestOptions): Core.PagePromise<MessageBatchesPage, MessageBatch>;
    /**
     * Delete a Message Batch.
     *
     * Message Batches can only be deleted once they've finished processing. If you'd
     * like to delete an in-progress batch, you must first cancel it.
     *
     * Learn more about the Message Batches API in our
     * [user guide](/en/docs/build-with-claude/batch-processing)
     */
    delete(messageBatchId: string, options?: Core.RequestOptions): Core.APIPromise<DeletedMessageBatch>;
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
    cancel(messageBatchId: string, options?: Core.RequestOptions): Core.APIPromise<MessageBatch>;
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
    results(messageBatchId: string, options?: Core.RequestOptions): Promise<JSONLDecoder<MessageBatchIndividualResponse>>;
}
export declare class MessageBatchesPage extends Page<MessageBatch> {
}
export interface DeletedMessageBatch {
    /**
     * ID of the Message Batch.
     */
    id: string;
    /**
     * Deleted object type.
     *
     * For Message Batches, this is always `"message_batch_deleted"`.
     */
    type: 'message_batch_deleted';
}
export interface MessageBatch {
    /**
     * Unique object identifier.
     *
     * The format and length of IDs may change over time.
     */
    id: string;
    /**
     * RFC 3339 datetime string representing the time at which the Message Batch was
     * archived and its results became unavailable.
     */
    archived_at: string | null;
    /**
     * RFC 3339 datetime string representing the time at which cancellation was
     * initiated for the Message Batch. Specified only if cancellation was initiated.
     */
    cancel_initiated_at: string | null;
    /**
     * RFC 3339 datetime string representing the time at which the Message Batch was
     * created.
     */
    created_at: string;
    /**
     * RFC 3339 datetime string representing the time at which processing for the
     * Message Batch ended. Specified only once processing ends.
     *
     * Processing ends when every request in a Message Batch has either succeeded,
     * errored, canceled, or expired.
     */
    ended_at: string | null;
    /**
     * RFC 3339 datetime string representing the time at which the Message Batch will
     * expire and end processing, which is 24 hours after creation.
     */
    expires_at: string;
    /**
     * Processing status of the Message Batch.
     */
    processing_status: 'in_progress' | 'canceling' | 'ended';
    /**
     * Tallies requests within the Message Batch, categorized by their status.
     *
     * Requests start as `processing` and move to one of the other statuses only once
     * processing of the entire batch ends. The sum of all values always matches the
     * total number of requests in the batch.
     */
    request_counts: MessageBatchRequestCounts;
    /**
     * URL to a `.jsonl` file containing the results of the Message Batch requests.
     * Specified only once processing ends.
     *
     * Results in the file are not guaranteed to be in the same order as requests. Use
     * the `custom_id` field to match results to requests.
     */
    results_url: string | null;
    /**
     * Object type.
     *
     * For Message Batches, this is always `"message_batch"`.
     */
    type: 'message_batch';
}
export interface MessageBatchCanceledResult {
    type: 'canceled';
}
export interface MessageBatchErroredResult {
    error: Shared.ErrorResponse;
    type: 'errored';
}
export interface MessageBatchExpiredResult {
    type: 'expired';
}
/**
 * This is a single line in the response `.jsonl` file and does not represent the
 * response as a whole.
 */
export interface MessageBatchIndividualResponse {
    /**
     * Developer-provided ID created for each request in a Message Batch. Useful for
     * matching results to requests, as results may be given out of request order.
     *
     * Must be unique for each request within the Message Batch.
     */
    custom_id: string;
    /**
     * Processing result for this request.
     *
     * Contains a Message output if processing was successful, an error response if
     * processing failed, or the reason why processing was not attempted, such as
     * cancellation or expiration.
     */
    result: MessageBatchResult;
}
export interface MessageBatchRequestCounts {
    /**
     * Number of requests in the Message Batch that have been canceled.
     *
     * This is zero until processing of the entire Message Batch has ended.
     */
    canceled: number;
    /**
     * Number of requests in the Message Batch that encountered an error.
     *
     * This is zero until processing of the entire Message Batch has ended.
     */
    errored: number;
    /**
     * Number of requests in the Message Batch that have expired.
     *
     * This is zero until processing of the entire Message Batch has ended.
     */
    expired: number;
    /**
     * Number of requests in the Message Batch that are processing.
     */
    processing: number;
    /**
     * Number of requests in the Message Batch that have completed successfully.
     *
     * This is zero until processing of the entire Message Batch has ended.
     */
    succeeded: number;
}
/**
 * Processing result for this request.
 *
 * Contains a Message output if processing was successful, an error response if
 * processing failed, or the reason why processing was not attempted, such as
 * cancellation or expiration.
 */
export type MessageBatchResult = MessageBatchSucceededResult | MessageBatchErroredResult | MessageBatchCanceledResult | MessageBatchExpiredResult;
export interface MessageBatchSucceededResult {
    message: MessagesAPI.Message;
    type: 'succeeded';
}
export interface BatchCreateParams {
    /**
     * List of requests for prompt completion. Each is an individual request to create
     * a Message.
     */
    requests: Array<BatchCreateParams.Request>;
}
export declare namespace BatchCreateParams {
    interface Request {
        /**
         * Developer-provided ID created for each request in a Message Batch. Useful for
         * matching results to requests, as results may be given out of request order.
         *
         * Must be unique for each request within the Message Batch.
         */
        custom_id: string;
        /**
         * Messages API creation parameters for the individual request.
         *
         * See the [Messages API reference](/en/api/messages) for full documentation on
         * available parameters.
         */
        params: MessagesAPI.MessageCreateParamsNonStreaming;
    }
}
export interface BatchListParams extends PageParams {
}
export declare namespace Batches {
    export { type DeletedMessageBatch as DeletedMessageBatch, type MessageBatch as MessageBatch, type MessageBatchCanceledResult as MessageBatchCanceledResult, type MessageBatchErroredResult as MessageBatchErroredResult, type MessageBatchExpiredResult as MessageBatchExpiredResult, type MessageBatchIndividualResponse as MessageBatchIndividualResponse, type MessageBatchRequestCounts as MessageBatchRequestCounts, type MessageBatchResult as MessageBatchResult, type MessageBatchSucceededResult as MessageBatchSucceededResult, MessageBatchesPage as MessageBatchesPage, type BatchCreateParams as BatchCreateParams, type BatchListParams as BatchListParams, };
}
//# sourceMappingURL=batches.d.ts.map