// src/core/pages/helpers/PageHelper.js

export default class Page {

    /*
    |--------------------------------------------------------------------------
    | Module
    |--------------------------------------------------------------------------
    */

    static module(page) {
        return page?.module ?? {};
    }

    static key(page) {
        return this.identity(page).key;
    }

    static identity(page) {
        return this.module(page).identity ?? {};
    }

    static entity(page) {
        return this.module(page).entity ?? {};
    }

    /*
    |--------------------------------------------------------------------------
    | Entity
    |--------------------------------------------------------------------------
    */

    static singular(page) {
        return this.entity(page).singular ?? "Élément";
    }

    static plural(page) {
        return this.entity(page).plural ?? "Éléments";
    }

    // static label(page) {
    //     return (
    //         this.entity(page).label ??
    //         this.singular(page)
    //     );
    // }

    static description(page) {
        return this.entity(page).description ?? "";
    }

    static title(page) {
        return this.identity(page).label ?? "";
    }

    /*
    |--------------------------------------------------------------------------
    | Page
    |--------------------------------------------------------------------------
    */

    static descriptor(page) {
        return page?.descriptor ?? {};
    }

    static component(page) {
        return this.descriptor(page).component;
    }

    static variant(page) {
        return this.descriptor(page).variant;
    }

    static bindings(page) {
        return this.descriptor(page).bindings ?? {};
    }

    static resources(page) {
        return page?.resources ?? {};
    }

    static table(page) {
        return this.resources(page).table;
    }

    static form(page) {
        return this.resources(page).form;
    }

    static filters(page) {
        return this.resources(page).filters;
    }

    static actions(page) {
        return this.resources(page).actions;
    }

    static widgets(page) {
        return this.resources(page).widgets ?? [];
    }

    static metrics(page) {
        return this.resources(page).metrics ?? [];
    }

    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    static modalTitle(action, page) {

        const entity = this.singular(page);

        return {

            create: `Créer ${entity}`,

            edit: `Modifier ${entity}`,

            view: `Détails ${entity}`,

            delete: `Supprimer ${entity}`,

        }[action] ?? entity;

    }

    /*
    |--------------------------------------------------------------------------
    | API
    |--------------------------------------------------------------------------
    */

    static endpoint(page) {
        return `/api/${this.key(page)}`;
    }

    static form(page){
        return this.resources(page).form;
    }

}