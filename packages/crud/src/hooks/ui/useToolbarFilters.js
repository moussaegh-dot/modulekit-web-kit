import {
    useEffect,
    useMemo,
    useState,
} from "react";

import RelationService from "@moussaegh-dot/modulekit-http/services/RelationService.js";


export function useToolbarFilters({
    filters = [],
    values = {},
    meta = {},
    onChange,
}) {

    /*
    |--------------------------------------------------------------------------
    | Relation options
    |--------------------------------------------------------------------------
    */

    const [relationOptions, setRelationOptions] =
        useState({});


    /*
    |--------------------------------------------------------------------------
    | Load relation options
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const relationFilters =
            filters.filter(
                (filter) =>
                    filter?.relation?.resource &&
                    filter?.key
            );

        if (!relationFilters.length) {
            setRelationOptions({});
            return;
        }

        let cancelled = false;


        const loadOptions = async () => {

            const results =
                await Promise.all(
                    relationFilters.map(
                        async (filter) => {

                            const relation =
                                filter.relation;

                            try {

                                const options =
                                    await RelationService.options(
                                        relation.resource,
                                        {
                                            labelColumn:
                                                relation.labelColumn,

                                            valueColumn:
                                                relation.valueColumn,
                                        }
                                    );


                                return {
                                    key: filter.key,

                                    options:
                                        Array.isArray(options)
                                            ? options
                                            : [],
                                };

                            } catch (error) {

                                console.error(
                                    `Failed to load options for filter [${filter.key}]`,
                                    error
                                );

                                return {
                                    key: filter.key,
                                    options: [],
                                };
                            }
                        }
                    )
                );


            if (cancelled) {
                return;
            }


            const nextOptions =
                results.reduce(
                    (
                        accumulator,
                        result
                    ) => {

                        accumulator[result.key] =
                            result.options;

                        return accumulator;

                    },
                    {}
                );


            setRelationOptions(
                nextOptions
            );
        };


        loadOptions();


        return () => {
            cancelled = true;
        };

    }, [filters]);


    /*
    |--------------------------------------------------------------------------
    | Normalize filters
    |--------------------------------------------------------------------------
    */

    const normalizedFilters =
        useMemo(
            () => {

                return filters.map(
                    (filter) => {

                        const relation =
                            filter?.relation ?? null;


                        /*
                        |--------------------------------------------------------------------------
                        | Source des options
                        |--------------------------------------------------------------------------
                        */

                        let source = [];


                        if (relation) {

                            source =
                                relationOptions?.[
                                    filter.key
                                ] ?? [];

                        } else if (
                            filter.optionsFrom
                        ) {

                            source =
                                meta?.[
                                    filter.optionsFrom
                                ] ?? [];

                        } else {

                            source =
                                filter.options ?? [];
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Colonnes relationnelles
                        |--------------------------------------------------------------------------
                        */

                        const valueColumn =
                            relation?.valueColumn ?? "id";

                        const labelColumn =
                            relation?.labelColumn ?? "nom";


                        /*
                        |--------------------------------------------------------------------------
                        | Normalisation des options
                        |--------------------------------------------------------------------------
                        */

                        let options = [];


                        if (Array.isArray(source)) {

                            options =
                                source
                                    .map(
                                        (option) => {

                                            if (
                                                option &&
                                                typeof option === "object"
                                            ) {

                                                return {
                                                    value:
                                                        option.value ??
                                                        option[valueColumn] ??
                                                        null,

                                                    label:
                                                        option.label ??
                                                        option[labelColumn] ??
                                                        "",
                                                };
                                            }


                                            return {
                                                value: option,
                                                label: option,
                                            };
                                        }
                                    )
                                    .filter(
                                        (option) =>
                                            option.value !== null &&
                                            option.value !== undefined
                                    );

                        } else if (
                            source &&
                            typeof source === "object"
                        ) {

                            options =
                                Object.entries(
                                    source
                                ).map(
                                    ([value, label]) => ({
                                        value,
                                        label,
                                    })
                                );
                        }


                        /*
                        |--------------------------------------------------------------------------
                        | Filter final
                        |--------------------------------------------------------------------------
                        */

                        return {

                            ...filter,

                            relation,

                            isRelation:
                                Boolean(relation),

                            optionsResource:
                                relation?.resource ?? null,

                            options,

                            value:
                                values?.[
                                    filter.key
                                ] ?? "",
                        };
                    }
                );

            },
            [
                filters,
                values,
                meta,
                relationOptions,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        key,
        value
    ) => {

        onChange?.(
            key,
            value
        );
    };


    return {
        normalizedFilters,
        handleChange,
    };
}
