import ViewFieldWrapper from "../ViewFieldWrapper";

const DateView = ({ field, value }) => {

    if (!value) {
        return (
            <ViewFieldWrapper field={field}>
                <span className="view-field-empty">—</span>
            </ViewFieldWrapper>
        );
    }

    const date = new Date(value);

    const formatted = new Intl.DateTimeFormat(
        "fr-FR",
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(date);

    const weekday = new Intl.DateTimeFormat(
        "fr-FR",
        {
            weekday: "long",
        }
    ).format(date);

    return (
        <ViewFieldWrapper field={field}>

            <div className="view-date">

                <div className="view-date-icon">
                    <i className="fas fa-calendar-alt" />
                </div>

                <div>
                    <div className="view-date-value">
                        {formatted}
                    </div>

                    {field.showRelative && (
                        <div className="view-date-relative">
                            {weekday}
                        </div>
                    )}
                </div>

            </div>

        </ViewFieldWrapper>
    );
};

export default DateView;