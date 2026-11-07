// src/core/pages/resolvers/EndpointResolver.js

import Page from "../helpers/Page";

export default class EndpointResolver {

    /*
    |--------------------------------------------------------------------------
    | Base
    |--------------------------------------------------------------------------
    */

    static base(page) {

        return Page.endpoint(page);

    }

    static index(page) {
        return this.base(page);
    }

    static store(page) {
        return this.base(page);
    }

    static show(page, id) 
    {
        return `${this.base(page)}/${id}`;
    }

    static update(page, id) {
        return `${this.base(page)}/${id}`;
    }

    static destroy(page, id) {
        return `${this.base(page)}/${id}`;
    }
    /*
    |--------------------------------------------------------------------------
    | Custom Action
    |--------------------------------------------------------------------------
    */

    static action(
        page,
        action,
        id = null
    ) {

        if (!action) {
            throw new Error(
                "Action key is required."
            );
        }

        return id !== null && id !== undefined
            ? `${this.base(page)}/${encodeURIComponent(id)}/${encodeURIComponent(action)}`
            : `${this.base(page)}/${encodeURIComponent(action)}`;
    }

}