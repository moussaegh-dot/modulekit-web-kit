import ViewFieldWrapper from "../ViewFieldWrapper";

const TextView = ({ field, value }) => {

    if (!value) {
        return (
            <ViewFieldWrapper field={field}>
                <span className="view-field-empty">—</span>
            </ViewFieldWrapper>
        );
    }

    const maxLength =
        field.maxLength || 100;

    const truncateText = (text) => {

        if (String(text).length <= maxLength) {
            return text;
        }

        return `${String(text).substring(0, maxLength)}...`;
    };

    const isTruncated =
        field.truncate &&
        String(value).length > maxLength;

    return (
        <ViewFieldWrapper field={field}>

            <div className="view-text">

                {field.icon && (
                    <i
                        className={`fas fa-${field.icon} view-text-icon`}
                    />
                )}

                <div className="view-text-content">

                    <div className="view-text-value">
                        {field.truncate
                            ? truncateText(value)
                            : value}
                    </div>

                    {isTruncated && (
                        <span className="view-text-hint">
                            Cliquez pour voir plus
                        </span>
                    )}

                </div>

            </div>

        </ViewFieldWrapper>
    );
};

export default TextView;