/**
 * 📁 src/core/form/view/fields/AvatarView.jsx
 */

import ViewFieldWrapper from "../ViewFieldWrapper";
import { storageUrl } from "@moussaegh-dot/modulekit-http/utils/storageUrl.js";

const AvatarView = ({ field, value }) => {

    return (
        <ViewFieldWrapper field={field}>

            <div className="view-avatar-container">

                <div className="view-avatar-wrapper">

                    <img
                        src={storageUrl(value || "/images/default-avatar.png")}
                        alt={field.label || "Avatar"}
                        className="view-avatar"
                    />

                    {value && (
                        <span
                            className="view-avatar-status"
                            title="Image disponible"
                        />
                    )}

                </div>

            </div>

        </ViewFieldWrapper>
    );
};

export default AvatarView;