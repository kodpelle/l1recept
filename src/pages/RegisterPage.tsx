import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';



function registerPage() {

    const [emali, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await register(emali, password, firstName, lastName);
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        }
    }
    return (
        <>    </>

    );
}


registerPage.route = {
    path: '/register',
    index: 2,
}
export default registerPage;