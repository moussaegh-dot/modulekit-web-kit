/**
 * 📁 ToolbarViewModelBuilder.js
 *
 * 🎯 Build Toolbar ViewModel
 *
 * Transform page descriptor + runtime handlers
 * into a UI-ready toolbar model.
 */

import Page from "@moussaegh-dot/modulekit-engine/pages/helpers/Page.js";


export default class ToolbarViewModelBuilder {

    static build({

        page,

        values = {},

        meta = {},

        onChange = null,

        onReset = null,

        onCreate = null,

    }) {

        const toolbar =
            page?.descriptor?.toolbar ?? {};

        return {

            /*
            |--------------------------------------------------------------------------
            | Title
            |--------------------------------------------------------------------------
            */

            title:
                Page.title(page),

            description:
                Page.description(page),

            singular:
                Page.singular(page),


            /*
            |--------------------------------------------------------------------------
            | Search
            |--------------------------------------------------------------------------
            */

            search:
                toolbar.search !== false,


            /*
            |--------------------------------------------------------------------------
            | Filters
            |--------------------------------------------------------------------------
            */

            filtersEnabled:
                toolbar.filters !== false,

            filterFields:
                page?.resources?.filters?.fields ?? [],


            /*
            |--------------------------------------------------------------------------
            | Reset
            |--------------------------------------------------------------------------
            */

            reset:
                toolbar.reset !== false,


            /*
            |--------------------------------------------------------------------------
            | Create
            |--------------------------------------------------------------------------
            */

            create:
                toolbar.create !== false,


            /*
            |--------------------------------------------------------------------------
            | Runtime State
            |--------------------------------------------------------------------------
            */

            values,

            meta,


            /*
            |--------------------------------------------------------------------------
            | Handlers
            |--------------------------------------------------------------------------
            */

            onChange,

            onReset,

            onCreate,

        };

    }

}