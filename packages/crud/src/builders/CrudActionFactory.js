/**
 * 📁 CrudActionFactory.js
 *
 * 🎯 Build CRUD action handlers.
 */

import Page from "@moussaegh-dot/modulekit-engine/pages/helpers/Page.js";
import PageService from "@moussaegh-dot/modulekit-engine/pages/services/PageService.js";
import ModalViewModelBuilder from "./ModalViewModelBuilder";


export default class CrudActionFactory {

    /*
    |--------------------------------------------------------------------------
    | BUILD
    |--------------------------------------------------------------------------
    */

    static build({
        page,
        modal,
        toast,
        refresh,
    }) {

        const entity = Page.entity(page);

        return {

            /*
            |------------------------------------------------------------------
            | Native CRUD actions
            |------------------------------------------------------------------
            */

            create: this.create({
                page,
                entity,
                modal,
                toast,
                refresh,
            }),

            view: this.view({
                page,
                modal,
            }),

            edit: this.edit({
                page,
                entity,
                modal,
                toast,
                refresh,
            }),

            delete: this.delete({
                page,
                entity,
                modal,
                toast,
                refresh,
            }),

            /*
            |------------------------------------------------------------------
            | Module actions
            |------------------------------------------------------------------
            */

            ...this.moduleActions({
                page,
                modal,
                toast,
                refresh,
            }),
        };
    }


    /*
    |--------------------------------------------------------------------------
    | MODULE ACTIONS
    |--------------------------------------------------------------------------
    */

    static moduleActions({
        page,
        modal,
        toast,
        refresh,
    }) {

        const actions =
            page?.resources?.actions?.row ?? [];

        const handlers = {};

        const nativeActions = new Set([
            "create",
            "view",
            "edit",
            "delete",
        ]);

        for (const action of actions) {

            if (!action?.key) {
                continue;
            }

            /*
            |------------------------------------------------------------------
            | Native actions are handled separately
            |------------------------------------------------------------------
            */

            if (nativeActions.has(action.key)) {
                continue;
            }

            /*
            |------------------------------------------------------------------
            | Avoid duplicate handlers
            |------------------------------------------------------------------
            */

            if (handlers[action.key]) {
                continue;
            }

            handlers[action.key] =
                this.moduleAction({
                    page,
                    action,
                    modal,
                    toast,
                    refresh,
                });
        }

        return handlers;
    }


    /*
    |--------------------------------------------------------------------------
    | MODULE ACTION
    |--------------------------------------------------------------------------
    */

    static moduleAction({
        page,
        action,
        modal,
        toast,
        refresh,
    }) {

        return async (row) => {

            if (!row?.id) {

                toast?.error(
                    "Impossible d'exécuter l'action : identifiant introuvable."
                );

                return;
            }

            const entity = Page.entity(page);


            /*
            |------------------------------------------------------------------
            | MODAL ACTION
            |------------------------------------------------------------------
            */

            if (action.modal) {

                if (!modal) {

                    console.error(
                        "❌ Modal provider unavailable for action:",
                        action.key
                    );

                    toast?.error(
                        "Impossible d'ouvrir la fenêtre de gestion."
                    );

                    return;
                }

                modal.openModal(
                    action.modal,
                    {
                        title: action.label,

                        data: row,

                        page,

                        action,

                        relation:
                            action.relations?.[0] ?? {},
                        onSubmit: async (payload = {}) => {

                            try {

                                const result =
                                    await PageService.action(
                                        page,
                                        action.key,
                                        row.id,
                                        payload,
                                    );

                                toast?.success(
                                    result?.message ??
                                    `${action.label} effectué avec succès`
                                );

                                modal.closeModal();

                                refresh?.();

                                return result;

                            } catch (error) {

                                toast?.error(
                                    error?.response?.data?.message ??
                                    `Impossible d'effectuer l'action "${action.label}".`
                                );

                                throw error;
                            }
                        },
                    }
                );

                return;
            }


            /*
            |------------------------------------------------------------------
            | CONFIRMATION
            |------------------------------------------------------------------
            */

            if (action.confirm) {

                const confirmed =
                    window.confirm(
                        this.confirmationMessage({
                            action,
                            entity,
                        })
                    );

                if (!confirmed) {
                    return;
                }
            }


            /*
            |------------------------------------------------------------------
            | DIRECT ACTION
            |------------------------------------------------------------------
            */

            try {

                const result =
                    await PageService.action(
                        page,
                        action.key,
                        row.id,
                    );

                toast?.success(
                    result?.message ??
                    `${action.label} effectué avec succès`
                );

                refresh?.();

                return result;

            } catch (error) {

                toast?.error(
                    error?.response?.data?.message ??
                    `Impossible d'effectuer l'action "${action.label}".`
                );

                throw error;
            }
        };
    }


    /*
    |--------------------------------------------------------------------------
    | HELPERS
    |--------------------------------------------------------------------------
    */

    static confirmationMessage({
        action,
        entity,
    }) {

        const article =
            entity.gender === "f"
                ? "cette"
                : "cet";

        return (
            `Voulez-vous vraiment ` +
            `${action.label.toLowerCase()} ` +
            `${article} ` +
            `${entity.singular} ?`
        );
    }


    static open(
        modal,
        viewModel,
    ) {

        modal.openModal(
            viewModel.type,
            viewModel.props,
        );
    }


    static success({
        toast,
        modal,
        refresh,
        message,
    }) {

        toast.success(message);

        modal.closeModal();

        refresh?.();
    }


    /*
    |--------------------------------------------------------------------------
    | CREATE
    |--------------------------------------------------------------------------
    */

    static create({
        page,
        entity,
        modal,
        toast,
        refresh,
    }) {

        return () => {

            this.open(
                modal,

                ModalViewModelBuilder.form({
                    page,
                    mode: "create",

                    onSubmit: async (data) => {

                        await PageService.create(
                            page,
                            data,
                        );

                        this.success({
                            toast,
                            modal,
                            refresh,
                            message:
                                `${entity.singular} créé avec succès`,
                        });
                    },
                }),
            );
        };
    }


    /*
    |--------------------------------------------------------------------------
    | VIEW
    |--------------------------------------------------------------------------
    */

    static view({
        page,
        modal,
    }) {

        return (row) => {

            this.open(
                modal,

                ModalViewModelBuilder.view({
                    page,
                    data: row,
                }),
            );
        };
    }


    /*
    |--------------------------------------------------------------------------
    | EDIT
    |--------------------------------------------------------------------------
    */

    static edit({
        page,
        entity,
        modal,
        toast,
        refresh,
    }) {

        return (row) => {

            this.open(
                modal,

                ModalViewModelBuilder.form({
                    page,
                    mode: "edit",
                    values: row,

                    onSubmit: async (data) => {

                        await PageService.update(
                            page,
                            row.id,
                            data,
                        );

                        this.success({
                            toast,
                            modal,
                            refresh,
                            message:
                                `${entity.singular} mis à jour avec succès`,
                        });
                    },
                }),
            );
        };
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    static delete({
        page,
        entity,
        modal,
        toast,
        refresh,
    }) {

        return (row) => {

            this.open(
                modal,

                ModalViewModelBuilder.confirm({
                    page,

                    onConfirm: async () => {

                        await PageService.destroy(
                            page,
                            row.id,
                        );

                        this.success({
                            toast,
                            modal,
                            refresh,
                            message:
                                `${entity.singular} supprimé avec succès`,
                        });
                    },
                }),
            );
        };
    }

}