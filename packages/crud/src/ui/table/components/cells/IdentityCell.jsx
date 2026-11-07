const IdentityCell = ({ row }) => {

  return (
    <div>

      <div className="fw-semibold">
        {row.nom} {row.prenom}
      </div>

      <div className="small text-muted">
        {row.email}
      </div>

    </div>
  );
};

export default IdentityCell;