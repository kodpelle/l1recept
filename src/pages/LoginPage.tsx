import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Card, Form, Button, } from "react-bootstrap";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/recipes");
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (

    <Container className="d-flex flex-column align-items-center justify-content-center">
      <Row>
        <Col>
          <Card className="mt-5 d-flex flex-column align-items-center justify-content-center shadow">
            <Card.Body>
              {/*<Card.Title className="mb-4 text-center">Logga in</Card.Title>*/}

              <form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
                <Button variant="link" className="w-100 mt-2" onClick={() => navigate("/register")}>
                  Create new account
                </Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
LoginPage.route = {
  path: "/login",
  index: 1,
  menuLabel: "Login",
}
export default LoginPage;
