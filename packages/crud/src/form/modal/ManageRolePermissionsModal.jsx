/**
 * 📁 src/core/form/modal/modals/ManageRolePermissionsModal.jsx
 */

import {
    useEffect,
    useState,
} from "react";

import ModalShell from "./ModalShell";

import RelationService from "@moussaegh-dot/modulekit-http/services/RelationService.js";


export default function ManageRolePermissionsModal({
    title = "Gérer les permissions",
    data = {},
    relation = {},
    onClose,
    onSubmit,
}) {

    const [permissions, setPermissions] = useState([]);
    const [selected, setSelected] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);


    /*
    |--------------------------------------------------------------------------
    | RELATION CONFIG
    |--------------------------------------------------------------------------
    */

    const resource =
        relation?.resource || "permissions";

    const labelColumn =
        relation?.labelColumn || "name";

    const valueColumn =
        relation?.valueColumn || "id";


    /*
    |--------------------------------------------------------------------------
    | INITIAL SELECTION
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const current =
            Array.isArray(data?.permissions)
                ? data.permissions
                : [];

        const ids = current
            .map(permission => {

                if (
                    permission &&
                    typeof permission === "object"
                ) {
                    return permission.id;
                }

                return permission;
            })
            .filter(
                id =>
                    id !== null &&
                    id !== undefined
            );

        setSelected(ids);

    }, [data?.id, data?.permissions]);


    /*
    |--------------------------------------------------------------------------
    | LOAD OPTIONS
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        let mounted = true;

        const load = async () => {

            setLoading(true);
            setError(null);

            try {

                const response =
                    await RelationService.options(
                        resource,
                        {
                            labelColumn,
                            valueColumn,
                        }
                    );

                const items =
                    response?.data ??
                    response ??
                    [];

                if (!mounted) {
                    return;
                }

                setPermissions(
                    Array.isArray(items)
                        ? items
                        : []
                );

            } catch (error) {

                console.error(
                    "ManageRolePermissionsModal: unable to load permissions.",
                    error
                );

                if (!mounted) {
                    return;
                }

                setError(
                    error?.response?.data?.message
                    ??
                    "Impossible de charger les permissions."
                );

            } finally {

                if (mounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };

    }, [
        resource,
        labelColumn,
        valueColumn,
    ]);


    /*
    |--------------------------------------------------------------------------
    | TOGGLE
    |--------------------------------------------------------------------------
    */

    const toggle = (permissionId) => {

        setSelected(current => {

            if (current.includes(permissionId)) {

                return current.filter(
                    id => id !== permissionId
                );
            }

            return [
                ...current,
                permissionId,
            ];
        });
    };


    /*
    |--------------------------------------------------------------------------
    | SUBMIT
    |--------------------------------------------------------------------------
    */

    const handleSubmit = async event => {

        event.preventDefault();

        if (!onSubmit || saving) {
            return;
        }

        setSaving(true);
        setError(null);

        try {

            await onSubmit({
                permissions: selected,
            });

        } catch (error) {

            console.error(
                "ManageRolePermissionsModal: unable to save permissions.",
                error
            );

            setError(
                error?.response?.data?.message
                ??
                "Impossible d'enregistrer les permissions."
            );

        } finally {

            setSaving(false);
        }
    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (
        <ModalShell
            title={title}
            onClose={saving ? undefined : onClose}
        >

            <form onSubmit={handleSubmit}>

                <div className="mb-4">

                    <div className="text-muted small">
                        Rôle
                    </div>

                    <div className="fw-semibold">
                        {data?.name ?? "-"}
                    </div>

                </div>


                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                {loading && (

                    <div className="modal-empty-state">

                        <div className="modal-empty-icon">
                            <i className="fas fa-spinner fa-spin" />
                        </div>

                        <div>
                            <div className="modal-empty-title">
                                Chargement des permissions...
                            </div>

                            <div className="modal-empty-description">
                                Veuillez patienter.
                            </div>
                        </div>

                    </div>
                )}


                {!loading &&
                    !error &&
                    permissions.length === 0 && (

                    <div className="modal-empty-state">

                        <div className="modal-empty-icon">
                            <i className="fas fa-key" />
                        </div>

                        <div>
                            <div className="modal-empty-title">
                                Aucune permission disponible
                            </div>

                            <div className="modal-empty-description">
                                Aucune permission n'est disponible.
                            </div>
                        </div>

                    </div>
                )}


                {!loading &&
                    permissions.length > 0 && (

                    <div className="row g-2">

                        {permissions.map(permission => {

                            const id =
                                permission?.value;

                            const label =
                                permission?.label;

                            if (
                                id === null ||
                                id === undefined
                            ) {
                                return null;
                            }

                            const checked =
                                selected.includes(id);

                            return (
                                <div
                                    key={id}
                                    className="col-12 col-md-6"
                                >

                                    <label
                                        className={`
                                            d-flex
                                            align-items-center
                                            gap-2
                                            p-2
                                            border
                                            rounded
                                            cursor-pointer
                                            ${
                                                checked
                                                    ? "bg-light"
                                                    : ""
                                            }
                                        `}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            disabled={saving}
                                            onChange={() =>
                                                toggle(id)
                                            }
                                        />

                                        <span>
                                            {label ?? `#${id}`}
                                        </span>

                                    </label>

                                </div>
                            );
                        })}

                    </div>
                )}


                <div className="modal-actions modal-actions-end">

                    <button
                        type="button"
                        className="modal-btn modal-btn-secondary"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        className="modal-btn modal-btn-primary"
                        disabled={
                            loading ||
                            saving ||
                            !!error
                        }
                    >
                        {saving
                            ? "Enregistrement..."
                            : "Enregistrer"
                        }
                    </button>

                </div>

            </form>

        </ModalShell>
    );
}