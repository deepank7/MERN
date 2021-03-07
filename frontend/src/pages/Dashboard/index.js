import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api'
import moment from 'moment';
import { Button, ButtonGroup, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import socketio from 'socket.io-client';
import './dashboard.css'

//Dashboard will show all the events
export default function Dashboard({ history }) {
    const [events, setEvents] = useState([]);
    const user = localStorage.getItem('user');
    const user_id = localStorage.getItem('user_id');
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false)
    const [messageHandler, setMessageHandler] = useState('');
    const [eventsRequest, setEventsRequest] = useState([])
    const [dropDownOpen, setDropDownOpen] = useState(false)

    const toggle = () => setDropDownOpen(!dropDownOpen)

    useEffect(() => {
        getEvents()
    }, [])

    const socket = useMemo(
        () =>
            socketio.connect("http://localhost:7000/", { query: { user: user_id } }),
        [user_id]
    )

    useEffect(() => {
        socket.on('registration_request', data => setEventsRequest([...eventsRequest, data]));
    }, [eventsRequest, socket])

    const filterHandler = (query) => {
        setRSelected(query)
        getEvents(query)
    }

    const myEventHandler = async () => {
        try {
            setRSelected('myevents')
            const response = await api.get('user/events', { headers: { user: user } });
            setEvents(response.data.events);
            console.log(response.data)
        } catch (error) {
            history.push('/login');
        }
    }
    const getEvents = async (filter) => {
        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard';
            const response = await api.get(url, { headers: { user: user } });
            setEvents(response.data.events)
        } catch (error) {
            history.push('/login');
        }
    }

    const deleteEventHandler = async (eventId) => {

        try {
            await api.delete(`/event/${eventId}`, { headers: { user: user } });
            setMessageHandler('The event was deleted successfully!');
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler('Error while deleting');
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    const registrationRequestHandler = async (event) => {
        try {
            await api.post(`/registration/${event.id}`, {}, { headers: { user } })

            setSuccess(true)
            setMessageHandler(`The request for the event ${event.title} was successfully!`)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
                setMessageHandler('')
            }, 2500)

        } catch (error) {
            setError(true)
            setMessageHandler(`The request for the event ${event.title} wasn't successfully!`)
            setTimeout(() => {
                setError(false)
                setMessageHandler('')
            }, 2000)
        }
    }

    return (
        <>
            <ul className="notifications">
                {eventsRequest.map(request => {
                    console.log(request)
                    return (
                        <li key={request.id}>
                            <div>
                                <strong>{request.user.email} </strong> is requesting to register to your Event <strong>{request.event.title}</strong>
                            </div>
                            <ButtonGroup>
                                <Button color="secondary" onClick={() => { }}>Accept</Button>
                                <Button color="danger" onClick={() => { }}>Cancel</Button>
                            </ButtonGroup>
                        </li>
                    )
                })}
            </ul>
            <div className="filter-panel">
                <Dropdown isOpen={dropDownOpen} toggle={toggle}>
                    <DropdownToggle color="primary">
                        Filter
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filterHandler(null)} active={rSelected === null}> All Sports</DropdownItem>
                        <DropdownItem onClick={myEventHandler} active={rSelected === 'myevents'}> My Events</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("football")} active={rSelected === 'football'}> Football</DropdownItem>
                        <DropdownItem onClick={() => filterHandler("cricket")} active={rSelected === 'cricket'}> Cricket</DropdownItem>
                        <DropdownItem onClick={() => filterHandler('swimming')} active={rSelected === 'swimming'}> Swimming</DropdownItem>
                        <DropdownItem onClick={() => filterHandler('basketball')} active={rSelected === 'basketball'}> Basketball</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <ul className="events-list">
                {events.map(event => (
                    <li key={event._id}>
                        <header style={{ backgroundImage: `url(${event.thumbnail_url})` }} >
                            {event.user === user_id ? <div><Button color="danger" size="sm" onClick={() => deleteEventHandler(event._id)}>Delete</Button></div> : ""}
                        </header>
                        <strong>{event.title}</strong>
                        <span>Event Date: {moment(event.date).format('l')}</span>
                        <span>Event Price:{event.price}</span>
                        <span>Event Description:{event.description}</span>
                        <Button color="primary" onClick={() => registrationRequestHandler(event)}>Subscribe</Button>
                    </li>
                ))}
            </ul>
            {
                error ? (
                    <Alert className="event-validation" color="danger"> {messageHandler} </Alert>
                ) : ""
            }
            {
                success ? (
                    <Alert className="event-validation" color="success"> {messageHandler}</Alert>
                ) : ""
            }
        </>
    )
}