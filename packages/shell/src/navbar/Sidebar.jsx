// src/components/navbar/Sidebar.jsx

import { MDBIcon, MDBListGroup } from "mdb-react-ui-kit";

import { getKitConfig } from "@moussaegh-dot/modulekit-engine/config/kitConfig.js";
import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";
import { NavigationItem } from "../navigation";

import "./sidebar.css";

export default function Sidebar({
  open,
  collapsed,
  onClose,
}) {
  const {
    userMenu,
    loading,
  } = useAuth();

  const { brand } = getKitConfig();

  if (loading) {
    return (
      <aside className="sidebar sidebar-loading-state">
        <div className="sidebar-loading">
          <MDBIcon
            icon="spinner"
            spin
            size="2x"
          />

          <span>
            Chargement...
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={[
        "sidebar",
        open ? "sidebar-open" : "",
        collapsed ? "sidebar-collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Navigation principale"
    >

      {/* ============================================================
          BRAND
          ============================================================ */}

      <div className="sidebar-brand">

        <div className="sidebar-brand-main">

          <span
            className="sidebar-brand-icon"
            aria-hidden="true"
          >
            <MDBIcon icon="graduation-cap" />
          </span>

          {!collapsed && (
            <div className="sidebar-brand-info">

              <span className="sidebar-brand-text">
                {brand.name}
              </span>

              <span className="sidebar-brand-sub">
                {/* Dashboard étudiant */}
              </span>

            </div>
          )}

        </div>

      </div>


      {/* ============================================================
          NAVIGATION
          ============================================================ */}

      <nav
        className="sidebar-menu"
        aria-label="Menu utilisateur"
      >

        <MDBListGroup className="sidebar-list">

          {userMenu.length > 0 ? (

            userMenu.map((node) => (
              <NavigationItem
                key={node.key}
                node={node}
                collapsed={collapsed}
                onClick={onClose}
              />
            ))

          ) : (

            <div className="sidebar-empty">
              <MDBIcon icon="circle-info" />

              {!collapsed && (
                <span>
                  Aucun menu disponible
                </span>
              )}
            </div>

          )}

        </MDBListGroup>

      </nav>


      {/* ============================================================
          FOOTER
          ============================================================ */}

      <div className="sidebar-footer">

        {collapsed ? (

          <MDBIcon
            icon="circle-info"
            title={`${brand.name} v${brand.version}`}
          />

        ) : (

          <div className="sidebar-version">
            <span>{brand.name}</span>
            <small>v1.0</small>
          </div>

        )}

      </div>

    </aside>
  );
}