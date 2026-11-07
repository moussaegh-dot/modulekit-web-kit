import {
    MDBContainer,
    MDBSpinner,
} from "mdb-react-ui-kit";

export default function PageLoader() {
    return (
        <MDBContainer
            fluid
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "60vh" }}
        >
            <MDBSpinner
                grow
                size="lg"
                role="status"
            >
                <span className="visually-hidden">
                    Chargement...
                </span>
            </MDBSpinner>
        </MDBContainer>
    );
}