import { APIResource } from "../../resource.js";
import { APIPromise } from "../../core.js";
import * as Core from "../../core.js";
import * as MessagesAPI from "./messages.js";
import * as BatchesAPI from "./batches.js";
import { BatchCreateParams, BatchListParams, Batches, DeletedMessageBatch, MessageBatch, MessageBatchCanceledResult, MessageBatchErroredResult, MessageBatchExpiredResult, MessageBatchIndividualResponse, MessageBatchRequestCounts, MessageBatchResult, MessageBatchSucceededResult, MessageBatchesPage } from "./batches.js";
import { Stream } from "../../streaming.js";
import { MessageStream } from "../../lib/MessageStream.js";
export { MessageStream } from "../../lib/MessageStream.js";
export declare class Messages extends APIResource {
    batches: BatchesAPI.Batches;
    /**
     * Send a structured list of input messages with text and/or image content, and the
     * model will generate the next message in the conversation.
     *
     * The Messages API can be used for either single queries or stateless multi-turn
     * conversations.
     *
     * Learn more about the Messages API in our [user guide](/en/docs/initial-setup)
     */
    create(body: MessageCreateParamsNonStreaming, options?: Core.RequestOptions): APIPromise<Message>;
    create(body: MessageCreateParamsStreaming, options?: Core.RequestOptions): APIPromise<Stream<RawMessageStreamEvent>>;
    create(body: MessageCreateParamsBase, options?: Core.RequestOptions): APIPromise<Stream<RawMessageStreamEvent> | Message>;
    /**
     * Create a Message stream
     */
    stream(body: MessageStreamParams, options?: Core.RequestOptions): MessageStream;
    /**
     * Count the number of tokens in a Message.
     *
     * The Token Count API can be used to count the number of tokens in a Message,
     * including tools, images, and documents, without creating it.
     *
     * Learn more about token counting in our
     * [user guide](/en/docs/build-with-claude/token-counting)
     */
    countTokens(body: MessageCountTokensParams, options?: Core.RequestOptions): Core.APIPromise<MessageTokensCount>;
}
export interface Base64PDFSource {
    data: string;
    media_type: 'application/pdf';
    type: 'base64';
}
export interface CacheControlEphemeral {
    type: 'ephemeral';
}
export interface CitationCharLocation {
    cited_text: string;
    document_index: number;
    document_title: string | null;
    end_char_index: number;
    start_char_index: number;
    type: 'char_location';
}
export interface CitationCharLocationParam {
    cited_text: string;
    document_index: number;
    document_title: string | null;
    end_char_index: number;
    start_char_index: number;
    type: 'char_location';
}
export interface CitationContentBlockLocation {
    cited_text: string;
    document_index: number;
    document_title: string | null;
    end_block_index: number;
    start_block_index: number;
    type: 'content_block_location';
}
export interface CitationContentBlockLocationParam {
    cited_text: string;
    document_index: number;
    document_title: string | null;
    end_block_index: number;
    start_block_index: number;
    type: 'content_block_location';
}
export interface CitationPageLocation {
    cited_text: string;
    document_index: number;
    document_title: string | null;
    end_page_number: number;
    start_page_number: number;
    type: 'page_location';
}
export interface CitationPageLocationParam {
    cited_text: string;
    document_index: number;
    document_title: string | null;
    end_page_number: number;
    start_page_number: number;
    type: 'page_location';
}
export interface CitationsConfigParam {
    enabled?: boolean;
}
export interface CitationsDelta {
    citation: CitationCharLocation | CitationPageLocation | CitationContentBlockLocation;
    type: 'citations_delta';
}
export type ContentBlock = TextBlock | ToolUseBlock | ThinkingBlock | RedactedThinkingBlock;
export type ContentBlockDeltaEvent = RawContentBlockDeltaEvent;
export type ContentBlockParam = TextBlockParam | ImageBlockParam | ToolUseBlockParam | ToolResultBlockParam | DocumentBlockParam | ThinkingBlockParam | RedactedThinkingBlockParam;
export interface ContentBlockSource {
    content: string | Array<ContentBlockSourceContent>;
    type: 'content';
}
export type ContentBlockSourceContent = TextBlockParam | ImageBlockParam;
export type ContentBlockStartEvent = RawContentBlockStartEvent;
export type ContentBlockStopEvent = RawContentBlockStopEvent;
export interface DocumentBlockParam {
    source: Base64PDFSource | PlainTextSource | ContentBlockSource;
    type: 'document';
    cache_control?: CacheControlEphemeral | null;
    citations?: CitationsConfigParam;
    context?: string | null;
    title?: string | null;
}
export interface ImageBlockParam {
    source: ImageBlockParam.Source;
    type: 'image';
    cache_control?: CacheControlEphemeral | null;
}
export declare namespace ImageBlockParam {
    interface Source {
        data: string;
        media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
        type: 'base64';
    }
}
export type InputJsonDelta = InputJSONDelta;
export interface InputJSONDelta {
    partial_json: string;
    type: 'input_json_delta';
}
export interface Message {
    /**
     * Unique object identifier.
     *
     * The format and length of IDs may change over time.
     */
    id: string;
    /**
     * Content generated by the model.
     *
     * This is an array of content blocks, each of which has a `type` that determines
     * its shape.
     *
     * Example:
     *
     * ```json
     * [{ "type": "text", "text": "Hi, I'm Claude." }]
     * ```
     *
     * If the request input `messages` ended with an `assistant` turn, then the
     * response `content` will continue directly from that last turn. You can use this
     * to constrain the model's output.
     *
     * For example, if the input `messages` were:
     *
     * ```json
     * [
     *   {
     *     "role": "user",
     *     "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"
     *   },
     *   { "role": "assistant", "content": "The best answer is (" }
     * ]
     * ```
     *
     * Then the response `content` might be:
     *
     * ```json
     * [{ "type": "text", "text": "B)" }]
     * ```
     */
    content: Array<ContentBlock>;
    /**
     * The model that will complete your prompt.\n\nSee
     * [models](https://docs.anthropic.com/en/docs/models-overview) for additional
     * details and options.
     */
    model: Model;
    /**
     * Conversational role of the generated message.
     *
     * This will always be `"assistant"`.
     */
    role: 'assistant';
    /**
     * The reason that we stopped.
     *
     * This may be one the following values:
     *
     * - `"end_turn"`: the model reached a natural stopping point
     * - `"max_tokens"`: we exceeded the requested `max_tokens` or the model's maximum
     * - `"stop_sequence"`: one of your provided custom `stop_sequences` was generated
     * - `"tool_use"`: the model invoked one or more tools
     *
     * In non-streaming mode this value is always non-null. In streaming mode, it is
     * null in the `message_start` event and non-null otherwise.
     */
    stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
    /**
     * Which custom stop sequence was generated, if any.
     *
     * This value will be a non-null string if one of your custom stop sequences was
     * generated.
     */
    stop_sequence: string | null;
    /**
     * Object type.
     *
     * For Messages, this is always `"message"`.
     */
    type: 'message';
    /**
     * Billing and rate-limit usage.
     *
     * Anthropic's API bills and rate-limits by token counts, as tokens represent the
     * underlying cost to our systems.
     *
     * Under the hood, the API transforms requests into a format suitable for the
     * model. The model's output then goes through a parsing stage before becoming an
     * API response. As a result, the token counts in `usage` will not match one-to-one
     * with the exact visible content of an API request or response.
     *
     * For example, `output_tokens` will be non-zero, even for an empty string response
     * from Claude.
     *
     * Total input tokens in a request is the summation of `input_tokens`,
     * `cache_creation_input_tokens`, and `cache_read_input_tokens`.
     */
    usage: Usage;
}
export type MessageDeltaEvent = RawMessageDeltaEvent;
export interface MessageDeltaUsage {
    /**
     * The cumulative number of output tokens which were used.
     */
    output_tokens: number;
}
export interface MessageParam {
    content: string | Array<ContentBlockParam>;
    role: 'user' | 'assistant';
}
export type MessageStartEvent = RawMessageStartEvent;
export type MessageStopEvent = RawMessageStopEvent;
export type MessageStreamEvent = RawMessageStreamEvent;
export interface MessageTokensCount {
    /**
     * The total number of tokens across the provided list of messages, system prompt,
     * and tools.
     */
    input_tokens: number;
}
export interface Metadata {
    /**
     * An external identifier for the user who is associated with the request.
     *
     * This should be a uuid, hash value, or other opaque identifier. Anthropic may use
     * this id to help detect abuse. Do not include any identifying information such as
     * name, email address, or phone number.
     */
    user_id?: string | null;
}
/**
 * The model that will complete your prompt.\n\nSee
 * [models](https://docs.anthropic.com/en/docs/models-overview) for additional
 * details and options.
 */
export type Model = 'claude-3-5-haiku-latest' | 'claude-3-5-haiku-20241022' | 'claude-3-5-sonnet-latest' | 'claude-3-5-sonnet-20241022' | 'claude-3-5-sonnet-20240620' | 'claude-3-opus-latest' | 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' | 'claude-2.1' | 'claude-2.0' | (string & {});
export interface PlainTextSource {
    data: string;
    media_type: 'text/plain';
    type: 'text';
}
export interface RawContentBlockDeltaEvent {
    delta: TextDelta | InputJSONDelta | CitationsDelta | ThinkingDelta | SignatureDelta;
    index: number;
    type: 'content_block_delta';
}
export interface RawContentBlockStartEvent {
    content_block: TextBlock | ToolUseBlock | ThinkingBlock | RedactedThinkingBlock;
    index: number;
    type: 'content_block_start';
}
export interface RawContentBlockStopEvent {
    index: number;
    type: 'content_block_stop';
}
export interface RawMessageDeltaEvent {
    delta: RawMessageDeltaEvent.Delta;
    type: 'message_delta';
    /**
     * Billing and rate-limit usage.
     *
     * Anthropic's API bills and rate-limits by token counts, as tokens represent the
     * underlying cost to our systems.
     *
     * Under the hood, the API transforms requests into a format suitable for the
     * model. The model's output then goes through a parsing stage before becoming an
     * API response. As a result, the token counts in `usage` will not match one-to-one
     * with the exact visible content of an API request or response.
     *
     * For example, `output_tokens` will be non-zero, even for an empty string response
     * from Claude.
     *
     * Total input tokens in a request is the summation of `input_tokens`,
     * `cache_creation_input_tokens`, and `cache_read_input_tokens`.
     */
    usage: MessageDeltaUsage;
}
export declare namespace RawMessageDeltaEvent {
    interface Delta {
        stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | 'tool_use' | null;
        stop_sequence: string | null;
    }
}
export interface RawMessageStartEvent {
    message: Message;
    type: 'message_start';
}
export interface RawMessageStopEvent {
    type: 'message_stop';
}
export type RawMessageStreamEvent = RawMessageStartEvent | RawMessageDeltaEvent | RawMessageStopEvent | RawContentBlockStartEvent | RawContentBlockDeltaEvent | RawContentBlockStopEvent;
export interface RedactedThinkingBlock {
    data: string;
    type: 'redacted_thinking';
}
export interface RedactedThinkingBlockParam {
    data: string;
    type: 'redacted_thinking';
}
export interface SignatureDelta {
    signature: string;
    type: 'signature_delta';
}
export interface TextBlock {
    /**
     * Citations supporting the text block.
     *
     * The type of citation returned will depend on the type of document being cited.
     * Citing a PDF results in `page_location`, plain text results in `char_location`,
     * and content document results in `content_block_location`.
     */
    citations: Array<TextCitation> | null;
    text: string;
    type: 'text';
}
export interface TextBlockParam {
    text: string;
    type: 'text';
    cache_control?: CacheControlEphemeral | null;
    citations?: Array<TextCitationParam> | null;
}
export type TextCitation = CitationCharLocation | CitationPageLocation | CitationContentBlockLocation;
export type TextCitationParam = CitationCharLocationParam | CitationPageLocationParam | CitationContentBlockLocationParam;
export interface TextDelta {
    text: string;
    type: 'text_delta';
}
export interface ThinkingBlock {
    signature: string;
    thinking: string;
    type: 'thinking';
}
export interface ThinkingBlockParam {
    signature: string;
    thinking: string;
    type: 'thinking';
}
export interface ThinkingConfigDisabled {
    type: 'disabled';
}
export interface ThinkingConfigEnabled {
    budget_tokens: number;
    type: 'enabled';
}
export interface ThinkingDelta {
    thinking: string;
    type: 'thinking_delta';
}
export interface Tool {
    /**
     * [JSON schema](https://json-schema.org/draft/2020-12) for this tool's input.
     *
     * This defines the shape of the `input` that your tool accepts and that the model
     * will produce.
     */
    input_schema: Tool.InputSchema;
    /**
     * Name of the tool.
     *
     * This is how the tool will be called by the model and in tool_use blocks.
     */
    name: string;
    cache_control?: CacheControlEphemeral | null;
    /**
     * Description of what this tool does.
     *
     * Tool descriptions should be as detailed as possible. The more information that
     * the model has about what the tool is and how to use it, the better it will
     * perform. You can use natural language descriptions to reinforce important
     * aspects of the tool input JSON schema.
     */
    description?: string;
}
export declare namespace Tool {
    /**
     * [JSON schema](https://json-schema.org/draft/2020-12) for this tool's input.
     *
     * This defines the shape of the `input` that your tool accepts and that the model
     * will produce.
     */
    interface InputSchema {
        type: 'object';
        properties?: unknown | null;
        [k: string]: unknown;
    }
}
/**
 * How the model should use the provided tools. The model can use a specific tool,
 * any available tool, or decide by itself.
 */
export type ToolChoice = ToolChoiceAuto | ToolChoiceAny | ToolChoiceTool;
/**
 * The model will use any available tools.
 */
export interface ToolChoiceAny {
    type: 'any';
    /**
     * Whether to disable parallel tool use.
     *
     * Defaults to `false`. If set to `true`, the model will output exactly one tool
     * use.
     */
    disable_parallel_tool_use?: boolean;
}
/**
 * The model will automatically decide whether to use tools.
 */
export interface ToolChoiceAuto {
    type: 'auto';
    /**
     * Whether to disable parallel tool use.
     *
     * Defaults to `false`. If set to `true`, the model will output at most one tool
     * use.
     */
    disable_parallel_tool_use?: boolean;
}
/**
 * The model will use the specified tool with `tool_choice.name`.
 */
export interface ToolChoiceTool {
    /**
     * The name of the tool to use.
     */
    name: string;
    type: 'tool';
    /**
     * Whether to disable parallel tool use.
     *
     * Defaults to `false`. If set to `true`, the model will output exactly one tool
     * use.
     */
    disable_parallel_tool_use?: boolean;
}
export interface ToolResultBlockParam {
    tool_use_id: string;
    type: 'tool_result';
    cache_control?: CacheControlEphemeral | null;
    content?: string | Array<TextBlockParam | ImageBlockParam>;
    is_error?: boolean;
}
export interface ToolUseBlock {
    id: string;
    input: unknown;
    name: string;
    type: 'tool_use';
}
export interface ToolUseBlockParam {
    id: string;
    input: unknown;
    name: string;
    type: 'tool_use';
    cache_control?: CacheControlEphemeral | null;
}
export interface Usage {
    /**
     * The number of input tokens used to create the cache entry.
     */
    cache_creation_input_tokens: number | null;
    /**
     * The number of input tokens read from the cache.
     */
    cache_read_input_tokens: number | null;
    /**
     * The number of input tokens which were used.
     */
    input_tokens: number;
    /**
     * The number of output tokens which were used.
     */
    output_tokens: number;
}
export type MessageCreateParams = MessageCreateParamsNonStreaming | MessageCreateParamsStreaming;
export interface MessageCreateParamsBase {
    /**
     * The maximum number of tokens to generate before stopping.
     *
     * Note that our models may stop _before_ reaching this maximum. This parameter
     * only specifies the absolute maximum number of tokens to generate.
     *
     * Different models have different maximum values for this parameter. See
     * [models](https://docs.anthropic.com/en/docs/models-overview) for details.
     */
    max_tokens: number;
    /**
     * Input messages.
     *
     * Our models are trained to operate on alternating `user` and `assistant`
     * conversational turns. When creating a new `Message`, you specify the prior
     * conversational turns with the `messages` parameter, and the model then generates
     * the next `Message` in the conversation. Consecutive `user` or `assistant` turns
     * in your request will be combined into a single turn.
     *
     * Each input message must be an object with a `role` and `content`. You can
     * specify a single `user`-role message, or you can include multiple `user` and
     * `assistant` messages.
     *
     * If the final message uses the `assistant` role, the response content will
     * continue immediately from the content in that message. This can be used to
     * constrain part of the model's response.
     *
     * Example with a single `user` message:
     *
     * ```json
     * [{ "role": "user", "content": "Hello, Claude" }]
     * ```
     *
     * Example with multiple conversational turns:
     *
     * ```json
     * [
     *   { "role": "user", "content": "Hello there." },
     *   { "role": "assistant", "content": "Hi, I'm Claude. How can I help you?" },
     *   { "role": "user", "content": "Can you explain LLMs in plain English?" }
     * ]
     * ```
     *
     * Example with a partially-filled response from Claude:
     *
     * ```json
     * [
     *   {
     *     "role": "user",
     *     "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"
     *   },
     *   { "role": "assistant", "content": "The best answer is (" }
     * ]
     * ```
     *
     * Each input message `content` may be either a single `string` or an array of
     * content blocks, where each block has a specific `type`. Using a `string` for
     * `content` is shorthand for an array of one content block of type `"text"`. The
     * following input messages are equivalent:
     *
     * ```json
     * { "role": "user", "content": "Hello, Claude" }
     * ```
     *
     * ```json
     * { "role": "user", "content": [{ "type": "text", "text": "Hello, Claude" }] }
     * ```
     *
     * Starting with Claude 3 models, you can also send image content blocks:
     *
     * ```json
     * {
     *   "role": "user",
     *   "content": [
     *     {
     *       "type": "image",
     *       "source": {
     *         "type": "base64",
     *         "media_type": "image/jpeg",
     *         "data": "/9j/4AAQSkZJRg..."
     *       }
     *     },
     *     { "type": "text", "text": "What is in this image?" }
     *   ]
     * }
     * ```
     *
     * We currently support the `base64` source type for images, and the `image/jpeg`,
     * `image/png`, `image/gif`, and `image/webp` media types.
     *
     * See [examples](https://docs.anthropic.com/en/api/messages-examples#vision) for
     * more input examples.
     *
     * Note that if you want to include a
     * [system prompt](https://docs.anthropic.com/en/docs/system-prompts), you can use
     * the top-level `system` parameter — there is no `"system"` role for input
     * messages in the Messages API.
     */
    messages: Array<MessageParam>;
    /**
     * The model that will complete your prompt.\n\nSee
     * [models](https://docs.anthropic.com/en/docs/models-overview) for additional
     * details and options.
     */
    model: Model;
    /**
     * An object describing metadata about the request.
     */
    metadata?: Metadata;
    /**
     * Custom text sequences that will cause the model to stop generating.
     *
     * Our models will normally stop when they have naturally completed their turn,
     * which will result in a response `stop_reason` of `"end_turn"`.
     *
     * If you want the model to stop generating when it encounters custom strings of
     * text, you can use the `stop_sequences` parameter. If the model encounters one of
     * the custom sequences, the response `stop_reason` value will be `"stop_sequence"`
     * and the response `stop_sequence` value will contain the matched stop sequence.
     */
    stop_sequences?: Array<string>;
    /**
     * Whether to incrementally stream the response using server-sent events.
     *
     * See [streaming](https://docs.anthropic.com/en/api/messages-streaming) for
     * details.
     */
    stream?: boolean;
    /**
     * System prompt.
     *
     * A system prompt is a way of providing context and instructions to Claude, such
     * as specifying a particular goal or role. See our
     * [guide to system prompts](https://docs.anthropic.com/en/docs/system-prompts).
     */
    system?: string | Array<TextBlockParam>;
    /**
     * Amount of randomness injected into the response.
     *
     * Defaults to `1.0`. Ranges from `0.0` to `1.0`. Use `temperature` closer to `0.0`
     * for analytical / multiple choice, and closer to `1.0` for creative and
     * generative tasks.
     *
     * Note that even with `temperature` of `0.0`, the results will not be fully
     * deterministic.
     */
    temperature?: number;
    thinking?: ThinkingConfigEnabled | ThinkingConfigDisabled;
    /**
     * How the model should use the provided tools. The model can use a specific tool,
     * any available tool, or decide by itself.
     */
    tool_choice?: ToolChoice;
    /**
     * Definitions of tools that the model may use.
     *
     * If you include `tools` in your API request, the model may return `tool_use`
     * content blocks that represent the model's use of those tools. You can then run
     * those tools using the tool input generated by the model and then optionally
     * return results back to the model using `tool_result` content blocks.
     *
     * Each tool definition includes:
     *
     * - `name`: Name of the tool.
     * - `description`: Optional, but strongly-recommended description of the tool.
     * - `input_schema`: [JSON schema](https://json-schema.org/draft/2020-12) for the
     *   tool `input` shape that the model will produce in `tool_use` output content
     *   blocks.
     *
     * For example, if you defined `tools` as:
     *
     * ```json
     * [
     *   {
     *     "name": "get_stock_price",
     *     "description": "Get the current stock price for a given ticker symbol.",
     *     "input_schema": {
     *       "type": "object",
     *       "properties": {
     *         "ticker": {
     *           "type": "string",
     *           "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
     *         }
     *       },
     *       "required": ["ticker"]
     *     }
     *   }
     * ]
     * ```
     *
     * And then asked the model "What's the S&P 500 at today?", the model might produce
     * `tool_use` content blocks in the response like this:
     *
     * ```json
     * [
     *   {
     *     "type": "tool_use",
     *     "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
     *     "name": "get_stock_price",
     *     "input": { "ticker": "^GSPC" }
     *   }
     * ]
     * ```
     *
     * You might then run your `get_stock_price` tool with `{"ticker": "^GSPC"}` as an
     * input, and return the following back to the model in a subsequent `user`
     * message:
     *
     * ```json
     * [
     *   {
     *     "type": "tool_result",
     *     "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
     *     "content": "259.75 USD"
     *   }
     * ]
     * ```
     *
     * Tools can be used for workflows that include running client-side tools and
     * functions, or more generally whenever you want the model to produce a particular
     * JSON structure of output.
     *
     * See our [guide](https://docs.anthropic.com/en/docs/tool-use) for more details.
     */
    tools?: Array<MessageCreateParams.BashTool20250124 | MessageCreateParams.TextEditor20250124 | Tool>;
    /**
     * Only sample from the top K options for each subsequent token.
     *
     * Used to remove "long tail" low probability responses.
     * [Learn more technical details here](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277).
     *
     * Recommended for advanced use cases only. You usually only need to use
     * `temperature`.
     */
    top_k?: number;
    /**
     * Use nucleus sampling.
     *
     * In nucleus sampling, we compute the cumulative distribution over all the options
     * for each subsequent token in decreasing probability order and cut it off once it
     * reaches a particular probability specified by `top_p`. You should either alter
     * `temperature` or `top_p`, but not both.
     *
     * Recommended for advanced use cases only. You usually only need to use
     * `temperature`.
     */
    top_p?: number;
}
export declare namespace MessageCreateParams {
    /**
     * @deprecated use `Anthropic.Messages.ToolChoiceAuto` instead
     */
    type Metadata = MessagesAPI.Metadata;
    /**
     * @deprecated use `Anthropic.Messages.ToolChoiceAuto` instead
     */
    type ToolChoiceAuto = MessagesAPI.ToolChoiceAuto;
    /**
     * @deprecated use `Anthropic.Messages.ToolChoiceAny` instead
     */
    type ToolChoiceAny = MessagesAPI.ToolChoiceAny;
    /**
     * @deprecated use `Anthropic.Messages.ToolChoiceTool` instead
     */
    type ToolChoiceTool = MessagesAPI.ToolChoiceTool;
    interface BashTool20250124 {
        /**
         * Name of the tool.
         *
         * This is how the tool will be called by the model and in tool_use blocks.
         */
        name: 'bash';
        type: 'bash_20250124';
        cache_control?: MessagesAPI.CacheControlEphemeral | null;
    }
    interface TextEditor20250124 {
        /**
         * Name of the tool.
         *
         * This is how the tool will be called by the model and in tool_use blocks.
         */
        name: 'str_replace_editor';
        type: 'text_editor_20250124';
        cache_control?: MessagesAPI.CacheControlEphemeral | null;
    }
    type MessageCreateParamsNonStreaming = MessagesAPI.MessageCreateParamsNonStreaming;
    type MessageCreateParamsStreaming = MessagesAPI.MessageCreateParamsStreaming;
}
export interface MessageCreateParamsNonStreaming extends MessageCreateParamsBase {
    /**
     * Whether to incrementally stream the response using server-sent events.
     *
     * See [streaming](https://docs.anthropic.com/en/api/messages-streaming) for
     * details.
     */
    stream?: false;
}
export interface MessageCreateParamsStreaming extends MessageCreateParamsBase {
    /**
     * Whether to incrementally stream the response using server-sent events.
     *
     * See [streaming](https://docs.anthropic.com/en/api/messages-streaming) for
     * details.
     */
    stream: true;
}
export type MessageStreamParams = MessageCreateParamsBase;
export interface MessageCountTokensParams {
    /**
     * Input messages.
     *
     * Our models are trained to operate on alternating `user` and `assistant`
     * conversational turns. When creating a new `Message`, you specify the prior
     * conversational turns with the `messages` parameter, and the model then generates
     * the next `Message` in the conversation. Consecutive `user` or `assistant` turns
     * in your request will be combined into a single turn.
     *
     * Each input message must be an object with a `role` and `content`. You can
     * specify a single `user`-role message, or you can include multiple `user` and
     * `assistant` messages.
     *
     * If the final message uses the `assistant` role, the response content will
     * continue immediately from the content in that message. This can be used to
     * constrain part of the model's response.
     *
     * Example with a single `user` message:
     *
     * ```json
     * [{ "role": "user", "content": "Hello, Claude" }]
     * ```
     *
     * Example with multiple conversational turns:
     *
     * ```json
     * [
     *   { "role": "user", "content": "Hello there." },
     *   { "role": "assistant", "content": "Hi, I'm Claude. How can I help you?" },
     *   { "role": "user", "content": "Can you explain LLMs in plain English?" }
     * ]
     * ```
     *
     * Example with a partially-filled response from Claude:
     *
     * ```json
     * [
     *   {
     *     "role": "user",
     *     "content": "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun"
     *   },
     *   { "role": "assistant", "content": "The best answer is (" }
     * ]
     * ```
     *
     * Each input message `content` may be either a single `string` or an array of
     * content blocks, where each block has a specific `type`. Using a `string` for
     * `content` is shorthand for an array of one content block of type `"text"`. The
     * following input messages are equivalent:
     *
     * ```json
     * { "role": "user", "content": "Hello, Claude" }
     * ```
     *
     * ```json
     * { "role": "user", "content": [{ "type": "text", "text": "Hello, Claude" }] }
     * ```
     *
     * Starting with Claude 3 models, you can also send image content blocks:
     *
     * ```json
     * {
     *   "role": "user",
     *   "content": [
     *     {
     *       "type": "image",
     *       "source": {
     *         "type": "base64",
     *         "media_type": "image/jpeg",
     *         "data": "/9j/4AAQSkZJRg..."
     *       }
     *     },
     *     { "type": "text", "text": "What is in this image?" }
     *   ]
     * }
     * ```
     *
     * We currently support the `base64` source type for images, and the `image/jpeg`,
     * `image/png`, `image/gif`, and `image/webp` media types.
     *
     * See [examples](https://docs.anthropic.com/en/api/messages-examples#vision) for
     * more input examples.
     *
     * Note that if you want to include a
     * [system prompt](https://docs.anthropic.com/en/docs/system-prompts), you can use
     * the top-level `system` parameter — there is no `"system"` role for input
     * messages in the Messages API.
     */
    messages: Array<MessageParam>;
    /**
     * The model that will complete your prompt.\n\nSee
     * [models](https://docs.anthropic.com/en/docs/models-overview) for additional
     * details and options.
     */
    model: Model;
    /**
     * System prompt.
     *
     * A system prompt is a way of providing context and instructions to Claude, such
     * as specifying a particular goal or role. See our
     * [guide to system prompts](https://docs.anthropic.com/en/docs/system-prompts).
     */
    system?: string | Array<TextBlockParam>;
    thinking?: ThinkingConfigEnabled | ThinkingConfigDisabled;
    /**
     * How the model should use the provided tools. The model can use a specific tool,
     * any available tool, or decide by itself.
     */
    tool_choice?: ToolChoice;
    /**
     * Definitions of tools that the model may use.
     *
     * If you include `tools` in your API request, the model may return `tool_use`
     * content blocks that represent the model's use of those tools. You can then run
     * those tools using the tool input generated by the model and then optionally
     * return results back to the model using `tool_result` content blocks.
     *
     * Each tool definition includes:
     *
     * - `name`: Name of the tool.
     * - `description`: Optional, but strongly-recommended description of the tool.
     * - `input_schema`: [JSON schema](https://json-schema.org/draft/2020-12) for the
     *   tool `input` shape that the model will produce in `tool_use` output content
     *   blocks.
     *
     * For example, if you defined `tools` as:
     *
     * ```json
     * [
     *   {
     *     "name": "get_stock_price",
     *     "description": "Get the current stock price for a given ticker symbol.",
     *     "input_schema": {
     *       "type": "object",
     *       "properties": {
     *         "ticker": {
     *           "type": "string",
     *           "description": "The stock ticker symbol, e.g. AAPL for Apple Inc."
     *         }
     *       },
     *       "required": ["ticker"]
     *     }
     *   }
     * ]
     * ```
     *
     * And then asked the model "What's the S&P 500 at today?", the model might produce
     * `tool_use` content blocks in the response like this:
     *
     * ```json
     * [
     *   {
     *     "type": "tool_use",
     *     "id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
     *     "name": "get_stock_price",
     *     "input": { "ticker": "^GSPC" }
     *   }
     * ]
     * ```
     *
     * You might then run your `get_stock_price` tool with `{"ticker": "^GSPC"}` as an
     * input, and return the following back to the model in a subsequent `user`
     * message:
     *
     * ```json
     * [
     *   {
     *     "type": "tool_result",
     *     "tool_use_id": "toolu_01D7FLrfh4GYq7yT1ULFeyMV",
     *     "content": "259.75 USD"
     *   }
     * ]
     * ```
     *
     * Tools can be used for workflows that include running client-side tools and
     * functions, or more generally whenever you want the model to produce a particular
     * JSON structure of output.
     *
     * See our [guide](https://docs.anthropic.com/en/docs/tool-use) for more details.
     */
    tools?: Array<MessageCountTokensParams.BashTool20250124 | MessageCountTokensParams.TextEditor20250124 | Tool>;
}
export declare namespace MessageCountTokensParams {
    interface BashTool20250124 {
        /**
         * Name of the tool.
         *
         * This is how the tool will be called by the model and in tool_use blocks.
         */
        name: 'bash';
        type: 'bash_20250124';
        cache_control?: MessagesAPI.CacheControlEphemeral | null;
    }
    interface TextEditor20250124 {
        /**
         * Name of the tool.
         *
         * This is how the tool will be called by the model and in tool_use blocks.
         */
        name: 'str_replace_editor';
        type: 'text_editor_20250124';
        cache_control?: MessagesAPI.CacheControlEphemeral | null;
    }
}
export declare namespace Messages {
    export { type Base64PDFSource as Base64PDFSource, type CacheControlEphemeral as CacheControlEphemeral, type CitationCharLocation as CitationCharLocation, type CitationCharLocationParam as CitationCharLocationParam, type CitationContentBlockLocation as CitationContentBlockLocation, type CitationContentBlockLocationParam as CitationContentBlockLocationParam, type CitationPageLocation as CitationPageLocation, type CitationPageLocationParam as CitationPageLocationParam, type CitationsConfigParam as CitationsConfigParam, type CitationsDelta as CitationsDelta, type ContentBlock as ContentBlock, type ContentBlockDeltaEvent as ContentBlockDeltaEvent, type ContentBlockParam as ContentBlockParam, type ContentBlockSource as ContentBlockSource, type ContentBlockSourceContent as ContentBlockSourceContent, type ContentBlockStartEvent as ContentBlockStartEvent, type ContentBlockStopEvent as ContentBlockStopEvent, type DocumentBlockParam as DocumentBlockParam, type ImageBlockParam as ImageBlockParam, type InputJsonDelta as InputJsonDelta, type InputJSONDelta as InputJSONDelta, type Message as Message, type MessageDeltaEvent as MessageDeltaEvent, type MessageDeltaUsage as MessageDeltaUsage, type MessageParam as MessageParam, type MessageStartEvent as MessageStartEvent, type MessageStopEvent as MessageStopEvent, type MessageStreamEvent as MessageStreamEvent, type MessageTokensCount as MessageTokensCount, type Metadata as Metadata, type Model as Model, type PlainTextSource as PlainTextSource, type RawContentBlockDeltaEvent as RawContentBlockDeltaEvent, type RawContentBlockStartEvent as RawContentBlockStartEvent, type RawContentBlockStopEvent as RawContentBlockStopEvent, type RawMessageDeltaEvent as RawMessageDeltaEvent, type RawMessageStartEvent as RawMessageStartEvent, type RawMessageStopEvent as RawMessageStopEvent, type RawMessageStreamEvent as RawMessageStreamEvent, type RedactedThinkingBlock as RedactedThinkingBlock, type RedactedThinkingBlockParam as RedactedThinkingBlockParam, type SignatureDelta as SignatureDelta, type TextBlock as TextBlock, type TextBlockParam as TextBlockParam, type TextCitation as TextCitation, type TextCitationParam as TextCitationParam, type TextDelta as TextDelta, type ThinkingBlock as ThinkingBlock, type ThinkingBlockParam as ThinkingBlockParam, type ThinkingConfigDisabled as ThinkingConfigDisabled, type ThinkingConfigEnabled as ThinkingConfigEnabled, type ThinkingDelta as ThinkingDelta, type Tool as Tool, type ToolChoice as ToolChoice, type ToolChoiceAny as ToolChoiceAny, type ToolChoiceAuto as ToolChoiceAuto, type ToolChoiceTool as ToolChoiceTool, type ToolResultBlockParam as ToolResultBlockParam, type ToolUseBlock as ToolUseBlock, type ToolUseBlockParam as ToolUseBlockParam, type Usage as Usage, type MessageCreateParams as MessageCreateParams, type MessageCreateParamsNonStreaming as MessageCreateParamsNonStreaming, type MessageCreateParamsStreaming as MessageCreateParamsStreaming, type MessageStreamParams as MessageStreamParams, type MessageCountTokensParams as MessageCountTokensParams, };
    export { Batches as Batches, type DeletedMessageBatch as DeletedMessageBatch, type MessageBatch as MessageBatch, type MessageBatchCanceledResult as MessageBatchCanceledResult, type MessageBatchErroredResult as MessageBatchErroredResult, type MessageBatchExpiredResult as MessageBatchExpiredResult, type MessageBatchIndividualResponse as MessageBatchIndividualResponse, type MessageBatchRequestCounts as MessageBatchRequestCounts, type MessageBatchResult as MessageBatchResult, type MessageBatchSucceededResult as MessageBatchSucceededResult, MessageBatchesPage as MessageBatchesPage, type BatchCreateParams as BatchCreateParams, type BatchListParams as BatchListParams, };
}
//# sourceMappingURL=messages.d.ts.map