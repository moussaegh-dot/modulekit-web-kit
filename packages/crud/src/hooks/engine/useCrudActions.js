/**
 * 📁 useCrudActions.js
 *
 * 🎯 CRUD Action Hook
 */

import { useMemo } from "react";

import { useModal } from "../../form/modal/ModalProvider";
import { useToast } from "@moussaegh-dot/modulekit-shell/ui/toast/useToast.js";

import CrudActionFactory from "../../builders/CrudActionFactory";

export function useCrudActions({

    page,

    refresh,

}) {

    /*
    |--------------------------------------------------------------------------
    | UI Services
    |--------------------------------------------------------------------------
    */

    const modal = useModal();

    const toast = useToast();

    /*
    |--------------------------------------------------------------------------
    | Action Handlers
    |--------------------------------------------------------------------------
    */

    return useMemo(

        () =>
            CrudActionFactory.build({

                page,

                modal,

                toast,

                refresh,

            }),

        [
            page,
            modal,
            toast,
            refresh,
        ],

    );

}
