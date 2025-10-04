import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink as RRNavLink } from "react-router-dom";
import routes from "../routes";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const visibleRoutes = routes.filter(r => {
    if (!r.menuLabel) return false;
    if (!r.requireRole) return true;
    return user?.role === r.requireRole;
  });
  return (
    <Navbar expand="sm" sticky="top" variant="dark" style={{ backgroundColor: "#8fc6eb" }}>
      <Container fluid className="px-3">

        <Nav className="me-auto">
          {visibleRoutes.map(r => (
            <RRNavLink
              key={r.path}
              to={r.path!}
              end
              className={({ isActive }) => `nav-link ${isActive ? "fw-semibold active" : ""}`}
            >
              {r.menuLabel}
            </RRNavLink>
          ))}
        </Nav>
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
            <RRNavLink to="/login" className="nav-link">Logga in</RRNavLink>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
