import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <Navbar expand="sm" sticky="top"
      style={{ backgroundColor: "#8fc6ebff" }}
      variant="dark">
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/">Lätt Recept</Navbar.Brand>
        <Nav className="ms-auto d-flex align-items-center">
          {user ? (
            <>
              <Navbar.Text className="me-3">
                Inloggad som <strong>{user.email}</strong>
              </Navbar.Text>
              <Button variant="outline-light" size="sm" onClick={logout}>
                Logga ut
              </Button>
            </>
          ) : (
            <Nav.Link as={Link} to="/login">Logga in</Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
