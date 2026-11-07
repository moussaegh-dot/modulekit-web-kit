/**
 * 📁 AvatarCell.jsx
 * 🎯 User avatar renderer
 */
import { storageUrl } from "@moussaegh-dot/modulekit-http/utils/storageUrl.js";

const AvatarCell = ({ value, row }) => {

  const fallback =
    `https://ui-avatars.com/api/?name=${row.nom}+${row.prenom}`;

  return (
    <img
      src={storageUrl(value || fallback)}
      alt="avatar"
      width="40"
      height="40"
      className="rounded-circle object-fit-cover"
    />
  );
};

export default AvatarCell;