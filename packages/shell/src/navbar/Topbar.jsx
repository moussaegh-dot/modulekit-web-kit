// src/components/layout/Topbar.jsx

import { Link, useNavigate } from "react-router-dom";

import {
    MDBNavbar,
    MDBContainer,
    MDBBtn,
    MDBBadge,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,
} from "mdb-react-ui-kit";

import { storageUrl } from "@moussaegh-dot/modulekit-http/utils/storageUrl.js";

import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";
import { getKitConfig } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";

import "./topbar.css";


// Par défaut : pas de notifications (l'application injecte son propre hook).
const useNoNotifications = () => ({ unreadCount: 0 });

export default function Topbar({
    isDesktop,
    onToggleSidebar,
    onToggleCollapse,
    useNotifications = useNoNotifications,
}) {

    const { brand, routes } = getKitConfig();

    const {
        user,
        logout,
    } = useAuth();

    const navigate = useNavigate();


    /*
    |--------------------------------------------------------------------------
    | USER
    |--------------------------------------------------------------------------
    */

    const role =
        user?.roles?.[0]
        ?? "Utilisateur";


    const userName =
        user?.fullName
        ?? "Utilisateur";

    const userInitial =
        userName
            .charAt(0)
            .toUpperCase();

const userPhoto = storageUrl(user?.photo_profil);

// console.log("========== TOPBAR ==========");
// console.log("USER :", user);
// console.log("PHOTO_PROFIL :", user?.photo_profil);
// console.log("USER PHOTO :", userPhoto);
// console.log("============================");


    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    |
    | Le hook gère :
    |
    | - le chargement du compteur depuis l'API ;
    | - les nouvelles notifications via Echo / Reverb ;
    | - la synchronisation du compteur.
    |
    */

    const {
        unreadCount,
    } = useNotifications({

        userId: user?.id,

        /*
         * Le Topbar n'a besoin que du compteur.
         *
         * On peut donc charger une petite quantité
         * de notifications.
         */
        perPage: 1,

    });


    /*
    |--------------------------------------------------------------------------
    | SIDEBAR
    |--------------------------------------------------------------------------
    */

    const handleSidebarToggle = () => {

        if (isDesktop) {

            onToggleCollapse?.();

        } else {

            onToggleSidebar?.();

        }
    };


    /*
    |--------------------------------------------------------------------------
    | LOGOUT
    |--------------------------------------------------------------------------
    */

    const handleLogout = async () => {

        await logout(navigate);

    };


    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <MDBNavbar
            light
            className="eg-topbar"
        >

            <MDBContainer
                fluid
                className="eg-topbar-container"
            >

                {/* =====================================================
                    LEFT
                ===================================================== */}

                <div className="eg-topbar-left">

                    {/* Sidebar toggle */}

                    <MDBBtn
                        type="button"
                        className="eg-topbar-toggle"
                        onClick={handleSidebarToggle}
                        aria-label={
                            isDesktop
                                ? "Réduire ou développer le menu"
                                : "Ouvrir le menu"
                        }
                    >

                        <MDBIcon icon="bars" />

                    </MDBBtn>


                    {/* Brand */}

                    <Link
                        to={routes.dashboard}
                        className="eg-topbar-brand"
                    >

                        <span className="eg-topbar-brand-icon">

                            <MDBIcon icon="graduation-cap" />

                        </span>


                        <span className="eg-topbar-brand-text">

                            {brand.name}

                        </span>

                    </Link>

                </div>


                {/* =====================================================
                    RIGHT
                ===================================================== */}

                <div className="eg-topbar-right">


                    {/* =================================================
                        NOTIFICATIONS
                    ================================================= */}

                    <Link
                        to={routes.notifications}
                        className="eg-topbar-action"
                        aria-label={
                            unreadCount > 0
                                ? `${unreadCount} notification(s) non lue(s)`
                                : "Notifications"
                        }
                    >

                        <MDBIcon icon="bell" />


                        {unreadCount > 0 && (

                            <MDBBadge
                                pill
                                className="eg-topbar-notification-badge"
                            >
                                {unreadCount}
                            </MDBBadge>

                        )}

                    </Link>


                    {/* =================================================
                        PROFILE DROPDOWN
                    ================================================= */}

                    <MDBDropdown>

                        <MDBDropdownToggle
                            tag="div"
                            className="eg-topbar-profile"
                        >

                            {/* Avatar */}

                        <div className="eg-topbar-avatar">

                            {userPhoto ? (
                                <img
                                    src={userPhoto}
                                    alt={`Photo de ${userName}`}
                                    className="eg-topbar-avatar-image"
                                />
                            ) : (
                                <span className="eg-topbar-avatar-initial">
                                    {userInitial}
                                </span>
                            )}

                        </div>


                            {/* User information */}

                            <div className="eg-topbar-user-info">

                                <span className="eg-topbar-user-name">

                                    {userName}

                                </span>


                                <span className="eg-topbar-user-role">

                                    {role}

                                </span>

                            </div>


                            {/* Chevron */}

                            <MDBIcon
                                icon="chevron-down"
                                className="eg-topbar-chevron"
                            />

                        </MDBDropdownToggle>


                        {/* =================================================
                            DROPDOWN
                        ================================================= */}

                        <MDBDropdownMenu
                            className="eg-topbar-dropdown"
                        >

                            {/* Header */}

                            <div className="eg-topbar-dropdown-header">

                                <div className="eg-topbar-dropdown-avatar">

                                    {userPhoto ? (
                                        <img
                                            src={userPhoto}
                                            alt={`Photo de ${userName}`}
                                            className="eg-topbar-dropdown-avatar-image"
                                        />
                                    ) : (
                                        <span className="eg-topbar-avatar-initial">
                                            {userInitial}
                                        </span>
                                    )}

                                </div>


                                <div className="eg-topbar-dropdown-user">

                                    <strong>
                                        {userName}
                                    </strong>

                                    <span>
                                        {user?.email ?? ""}
                                    </span>

                                </div>

                            </div>


                            <div className="eg-topbar-dropdown-divider" />


                            {/* Profil */}

                            <MDBDropdownItem
                                link
                                as={Link}
                                to={routes.profile}
                                className="eg-topbar-dropdown-item"
                            >

                                <MDBIcon icon="user" />

                                <span>
                                    Mon profil
                                </span>

                            </MDBDropdownItem>


                            {/* Tableau de bord */}

                            <MDBDropdownItem
                                link
                                as={Link}
                                to={routes.dashboard}
                                className="eg-topbar-dropdown-item"
                            >

                                <MDBIcon icon="chart-pie" />

                                <span>
                                    Tableau de bord
                                </span>

                            </MDBDropdownItem>


                            {/* Notifications */}

                            <MDBDropdownItem
                                link
                                as={Link}
                                to={routes.notifications}
                                className="eg-topbar-dropdown-item"
                            >

                                <MDBIcon icon="bell" />

                                <span>
                                    Notifications
                                </span>

                                {unreadCount > 0 && (

                                    <MDBBadge
                                        pill
                                        className="ms-auto"
                                    >
                                        {unreadCount}
                                    </MDBBadge>

                                )}

                            </MDBDropdownItem>


                            <div className="eg-topbar-dropdown-divider" />


                            {/* Déconnexion */}

                            <MDBDropdownItem
                                link
                                className={[
                                    "eg-topbar-dropdown-item",
                                    "eg-topbar-dropdown-logout",
                                ].join(" ")}
                                onClick={handleLogout}
                            >

                                <MDBIcon icon="sign-out-alt" />

                                <span>
                                    Déconnexion
                                </span>

                            </MDBDropdownItem>

                        </MDBDropdownMenu>

                    </MDBDropdown>

                </div>

            </MDBContainer>

        </MDBNavbar>
    );
}
