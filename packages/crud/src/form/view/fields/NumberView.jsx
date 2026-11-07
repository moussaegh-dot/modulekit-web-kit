import { getKitConfig } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";
import ViewFieldWrapper from "../ViewFieldWrapper";

const NumberView = ({ field, value }) => {

    const formatNumber = (num) => {

        if (num === null || num === undefined) {
            return "—";
        }

        const decimals = field.decimals || 0;

        return new Intl.NumberFormat(
            getKitConfig().locale,
            {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
                style: field.currency
                    ? "currency"
                    : "decimal",
                currency: field.currency || getKitConfig().currency,
            }
        ).format(num);
    };

    return (
        <ViewFieldWrapper field={field}>

            <div className="view-number">

                {field.icon && (
                    <i
                        className={`fas fa-${field.icon} view-number-icon`}
                    />
                )}

                <span className="view-number-value">
                    {formatNumber(value)}
                </span>

                {field.suffix && (
                    <span className="view-number-suffix">
                        {field.suffix}
                    </span>
                )}

            </div>

        </ViewFieldWrapper>
    );
};

export default NumberView;