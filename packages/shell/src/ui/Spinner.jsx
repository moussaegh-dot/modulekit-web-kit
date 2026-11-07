// ui/Spinner.jsx
import { MDBSpinner } from "mdb-react-ui-kit";

const Spinner = ({ fullScreen = true }) => {
  return (
    <div className={`d-flex justify-content-center align-items-center ${fullScreen ? "vh-100" : ""}`}>
      <MDBSpinner role="status" />
    </div>
  );
};

export default Spinner;