import React, { useState } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

export default function Register({ history }) {
    const [email, setEmail] = useState(" ")
    const [password, setPassword] = useState(" ")
    const [firstName, setfirstName] = useState(" ")
    const [lastName, setlastName] = useState(" ")

    const handleSubmit = async evt => {
        evt.preventDefault();
        console.log(email, password, firstName, lastName)

        const response = await api.post('/user/register', { email, password, firstName, lastName });
        const userId = response.data._id || false;

        if (userId) {
            localStorage.setItem('user', userId)
            history.push('/dashboard')
        } else {
            const { message } = response.data;
            console.log(message)
        }
    }
    return (
        <div>
            <h4>Please <b>Register</b> for a new account</h4>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="firstName" hidden>firstName</Label>
                    <Input type="text" name="firstName" id="firstName" placeholder="Your first Name" onChange={evt => setfirstName(evt.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="lastName" hidden>lastName</Label>
                    <Input type="text" name="lastName" id="lastName" placeholder="Your last Name" onChange={evt => setlastName(evt.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="exampleEmail" hidden>Email</Label>
                    <Input type="email" name="email" id="exampleEmail" placeholder="Your Email" onChange={evt => setEmail(evt.target.value)} />
                </FormGroup>
                {' '}
                <FormGroup>
                    <Label for="examplePassword" hidden>Password</Label>
                    <Input type="password" name="password" id="examplePassword" placeholder="Your Password" onChange={evt => setPassword(evt.target.value)} />
                </FormGroup>
                {' '}
                <Button>Submit</Button>
            </Form>
        </div>
    )
}