/**
 * 📁 ToolbarTitle.jsx
 * 🎯 Page Toolbar Title
 */


export default function ToolbarTitle({
  title,
  description,
}) {

  return (
    <div className="toolbar-title">

      <h3 className="toolbar-title-heading">
        {title}
      </h3>

      {description && (
        <p className="toolbar-title-description">
          {description}
        </p>
      )}

    </div>
  );
}