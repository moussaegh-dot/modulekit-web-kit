import {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
} from "react";

import { modalRegistry } from "./modalRegistry";


/* =========================================================
   CONTEXT
========================================================= */

const ModalContext = createContext(null);


/* =========================================================
   MODAL RENDERER
========================================================= */

const ModalRenderer = ({
    modal,
    onClose,
}) => {

    if (!modal?.type) {
        return null;
    }

    const Component = modalRegistry[modal.type];

    if (!Component) {
        console.warn(
            `Unknown modal type: ${modal.type}`
        );

        return null;
    }

    return (
        <Component
            {...modal.props}
            onClose={onClose}
        />
    );
};


/* =========================================================
   PROVIDER
========================================================= */

export const ModalProvider = ({
    children,
}) => {

    const [modal, setModal] = useState(null);


    /* ---------------------------------------------------------
       OPEN
    --------------------------------------------------------- */

    const openModal = useCallback(
        (type, props = {}) => {
            setModal({
                type,
                props,
            });
        },
        []
    );


    /* ---------------------------------------------------------
       CLOSE
    --------------------------------------------------------- */

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);


    /* ---------------------------------------------------------
       CONTEXT VALUE
    --------------------------------------------------------- */

    const value = useMemo(
        () => ({
            openModal,
            closeModal,
        }),
        [
            openModal,
            closeModal,
        ]
    );


    return (
        <ModalContext.Provider value={value}>

            {children}

            <ModalRenderer
                modal={modal}
                onClose={closeModal}
            />

        </ModalContext.Provider>
    );
};


/* =========================================================
   HOOK
========================================================= */

export const useModal = () => {

    const context = useContext(
        ModalContext
    );

    if (!context) {
        throw new Error(
            "useModal must be used inside ModalProvider"
        );
    }

    return context;
};