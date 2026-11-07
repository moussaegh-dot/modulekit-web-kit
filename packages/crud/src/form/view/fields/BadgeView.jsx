import { getKitConfig } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";
import ViewFieldWrapper from "../ViewFieldWrapper";

const BadgeView = ({ field, value }) => {

    if (!value) {
        return (
            <ViewFieldWrapper field={field}>
                <span className="view-field-empty">—</span>
            </ViewFieldWrapper>
        );
    }

    const getBadgeType = (val) => {

        const colors = getKitConfig().badgeColors;

        return colors[
            String(val).toLowerCase()
        ] || "primary";
    };

    return (
        <ViewFieldWrapper field={field}>

            <span
                className={`view-badge view-badge-${getBadgeType(value)}`}
            >
                <i className="fas fa-tag" />
                {value}
            </span>

        </ViewFieldWrapper>
    );
};

export default BadgeView;