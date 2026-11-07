// src/core/modules/LayoutResolver.js

export default class LayoutResolver {

    static resolve(module, descriptor) {

        if (!module?.ui) {
            return null;
        }

        /*
        |--------------------------------------------------------------------------
        | Priority
        |--------------------------------------------------------------------------
        |
        | Page layout
        | Module default layout
        |--------------------------------------------------------------------------
        */

        return (
            descriptor?.layout
            ?? module.ui.layout
            ?? null
        );
    }

}