import React, { useState, useContext } from 'react';
import api from '../../services/api';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {UserContext} from '../../user-context'

export default function Register({ history }) {
    const { setIsloggedIn } = useContext(UserContext);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setfirstName] = useState("")
    const [lastName, setlastName] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("false")


    const handleSubmit = async evt => {
        evt.preventDefault();
        if (email !== "" && password !== "" && firstName !== "" && lastName !== "") {
            const response = await api.post('/user/register', { email, password, firstName, lastName });
            const user = response.data.user || false;
            const user_id = response.data.user_id || false;

            if (user && user_id) {
                localStorage.setItem('user', user)
                localStorage.setItem('user', user_id)
                setIsloggedIn(true)
                history.push('/')
            } else {
                const { message } = response.data
                setError(true)
                setErrorMessage(message)
                setTimeout(() => {
                    setError(false)
                    setErrorMessage("")
                }, 2000)
            }
        } else {
            setError(true)
            setErrorMessage("You need to fill all the details")
            setTimeout(() => {
                setError(false)
                setErrorMessage("")
            }, 2000)
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
                <Button className="submit-btn">Submit</Button>
                <Button className="secondary-btn" onClick={() => history.push("/login")}>Login Instead?</Button>
            </Form>
            {error ? (
                <Alert className="event-validation" color="danger">{errorMessage}</Alert>
            ) : ""}
        </div>
    )
}