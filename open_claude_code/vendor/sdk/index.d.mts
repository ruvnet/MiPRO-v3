import { type Agent } from "./_shims/index.js";
import * as Core from "./core.js";
import * as Errors from "./error.js";
import * as Pagination from "./pagination.js";
import { type PageParams, PageResponse } from "./pagination.js";
import * as Uploads from "./uploads.js";
import * as API from "./resources/index.js";
import { Completion, CompletionCreateParams, CompletionCreateParamsNonStreaming, CompletionCreateParamsStreaming, Completions } from "./resources/completions.js";
import { ModelInfo, ModelInfosPage, ModelListParams, Models } from "./resources/models.js";
import { AnthropicBeta, Beta, BetaAPIError, BetaAuthenticationError, BetaBillingError, BetaError, BetaErrorResponse, BetaGatewayTimeoutError, BetaInvalidRequestError, BetaNotFoundError, BetaOverloadedError, BetaPermissionError, BetaRateLimitError } from "./resources/beta/beta.js";
import { Base64PDFSource, CacheControlEphemeral, CitationCharLocation, CitationCharLocationParam, CitationContentBlockLocation, CitationContentBlockLocationParam, CitationPageLocation, CitationPageLocationParam, CitationsConfigParam, CitationsDelta, ContentBlock, ContentBlockDeltaEvent, ContentBlockParam, ContentBlockSource, ContentBlockSourceContent, ContentBlockStartEvent, ContentBlockStopEvent, DocumentBlockParam, ImageBlockParam, InputJSONDelta, Message, MessageCountTokensParams, MessageCreateParams, MessageCreateParamsNonStreaming, MessageCreateParamsStreaming, MessageDeltaEvent, MessageDeltaUsage, MessageParam, MessageStartEvent, MessageStopEvent, MessageStreamEvent, MessageStreamParams, MessageTokensCount, Messages, Metadata, Model, PlainTextSource, RawContentBlockDeltaEvent, RawContentBlockStartEvent, RawContentBlockStopEvent, RawMessageDeltaEvent, RawMessageStartEvent, RawMessageStopEvent, RawMessageStreamEvent, RedactedThinkingBlock, RedactedThinkingBlockParam, SignatureDelta, TextBlock, TextBlockParam, TextCitation, TextCitationParam, TextDelta, ThinkingBlock, ThinkingBlockParam, ThinkingConfigDisabled, ThinkingConfigEnabled, ThinkingDelta, Tool, ToolChoice, ToolChoiceAny, ToolChoiceAuto, ToolChoiceTool, ToolResultBlockParam, ToolUseBlock, ToolUseBlockParam, Usage } from "./resources/messages/messages.js";
export interface ClientOptions {
    /**
     * Defaults to process.env['ANTHROPIC_API_KEY'].
     */
    apiKey?: string | null | undefined;
    /**
     * Defaults to process.env['ANTHROPIC_AUTH_TOKEN'].
     */
    authToken?: string | null | undefined;
    /**
     * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
     *
     * Defaults to process.env['ANTHROPIC_BASE_URL'].
     */
    baseURL?: string | null | undefined;
    /**
     * The maximum amount of time (in milliseconds) that the client should wait for a response
     * from the server before timing out a single request.
     *
     * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
     * much longer than this timeout before the promise succeeds or fails.
     */
    timeout?: number | undefined;
    /**
     * An HTTP agent used to manage HTTP(S) connections.
     *
     * If not provided, an agent will be constructed by default in the Node.js environment,
     * otherwise no agent is used.
     */
    httpAgent?: Agent | undefined;
    /**
     * Specify a custom `fetch` function implementation.
     *
     * If not provided, we use `node-fetch` on Node.js and otherwise expect that `fetch` is
     * defined globally.
     */
    fetch?: Core.Fetch | undefined;
    /**
     * The maximum number of times that the client will retry a request in case of a
     * temporary failure, like a network error or a 5XX error from the server.
     *
     * @default 2
     */
    maxRetries?: number | undefined;
    /**
     * Default headers to include with every request to the API.
     *
     * These can be removed in individual requests by explicitly setting the
     * header to `undefined` or `null` in request options.
     */
    defaultHeaders?: Core.Headers | undefined;
    /**
     * Default query parameters to include with every request to the API.
     *
     * These can be removed in individual requests by explicitly setting the
     * param to `undefined` in request options.
     */
    defaultQuery?: Core.DefaultQuery | undefined;
    /**
     * By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     * Only set this option to `true` if you understand the risks and have appropriate mitigations in place.
     */
    dangerouslyAllowBrowser?: boolean | undefined;
}
/**
 * API Client for interfacing with the Anthropic API.
 */
export declare class Anthropic extends Core.APIClient {
    apiKey: string | null;
    authToken: string | null;
    private _options;
    /**
     * API Client for interfacing with the Anthropic API.
     *
     * @param {string | null | undefined} [opts.apiKey=process.env['ANTHROPIC_API_KEY'] ?? null]
     * @param {string | null | undefined} [opts.authToken=process.env['ANTHROPIC_AUTH_TOKEN'] ?? null]
     * @param {string} [opts.baseURL=process.env['ANTHROPIC_BASE_URL'] ?? https://api.anthropic.com] - Override the default base URL for the API.
     * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
     * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
     * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
     * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
     * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
     * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
     * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
     */
    constructor({ baseURL, apiKey, authToken, ...opts }?: ClientOptions);
    completions: API.Completions;
    messages: API.Messages;
    models: API.Models;
    beta: API.Beta;
    protected defaultQuery(): Core.DefaultQuery | undefined;
    protected defaultHeaders(opts: Core.FinalRequestOptions): Core.Headers;
    protected validateHeaders(headers: Core.Headers, customHeaders: Core.Headers): void;
    protected authHeaders(opts: Core.FinalRequestOptions): Core.Headers;
    protected apiKeyAuth(opts: Core.FinalRequestOptions): Core.Headers;
    protected bearerAuth(opts: Core.FinalRequestOptions): Core.Headers;
    static Anthropic: typeof Anthropic;
    static HUMAN_PROMPT: string;
    static AI_PROMPT: string;
    static DEFAULT_TIMEOUT: number;
    static AnthropicError: typeof Errors.AnthropicError;
    static APIError: typeof Errors.APIError;
    static APIConnectionError: typeof Errors.APIConnectionError;
    static APIConnectionTimeoutError: typeof Errors.APIConnectionTimeoutError;
    static APIUserAbortError: typeof Errors.APIUserAbortError;
    static NotFoundError: typeof Errors.NotFoundError;
    static ConflictError: typeof Errors.ConflictError;
    static RateLimitError: typeof Errors.RateLimitError;
    static BadRequestError: typeof Errors.BadRequestError;
    static AuthenticationError: typeof Errors.AuthenticationError;
    static InternalServerError: typeof Errors.InternalServerError;
    static PermissionDeniedError: typeof Errors.PermissionDeniedError;
    static UnprocessableEntityError: typeof Errors.UnprocessableEntityError;
    static toFile: typeof Uploads.toFile;
    static fileFromPath: typeof Uploads.fileFromPath;
}
export declare namespace Anthropic {
    export type RequestOptions = Core.RequestOptions;
    export import Page = Pagination.Page;
    export { type PageParams as PageParams, type PageResponse as PageResponse };
    export { Completions as Completions, type Completion as Completion, type CompletionCreateParams as CompletionCreateParams, type CompletionCreateParamsNonStreaming as CompletionCreateParamsNonStreaming, type CompletionCreateParamsStreaming as CompletionCreateParamsStreaming, };
    export { Messages as Messages, type Base64PDFSource as Base64PDFSource, type CacheControlEphemeral as CacheControlEphemeral, type CitationCharLocation as CitationCharLocation, type CitationCharLocationParam as CitationCharLocationParam, type CitationContentBlockLocation as CitationContentBlockLocation, type CitationContentBlockLocationParam as CitationContentBlockLocationParam, type CitationPageLocation as CitationPageLocation, type CitationPageLocationParam as CitationPageLocationParam, type CitationsConfigParam as CitationsConfigParam, type CitationsDelta as CitationsDelta, type ContentBlock as ContentBlock, type ContentBlockDeltaEvent as ContentBlockDeltaEvent, type ContentBlockParam as ContentBlockParam, type ContentBlockSource as ContentBlockSource, type ContentBlockSourceContent as ContentBlockSourceContent, type ContentBlockStartEvent as ContentBlockStartEvent, type ContentBlockStopEvent as ContentBlockStopEvent, type DocumentBlockParam as DocumentBlockParam, type ImageBlockParam as ImageBlockParam, type InputJSONDelta as InputJSONDelta, type Message as Message, type MessageDeltaEvent as MessageDeltaEvent, type MessageDeltaUsage as MessageDeltaUsage, type MessageParam as MessageParam, type MessageStartEvent as MessageStartEvent, type MessageStopEvent as MessageStopEvent, type MessageStreamEvent as MessageStreamEvent, type MessageTokensCount as MessageTokensCount, type Metadata as Metadata, type Model as Model, type PlainTextSource as PlainTextSource, type RawContentBlockDeltaEvent as RawContentBlockDeltaEvent, type RawContentBlockStartEvent as RawContentBlockStartEvent, type RawContentBlockStopEvent as RawContentBlockStopEvent, type RawMessageDeltaEvent as RawMessageDeltaEvent, type RawMessageStartEvent as RawMessageStartEvent, type RawMessageStopEvent as RawMessageStopEvent, type RawMessageStreamEvent as RawMessageStreamEvent, type RedactedThinkingBlock as RedactedThinkingBlock, type RedactedThinkingBlockParam as RedactedThinkingBlockParam, type SignatureDelta as SignatureDelta, type TextBlock as TextBlock, type TextBlockParam as TextBlockParam, type TextCitation as TextCitation, type TextCitationParam as TextCitationParam, type TextDelta as TextDelta, type ThinkingBlock as ThinkingBlock, type ThinkingBlockParam as ThinkingBlockParam, type ThinkingConfigDisabled as ThinkingConfigDisabled, type ThinkingConfigEnabled as ThinkingConfigEnabled, type ThinkingDelta as ThinkingDelta, type Tool as Tool, type ToolChoice as ToolChoice, type ToolChoiceAny as ToolChoiceAny, type ToolChoiceAuto as ToolChoiceAuto, type ToolChoiceTool as ToolChoiceTool, type ToolResultBlockParam as ToolResultBlockParam, type ToolUseBlock as ToolUseBlock, type ToolUseBlockParam as ToolUseBlockParam, type Usage as Usage, type MessageCreateParams as MessageCreateParams, type MessageCreateParamsNonStreaming as MessageCreateParamsNonStreaming, type MessageCreateParamsStreaming as MessageCreateParamsStreaming, type MessageStreamParams as MessageStreamParams, type MessageCountTokensParams as MessageCountTokensParams, };
    export { Models as Models, type ModelInfo as ModelInfo, ModelInfosPage as ModelInfosPage, type ModelListParams as ModelListParams, };
    export { Beta as Beta, type AnthropicBeta as AnthropicBeta, type BetaAPIError as BetaAPIError, type BetaAuthenticationError as BetaAuthenticationError, type BetaBillingError as BetaBillingError, type BetaError as BetaError, type BetaErrorResponse as BetaErrorResponse, type BetaGatewayTimeoutError as BetaGatewayTimeoutError, type BetaInvalidRequestError as BetaInvalidRequestError, type BetaNotFoundError as BetaNotFoundError, type BetaOverloadedError as BetaOverloadedError, type BetaPermissionError as BetaPermissionError, type BetaRateLimitError as BetaRateLimitError, };
    export type APIErrorObject = API.APIErrorObject;
    export type AuthenticationError = API.AuthenticationError;
    export type BillingError = API.BillingError;
    export type ErrorObject = API.ErrorObject;
    export type ErrorResponse = API.ErrorResponse;
    export type GatewayTimeoutError = API.GatewayTimeoutError;
    export type InvalidRequestError = API.InvalidRequestError;
    export type NotFoundError = API.NotFoundError;
    export type OverloadedError = API.OverloadedError;
    export type PermissionError = API.PermissionError;
    export type RateLimitError = API.RateLimitError;
}
export declare const HUMAN_PROMPT: string, AI_PROMPT: string;
export { toFile, fileFromPath } from "./uploads.js";
export { AnthropicError, APIError, APIConnectionError, APIConnectionTimeoutError, APIUserAbortError, NotFoundError, ConflictError, RateLimitError, BadRequestError, AuthenticationError, InternalServerError, PermissionDeniedError, UnprocessableEntityError, } from "./error.js";
export default Anthropic;
//# sourceMappingURL=index.d.ts.map