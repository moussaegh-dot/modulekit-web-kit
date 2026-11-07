// src/core/form/FormProvider.jsx

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";

import {
    resolvePath,
    setPath,
} from "../utils";

const FormContext = createContext(null);


/**
 * 🎯 FORM STATE PROVIDER
 */
export const FormProvider = ({
    children,
    initialValues = {},
    onSubmit,
    formKey,
}) => {

    const [form, setForm] = useState(initialValues ?? {});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);


    /**
     * Réinitialise le formulaire uniquement lorsque
     * l'identité du formulaire change.
     */
    useEffect(() => {

        setForm(initialValues ?? {});
        setErrors({});
        setLoading(false);

    }, [formKey]);


    const setValue = useCallback(
        (path, value) => {

            setForm(prev => {

                const next = structuredClone(prev);

                setPath(next, path, value);

                return next;
            });

        },
        []
    );


    const getValue = useCallback(
        (path) => resolvePath(form, path, ""),
        [form]
    );


    const getError = useCallback(
        path => resolvePath(errors, path),
        [errors]
    );


    const setError = useCallback(
        (path, error) => {

            setErrors(prev => {

                const next = structuredClone(prev);

                setPath(next, path, error);

                return next;
            });

        },
        []
    );


    const clearError = useCallback(
        path => {

            setErrors(prev => {

                const next = structuredClone(prev);

                setPath(next, path, undefined);

                return next;
            });

        },
        []
    );


    const submit = async () => {

        setLoading(true);

        try {


            await onSubmit?.(form);

        } catch (error) {

            console.error(
                "❌ FORM SUBMIT ERROR",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    const handleSubmit = e => {

        e.preventDefault();

        submit();

    };


    return (

        <FormContext.Provider
            value={{
                form,
                getValue,
                setValue,
                getError,
                setError,
                clearError,
                loading,
                submit,
            }}
        >

            <form onSubmit={handleSubmit}>
                {children}
            </form>

        </FormContext.Provider>

    );

};


export function useForm() {

    const context = useContext(FormContext);

    if (!context) {

        throw new Error(
            "useForm must be used inside FormProvider"
        );

    }

    return context;
}