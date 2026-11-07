// src/core/utils/toFormData.js

export default function toFormData(
    data,
    formData = new FormData(),
    parentKey = null
) {
    Object.entries(data).forEach(
        ([key, value]) => {

            const formKey = parentKey
                ? `${parentKey}[${key}]`
                : key;

            if (
                value === null ||
                value === undefined
            ) {
                return;
            }

            if (
                value instanceof File ||
                value instanceof Blob
            ) {
                formData.append(
                    formKey,
                    value
                );

                return;
            }

            if (
                Array.isArray(value)
            ) {
                value.forEach(
                    (item, index) => {

                        if (
                            item instanceof File ||
                            item instanceof Blob
                        ) {
                            formData.append(
                                `${formKey}[${index}]`,
                                item
                            );

                            return;
                        }

                        if (
                            typeof item === "object" &&
                            item !== null
                        ) {
                            toFormData(
                                item,
                                formData,
                                `${formKey}[${index}]`
                            );

                            return;
                        }

                        formData.append(
                            `${formKey}[${index}]`,
                            item
                        );
                    }
                );

                return;
            }

            if (
                typeof value === "object"
            ) {
                toFormData(
                    value,
                    formData,
                    formKey
                );

                return;
            }

            formData.append(
                formKey,
                value
            );
        }
    );

    return formData;
}