import { Navbar, Nav, Container, Button, Offcanvas } from "react-bootstrap";
import { NavLink as RRNavLink, Link } from "react-router-dom";
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
    <Navbar expand={false} sticky="top" className="py-2" style={{ backgroundColor: "#8fc6eb" }}>
      <Container fluid className="px-3">
        <Navbar.Brand className="text-light" as={Link} to="/">Lätt Recept</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-offcanvas" />

        <Navbar.Offcanvas
          id="main-offcanvas"
          aria-labelledby="main-offcanvas-label"
          placement="end"
          className="app-offcanvas"
        >
          <Offcanvas.Header closeButton className="text-dark" style={{
            background: "linear-gradient(135deg, #eeeed4ff, #f0e9d8ff)",
          }}>
            <Offcanvas.Title id="main-offcanvas-label">Meny</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body className="" style={{
            background: "linear-gradient(135deg, #eeeed4ff, #f0e9d8ff)",
          }}>
            <Nav className="flex-column">
              {visibleRoutes.map((r) => (
                <RRNavLink
                  key={r.path}
                  to={r.path}
                  end
                  className={({ isActive }) =>
                    "nav-link" + (isActive ? " fw-semibold active" : "")
                  }
                >
                  {r.menuLabel}
                </RRNavLink>
              ))}

              <hr className="my-3" />

              {user ? (
                <>
                  <div className="small text-muted mb-2">
                    Inloggad som <strong className="text-dark">{user.email}</strong>
                  </div>
                  <Button variant="outline-primary" onClick={logout}>
                    Logga ut
                  </Button>
                </>
              ) : (
                <RRNavLink to="/login" className="nav-link">Logga in</RRNavLink>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
