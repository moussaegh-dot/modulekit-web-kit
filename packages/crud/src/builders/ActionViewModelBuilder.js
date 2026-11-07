/**
 * 📁 ActionViewModelBuilder.js
 *
 * Transform CRUD action descriptors
 * into renderer-ready action view models.
 */

export default class ActionViewModelBuilder {

    static row(
        descriptors = [],
        handlers = {},
        row,
    ) {

        if (!Array.isArray(descriptors)) {
            return [];
        }

        return descriptors
            .filter(descriptor =>
                this.shouldDisplay(
                    descriptor,
                    row,
                )
            )
            .map(descriptor =>
                this.build(
                    descriptor,
                    handlers,
                    row,
                )
            )
            .filter(Boolean);
    }


    /*
    |--------------------------------------------------------------------------
    | DISPLAY
    |--------------------------------------------------------------------------
    */

    static shouldDisplay(
        descriptor,
        row,
    ) {

        if (!descriptor?.key) {
            return false;
        }

        /*
        |--------------------------------------------------------------------------
        | Static visibility
        |--------------------------------------------------------------------------
        */

        if (descriptor.visible === false) {
            return false;
        }

        /*
        |--------------------------------------------------------------------------
        | Dynamic visibility
        |--------------------------------------------------------------------------
        */

        return this.evaluateCondition(
            descriptor.visibleWhen,
            row,
        );
    }


    /*
    |--------------------------------------------------------------------------
    | CONDITION
    |--------------------------------------------------------------------------
    */

    static evaluateCondition(
        condition,
        row,
    ) {

        if (!condition) {
            return true;
        }

        const {
            field,
            operator,
            value,
        } = condition;

        const actual = row?.[field];

        switch (operator) {

            case '=':
            case '==':
            case '===':
                return actual === value;

            case '!=':
            case '!==':
            case '<>':
                return actual !== value;

            case '>':
                return actual > value;

            case '>=':
                return actual >= value;

            case '<':
                return actual < value;

            case '<=':
                return actual <= value;

            case 'in':
                return Array.isArray(value)
                    && value.includes(actual);

            case 'not_in':
                return Array.isArray(value)
                    && !value.includes(actual);

            case 'null':
                return actual == null;

            case 'not_null':
                return actual != null;

            default:
                return true;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | BUILD
    |--------------------------------------------------------------------------
    */

    static build(
        descriptor,
        handlers,
        row,
    ) {

        if (!descriptor?.key) {
            return null;
        }

        const handler =
            handlers?.[descriptor.key];

        if (typeof handler !== 'function') {
            return null;
        }

        const disabled =
            descriptor.disabled
            || this.evaluateDisabledCondition(
                descriptor.disabledWhen,
                row,
            );

        return {

            key: descriptor.key,

            label: descriptor.label,

            icon: descriptor.icon,

            color: descriptor.color,

            tooltip:
                descriptor.tooltip
                ?? descriptor.label,

            disabled,

            confirm:
                descriptor.confirm ?? false,

            onClick: () => handler(row),

        };
    }


    /*
    |--------------------------------------------------------------------------
    | DISABLED
    |--------------------------------------------------------------------------
    */

    static evaluateDisabledCondition(
        condition,
        row,
    ) {

        if (!condition) {
            return false;
        }

        return this.evaluateCondition(
            condition,
            row,
        );
    }
}