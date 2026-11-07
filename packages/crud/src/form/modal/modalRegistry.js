import FormModal from "./FormModal";
import ConfirmModal from "./ConfirmModal";
import ViewModal from "./ViewModal";
import ManageRolePermissionsModal
    from "./ManageRolePermissionsModal";

export const modalRegistry = {
    form: FormModal,
    confirm: ConfirmModal,
    view: ViewModal,
    manage: ManageRolePermissionsModal,
};