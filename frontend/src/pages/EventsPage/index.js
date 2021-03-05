import React, { useState, useMemo, useEffect } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Label, Input, Alert, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import CameraIcon from '../../Assets/camera.png'
import './events.css'

//EventsPage will show all the events
export default function EventsPage({ history }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [sport, setSport] = useState('Sport');
    const [date, setDate] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [dropdownOpen, setOpen] = useState(false);
    const user = localStorage.getItem('user');

    useEffect(() => {
        if (!user) {
            history.push('/login')
        }
    }, [])
    const toggle = () => setOpen(!dropdownOpen);

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])

    const handleSubmit = async (evt) => {
        evt.preventDefault()

        const eventData = new FormData();

        eventData.append("thumbnail", thumbnail)
        eventData.append("sport", sport)
        eventData.append("title", title)
        eventData.append("price", price)
        eventData.append("description", description)
        eventData.append("date", date)


        try {
            if (title !== "" &&
                description !== "" &&
                price !== "" &&
                sport !== "Sport" &&
                date !== "" &&
                thumbnail !== null
            ) {
                console.log("Event has been sent")
                await api.post("/event", eventData, { headers: { user: user } })
                console.log(eventData)
                console.log("Event has been saved")
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false)
                    history.push("/");
                }, 2000)

            } else {
                setError(true)
                setTimeout(() => {
                    setError(false)
                }, 2000)

                console.log("Missing required data")
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
    }

    const sportsEventHandler = (sport) => {
        setSport(sport);
    }
    return (
        <Container>
            <h3>Create your event</h3>
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>Upload Image</Label>
                    <Label id="thumbnail" style={{ backgroundImage: `url(${preview})` }} className={thumbnail ? 'has-thumbnail' : ''} >
                        <Input type="file" onChange={(evt) => setThumbnail(evt.target.files[0])}></Input>
                        <img src={CameraIcon} style={{ maxWidth: "50px" }} alt="Upload Image"></img>
                    </Label>
                </FormGroup>
                <FormGroup>
                    <Input id="title" type="text" value={title} placeholder={'Event Title'} onChange={(evt) => setTitle(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Input id="description" type="text" value={description} placeholder={'Event Description'} onChange={(evt) => setDescription(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Input id="price" type="text" value={price} placeholder={'Event Price'} onChange={(evt) => setPrice(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Input id="date" type="date" value={date} placeholder={'Event Price'} onChange={(evt) => setDate(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
                        <Button id="caret" value={sport}>{sport}</Button>
                        <DropdownToggle caret />
                        <DropdownMenu>
                            <DropdownItem onClick={() => sportsEventHandler('football')} >Football</DropdownItem>
                            <DropdownItem onClick={() => sportsEventHandler('cricket')} >Cricket</DropdownItem>
                            <DropdownItem onClick={() => sportsEventHandler('swimming')} >Swimming</DropdownItem>
                            <DropdownItem onClick={() => sportsEventHandler('basketball')} >Basktball</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                </FormGroup>
                <FormGroup>
                    <Button className="submit-btn">Submit</Button>
                </FormGroup>
                <FormGroup>
                    <Button className="secondary-btn" onClick={() => history.push("/")}>Cancel</Button>
                </FormGroup>
            </Form>
            {
                error ? (
                    <Alert className="event-validation" color="danger"> Missing required information</Alert>
                ) : ""
            }
            {
                success ? (
                    <Alert className="event-validation" color="success"> Event was created successfully</Alert>
                ) : ""
            }
        </Container >
    )
}