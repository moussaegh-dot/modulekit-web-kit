// src/core/crud/utils/buildEndpoint.js

export function buildEndpoint(
    page,
    id = null,
    action = null
){

    const base =
        `/api/${page.module.identity.key}`;

    if(action){

        return `${base}/${id}/${action}`;

    }

    if(id){

        return `${base}/${id}`;

    }

    return base;

}