import ViewFieldWrapper from "../ViewFieldWrapper";

const SelectView = ({ field, value }) => {

    if (!value) {
        return (
            <ViewFieldWrapper field={field}>
                <span className="view-field-empty">—</span>
            </ViewFieldWrapper>
        );
    }

    const option =
        field.options?.find(
            (opt) => String(opt.value) === String(value)
        );

    const getOptionType = (val) => {

        const colors = {
            actif: "success",
            inactif: "neutral",
            en_attente: "warning",
            bloque: "danger",
            annule: "danger",
            valide: "success",
            en_cours: "info",
            termine: "primary",
        };

        return colors[
            String(val).toLowerCase()
        ] || "neutral";
    };

    const type = getOptionType(value);

    return (
        <ViewFieldWrapper field={field}>

            <div className="view-select">

                <i className="fas fa-chevron-right view-select-icon" />

                <span
                    className={`view-badge view-badge-${type}`}
                >
                    {option?.label || value}
                </span>

            </div>

        </ViewFieldWrapper>
    );
};

export default SelectView;