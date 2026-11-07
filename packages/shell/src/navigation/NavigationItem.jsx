import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MDBIcon, MDBListGroupItem } from "mdb-react-ui-kit";

import "./navigation-item.css";

export default function NavigationItem({
  node,
  collapsed = false,
  onClick,
}) {
  const location = useLocation();

  const [expanded, setExpanded] = useState(false);

  const hasChildren =
    Array.isArray(node.children) &&
    node.children.length > 0;

  /*
   * ------------------------------------------------------------
   * Vérification de l'élément actif
   * ------------------------------------------------------------
   */

  const isActive =
    Boolean(node.route) &&
    (
      location.pathname === node.route ||
      location.pathname.startsWith(`${node.route}/`)
    );

  /*
   * ------------------------------------------------------------
   * Ouverture automatique du groupe actif
   * ------------------------------------------------------------
   */

  useEffect(() => {
    if (!hasChildren) {
      return;
    }

    const childIsActive = node.children.some(
      (child) =>
        child.route &&
        (
          location.pathname === child.route ||
          location.pathname.startsWith(`${child.route}/`)
        )
    );

    setExpanded(childIsActive);
  }, [
    location.pathname,
    hasChildren,
    node.children,
  ]);

  /*
   * ------------------------------------------------------------
   * Fermeture du menu mobile
   * ------------------------------------------------------------
   */

  const handleNavigation = () => {
    if (window.innerWidth < 992) {
      onClick?.();
    }
  };

  /*
   * ------------------------------------------------------------
   * GROUPE
   * ------------------------------------------------------------
   */

  if (node.type === "group") {
    return (
      <div className="sidebar-group">

        <button
          type="button"
          className={[
            "sidebar-group-header",
            expanded ? "expanded" : "",
            collapsed ? "collapsed" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onClick={() => setExpanded((previous) => !previous)}
          title={collapsed ? node.label : undefined}
          aria-expanded={!collapsed && expanded}
        >

          <span className="sidebar-navigation-content">

            {node.icon && (
              <span className="sidebar-icon-wrapper">
                <MDBIcon
                  icon={node.icon}
                  className="sidebar-icon"
                />
              </span>
            )}

            {!collapsed && (
              <span className="sidebar-navigation-label">
                {node.label}
              </span>
            )}

          </span>

          {!collapsed && (
            <MDBIcon
              icon={
                expanded
                  ? "chevron-down"
                  : "chevron-right"
              }
              className="sidebar-chevron"
            />
          )}

        </button>

        {expanded && !collapsed && (
          <div className="sidebar-children">

            {node.children.map((child) => (
              <NavigationItem
                key={child.key}
                node={child}
                collapsed={false}
                onClick={onClick}
              />
            ))}

          </div>
        )}

      </div>
    );
  }

  /*
   * ------------------------------------------------------------
   * LIEN
   * ------------------------------------------------------------
   */

  return (
    <MDBListGroupItem
      tag={Link}
      to={node.route}
      action
      title={collapsed ? node.label : undefined}
      className={[
        "sidebar-navigation-item",
        isActive ? "active" : "",
        collapsed ? "collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleNavigation}
    >

      <span className="sidebar-navigation-content">

        {node.icon && (
          <span className="sidebar-icon-wrapper">
            <MDBIcon
              icon={node.icon}
              className="sidebar-icon"
            />
          </span>
        )}

        {!collapsed && (
          <span className="sidebar-navigation-label">
            {node.label}
          </span>
        )}

      </span>

    </MDBListGroupItem>
  );
}