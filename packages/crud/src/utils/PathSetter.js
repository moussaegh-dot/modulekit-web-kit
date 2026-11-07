
export function setPath(object, path, value)
{
    const segments = path.split(".");

    const last = segments.pop();

    const target = segments.reduce((current, segment) => {

        if (!current[segment]) {
            current[segment] = {};
        }

        return current[segment];

    }, object);

    target[last] = value;

    return object;
}