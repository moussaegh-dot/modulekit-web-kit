/**
 * core/pages/resolvers/ActionResourceResolver.js
 */

export default class ActionResourceResolver {

    static rows(actions) {

        return actions?.row ?? [];

    }

    static bulk(actions) {

        return actions?.bulk ?? [];

    }

    static all(actions) {

        return [
            ...this.rows(actions),
            ...this.bulk(actions),
        ];

    }

}