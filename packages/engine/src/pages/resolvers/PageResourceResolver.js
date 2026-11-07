/**
 * 📁 core/pages/resolvers/PageResourceResolver.js
 *
 * Resolve page bindings against module UI resources.
 */

export default class PageResourceResolver {

    static resolve(ui, page) {

        const bindings = page.bindings ?? {};

        const actions = this.single(
            ui.actions,
            bindings.actions
        );

        return {

            table: this.single(
                ui.tables,
                bindings.table
            ),

            form: this.single(
                ui.forms,
                bindings.form
            ),

            view: this.single(
                ui.views,
                bindings.view
            ),

            filters: this.single(
                ui.filters,
                bindings.filters
            ),

            actions,

            widgets: this.collection(
                ui.widgets,
                bindings.widgets
            ),

            metrics: this.collection(
                ui.metrics,
                bindings.metrics
            ),

        };

    }

    static single(resources = {}, key) {

        return key
            ? resources[key] ?? null
            : null;

    }

    static collection(resources = {}, keys = []) {

        return Array.isArray(keys)
            ? keys
                .map(key => resources[key])
                .filter(Boolean)
            : [];

    }

}