// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.
import { APIResource } from "../../resource.mjs";
import * as ModelsAPI from "./models.mjs";
import { BetaModelInfosPage, Models } from "./models.mjs";
import * as MessagesAPI from "./messages/messages.mjs";
import { Messages, } from "./messages/messages.mjs";
export class Beta extends APIResource {
    constructor() {
        super(...arguments);
        this.models = new ModelsAPI.Models(this._client);
        this.messages = new MessagesAPI.Messages(this._client);
    }
}
Beta.Models = Models;
Beta.BetaModelInfosPage = BetaModelInfosPage;
Beta.Messages = Messages;
//# sourceMappingURL=beta.mjs.map