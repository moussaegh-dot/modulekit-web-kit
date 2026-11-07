// src/layouts/shared/MainLayout.jsx

import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../navbar/Sidebar";
import Topbar from "../navbar/Topbar";
import ThemeToggle from "../ui/ThemeToggle";
import Spinner from "../ui/Spinner";

import { useAuth } from "@moussaegh-dot/modulekit-auth/AuthProvider.jsx";

import "./mainLayout.css";

export default function MainLayout({ useNotifications }) {
  const location = useLocation();

  const {
    loading,
  } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    window.innerWidth >= 992
  );


  /* ============================================================
     RESPONSIVE
     ============================================================ */

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 992;

      setIsDesktop(desktop);

      /*
       * Sur desktop, le sidebar mobile est fermé.
       */
      if (desktop) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);


  /* ============================================================
     FERMETURE DU SIDEBAR APRÈS NAVIGATION
     ============================================================ */

  useEffect(() => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  }, [
    location.pathname,
    isDesktop,
  ]);


  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <div className="eg-loading-container">

        <Spinner />

        <p className="eg-loading-text">
          Chargement du tableau de bord...
        </p>

      </div>
    );
  }


  /* ============================================================
     TOGGLE SIDEBAR
     ============================================================ */

  const handleSidebarToggle = () => {
    setSidebarOpen(
      (previous) => !previous
    );
  };


  /* ============================================================
     TOGGLE COLLAPSE
     ============================================================ */

  const handleCollapseToggle = () => {
    setCollapsed(
      (previous) => !previous
    );
  };


  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div
      className={[
        "eg-main-layout",
        collapsed
          ? "eg-sidebar-collapsed"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      {/* ========================================================
          SIDEBAR
          ======================================================== */}

      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onClose={() =>
          setSidebarOpen(false)
        }
      />


      {/* ========================================================
          MAIN AREA
          ======================================================== */}

      <div className="eg-main-content-wrapper">

        {/* ------------------------------------------------------
            TOPBAR
            ------------------------------------------------------ */}

        <Topbar
          useNotifications={useNotifications}
          isDesktop={isDesktop}
          onToggleSidebar={handleSidebarToggle}
          onToggleCollapse={handleCollapseToggle}
        />


        {/* ------------------------------------------------------
            PAGE CONTENT
            ------------------------------------------------------ */}

        <main className="eg-page-main">

          <div className="eg-page-container">
            <Outlet />
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

        </main>

      </div>


      {/* ========================================================
          MOBILE OVERLAY
          ======================================================== */}

      {sidebarOpen && !isDesktop && (
        <div
          className="eg-overlay"
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
          onClick={() =>
            setSidebarOpen(false)
          }
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              setSidebarOpen(false);
            }
          }}
        />
      )}

    </div>
  );
}