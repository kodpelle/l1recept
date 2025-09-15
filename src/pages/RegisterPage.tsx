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
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter first name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formLastName">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </Form.Group>

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
                                <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Register
                                        </>
                                    ) : (
                                        "Register"
                                    )}
                                </Button>
                                <Button
                                    variant="link"
                                    className="w-100 mt-2"
                                    onClick={() => navigate("/login")}
                                >
                                    Already have an account? Login
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