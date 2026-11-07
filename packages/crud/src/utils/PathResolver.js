/**
 * Resolve nested object path.
 *
 * Examples:
 *  resolvePath(user, "name")
 *  resolvePath(user, "campus.nom")
 *  resolvePath(user, "service.categorie.nom")
 */

export function resolvePath(object, path, fallback = undefined)
{
    if (!object || !path) {
        return fallback;
    }

    return path
        .split(".")
        .reduce(
            (value, segment) => value?.[segment],
            object
        ) ?? fallback;
}