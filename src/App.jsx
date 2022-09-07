import './App.css';
import { useState } from 'react';
import Form from './components/Form';
import Input from './components/Input';

export default function App() {
    const [user, setUser] = useState({ username: '', password: '' });
    const [registerResponse, setRegisterResponse] = useState('');
    const [loginResponse, setLoginResponse] = useState('');

    const register = async (e) => {
        e.preventDefault();
        // Write your register code here
        const { username, password } = user;
        const auth = localStorage.getItem('auth');
        let errMessage;
        fetch('http://localhost:4000/register', {
            method: 'POST',
            headers: auth ? new Headers({
                'Authorization': `Bearer ${auth}`,
                'Content-Type': 'application/json'
            }) : new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ username, password })
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.user) {
                    setRegisterResponse(`Hello my name is ${data.user.username}`)
                } else {
                    setRegisterResponse(data.error);
                }
            }).catch((err) => {
                console.log(err);
            });

    };

    const login = async (e) => {
        e.preventDefault();
        // Write your login code here
        const { username, password } = user;
        let data;
        try {

            const respone = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await respone.json();
            console.log(data);
            if (data.token) {
                setLoginResponse(data.token)
                localStorage.setItem('auth', loginResponse);
            } else {
                setLoginResponse(data.error);
            }

        } catch (e) {
            console.log({ e });
        }

    };






    // You can safely ignore everything below this line, it's just boilerplate
    // so you can focus on the exercise requirements

    const handleChange = (e) => {
        const { value, name } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    }

    return (
        <div className="App">

            <h1>Register</h1>

            <Form
                handleSubmit={register}
                inputs={[
                    <Input
                        key={1}
                        type='text'
                        name='username'
                        placeholder='Username'
                        value={user.username}
                        handleChange={handleChange}
                    />,
                    <Input
                        key={2}
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={user.password}
                        handleChange={handleChange}
                    />
                ]}
            />

            {registerResponse && <p>{registerResponse}</p>}

            <h1>Login</h1>

            <Form
                handleSubmit={login}
                inputs={[
                    <Input
                        key={1}
                        type='text'
                        name='username'
                        placeholder='Username'
                        value={user.username}
                        handleChange={handleChange}
                    />,
                    <Input
                        key={2}
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={user.password}
                        handleChange={handleChange}
                    />
                ]}
            />

            {loginResponse && <p>{loginResponse}</p>}

        </div>
    );
}
