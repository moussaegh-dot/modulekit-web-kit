export function hasPath(object, path)
{
    return resolvePath(object, path) !== undefined;
}