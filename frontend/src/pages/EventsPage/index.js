import React, { useState, useMemo } from 'react';
import api from '../../services/api';
import { Container, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import CameraIcon from '../Assets/camera.png';
import './events.css'

//EventsPage will show all the events
export default function EventsPage() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [sport, setSport] = useState('');
    const [date, setDate] = useState('');
    const [errorMessage, setErrorMessage] = useState(false)

    const preview = useMemo(() => {
        return thumbnail ? URL.createObjectURL(thumbnail) : null;
    }, [thumbnail])

    console.log(title, description, price, sport);

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        const user_id = localStorage.getItem('user');

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
                sport !== "" &&
                date !== "" &&
                thumbnail !== null
            ) {
                console.log("Event has been sent")
                await api.post("/event", eventData, { headers: { user_id } })
                console.log(eventData)
                console.log("Event has been saved")
            } else {
                setErrorMessage(true)
                setTimeout(() => {
                    setErrorMessage(false)
                }, 2000)

                console.log("Missing required data")
            }
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
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
                    <Label>Sports:</Label>
                    <Input id="sport" type="text" value={sport} placeholder={'Sports Name'} onChange={(evt) => setSport(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Label>Title:</Label>
                    <Input id="title" type="text" value={title} placeholder={'Event Title'} onChange={(evt) => setTitle(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Label>Event Description:</Label>
                    <Input id="description" type="text" value={description} placeholder={'Event Description'} onChange={(evt) => setDescription(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Label>Event Price:</Label>
                    <Input id="price" type="text" value={price} placeholder={'Event Price'} onChange={(evt) => setPrice(evt.target.value)}></Input>
                </FormGroup>
                <FormGroup>
                    <Label>Event Date:</Label>
                    <Input id="date" type="date" value={date} placeholder={'Event Price'} onChange={(evt) => setDate(evt.target.value)}></Input>
                </FormGroup>
                <Button type="submit">Create Event</Button>
            </Form>
            {errorMessage ? (
                <Alert className="event-validation" color="danger"> Missing required information</Alert>
            ) : ""}
        </Container>
    )
}