import { AnthropicError } from "../../error.js";
import { ReadableStreamToAsyncIterable } from "../stream-utils.js";
import { type Response } from "../../_shims/index.js";
import { LineDecoder, type Bytes } from "./line.js";

export class JSONLDecoder<T> {
  controller: AbortController;

  constructor(
    private iterator: AsyncIterableIterator<Bytes>,
    controller: AbortController,
  ) {
    this.controller = controller;
  }

  private async *decoder(): AsyncIterator<T, any, undefined> {
    const lineDecoder = new LineDecoder();
    for await (const chunk of this.iterator) {
      for (const line of lineDecoder.decode(chunk)) {
        yield JSON.parse(line);
      }
    }

    for (const line of lineDecoder.flush()) {
      yield JSON.parse(line);
    }
  }

  [Symbol.asyncIterator](): AsyncIterator<T> {
    return this.decoder();
  }

  static fromResponse<T>(response: Response, controller: AbortController): JSONLDecoder<T> {
    if (!response.body) {
      controller.abort();
      throw new AnthropicError(`Attempted to iterate over a response with no body`);
    }

    return new JSONLDecoder(ReadableStreamToAsyncIterable<Bytes>(response.body), controller);
  }
}
