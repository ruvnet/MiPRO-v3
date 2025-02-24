// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../resource.mjs";
import * as BatchesAPI from "./batches.mjs";
import { Batches, MessageBatchesPage, } from "./batches.mjs";
import { MessageStream } from "../../lib/MessageStream.mjs";
export { MessageStream } from "../../lib/MessageStream.mjs";
export class Messages extends APIResource {
    constructor() {
        super(...arguments);
        this.batches = new BatchesAPI.Batches(this._client);
    }
    create(body, options) {
        if (body.model in DEPRECATED_MODELS) {
            console.warn(`The model '${body.model}' is deprecated and will reach end-of-life on ${DEPRECATED_MODELS[body.model]}\nPlease migrate to a newer model. Visit https://docs.anthropic.com/en/docs/resources/model-deprecations for more information.`);
        }
        return this._client.post('/v1/messages', {
            body,
            timeout: this._client._options.timeout ?? 600000,
            ...options,
            stream: body.stream ?? false,
        });
    }
    /**
     * Create a Message stream
     */
    stream(body, options) {
        return MessageStream.createMessage(this, body, options);
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
    countTokens(body, options) {
        return this._client.post('/v1/messages/count_tokens', { body, ...options });
    }
}
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
Messages.Batches = Batches;
Messages.MessageBatchesPage = MessageBatchesPage;
//# sourceMappingURL=messages.mjs.map