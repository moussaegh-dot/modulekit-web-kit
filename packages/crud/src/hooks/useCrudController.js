/**
 * 📁 useCrudController.js
 *
 * 🎯 Compose the complete CRUD ViewModel.
 */

import {
    useCrudEngine,
    useCrudData,
    useCrudActions,
} from ".";

import CrudViewModelBuilder
    from "../builders/CrudViewModelBuilder";


export function useCrudController(page) {

    /*
    |--------------------------------------------------------------------------
    | Engine
    |--------------------------------------------------------------------------
    */

    const engine = useCrudEngine(page);


    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */

    const {

        data,

        meta,

        loading,

        error,

        refresh,

    } = useCrudData(

        page,

        engine.apiParams,

    );


    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    */

    const handlers = useCrudActions({

        page,

        refresh,

    });


    /*
    |--------------------------------------------------------------------------
    | ViewModel
    |--------------------------------------------------------------------------
    */
// console.log("CRUD CONTROLLER DATA", data);
    return CrudViewModelBuilder.build({

        page,

        engine,

        data,

        meta,

        handlers,

        loading,

        error,

    });

}