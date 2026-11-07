// src/core/pages/services/PageService.js

import axios from "@moussaegh-dot/modulekit-http/api/axiosClient.js";
import EndpointResolver from "../resolvers/EndpointResolver";
import toFormData from "@moussaegh-dot/modulekit-http/utils/toFormData.js";

function containsFile(data) {
    return Object.values(data).some(
        (value) =>
            value instanceof File ||
            value instanceof Blob
    );
}

function preparePayload(payload) {
    return containsFile(payload)
        ? toFormData(payload)
        : payload;
}

export default class PageService {

    /*
    |--------------------------------------------------------------------------
    | Read
    |--------------------------------------------------------------------------
    */

    static async list(
        page,
        params = {},
        config = {}
    ) {
                const { data } = await axios.get(
            EndpointResolver.index(page),
            {
                params,
                ...config,
            }
        );
        return data;
    }

    static async show(
        page,
        id,
        config = {}
    ) {
        const { data } = await axios.get(
            EndpointResolver.show(page, id),
            config
        );

        return data;
    }

    /*
    |--------------------------------------------------------------------------
    | Write
    |--------------------------------------------------------------------------
    */

    static async create(
        page,
        payload,
        config = {}
    ) {
        const body = preparePayload(payload);

        const { data } = await axios.post(
            EndpointResolver.store(page),
            body,
            config
        );

        return data;
    }

    static async update(
        page,
        id,
        payload,
        config = {}
    ) {

        const body = preparePayload(payload);

        const endpoint =
            EndpointResolver.update(page, id);

        /*
        |--------------------------------------------------------------------------
        | Multipart update
        |--------------------------------------------------------------------------
        */

        if (body instanceof FormData) {

            body.append("_method", "PUT");

            const { data } = await axios.post(
                endpoint,
                body,
                config
            );

            return data;
        }

        /*
        |--------------------------------------------------------------------------
        | JSON update
        |--------------------------------------------------------------------------
        */

        const { data } = await axios.put(
            endpoint,
            body,
            config
        );

        return data;
    }

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    static async destroy(
        page,
        id,
        config = {}
    ) {
        const { data } = await axios.delete(
            EndpointResolver.destroy(page, id),
            config
        );

        return data;
    }

    /*
    |--------------------------------------------------------------------------
    | Custom Action
    |--------------------------------------------------------------------------
    */

    static async action(
        page,
        action,
        id = null,
        payload = {},
        config = {}
    ) {
        const body = preparePayload(payload);

        const { data } = await axios.post(
            EndpointResolver.action(
                page,
                action,
                id
            ),
            body,
            config
        );

        return data;
    }
}