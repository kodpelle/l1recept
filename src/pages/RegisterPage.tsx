import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";


function registerPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errormessage, setErrorMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await register(email, password, firstName, lastName);
            navigate('/login');
        } catch (error) {
            console.error(error);
            setErrorMessage('Registration failed.');
        }
        finally {
            setIsSubmitting(false);
        }
    }
    return (
        <Container className="d-flex flex-column align-items-center justify-content-center">
            <Row>
                <Col>
                    <Card className="mt-5 d-flex flex-column align-items-center justify-content-center shadow">
                        <Card.Body>
                            <form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formFirstName">
                                    <Form.Label>Förnamn</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ange förnamn"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formLastName">
                                    <Form.Label>Efternamn</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Ange efternamn"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Epost</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ange epost"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Lösenord</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ange lösenord"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Registrerar
                                        </>
                                    ) : (
                                        "Registrera"
                                    )}
                                </Button>
                                <Button
                                    variant="link"
                                    className="w-100 mt-2"
                                    onClick={() => navigate("/login")}
                                >
                                    Har du redan ett konto? Logga in
                                </Button>
                                <div className="text-danger mt-2 text-center">{errormessage}</div>
                            </form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}


registerPage.route = {
    path: '/register',
    index: 2,
}
export default registerPage;