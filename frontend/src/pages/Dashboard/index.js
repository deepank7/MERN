import React, { useState, useEffect } from 'react';
import api from '../../services/api'
import moment from 'moment';
import { Button, ButtonGroup } from 'reactstrap';
import './dashboard.css'
//Dashboard will show all the events
export default function Dashboard({ history }) {
    const [events, setEvents] = useState([]);
    const user_id = localStorage.getItem('user');
    const [rSelected, setRSelected] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false)



    useEffect(() => {
        getEvents()
    }, [])

    const filterHandler = (query) => {
        setRSelected(query)
        getEvents(query)
    }

    const myEventHandler = async () => {
        setRSelected('myevents')
        const response = await api.get('user/events', { headers: { user_id } });
        setEvents(response.data);
    }
    const getEvents = async (filter) => {
        const url = filter ? `/dashboard/${filter}` : '/dashboard';
        const response = await api.get(url, { headers: { user_id } });
        setEvents(response.data)
    }

    const deleteEventHandler = async (eventId) => {

        try {
            await api.delete(`/event/${eventId}`);
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
                filterHandler(null)
            }, 2500)

        } catch (error) {
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 2000)
        }
    }
    return (
        <>
            <div className="filter-panel">
                <ButtonGroup>
                    <Button color="primary" onClick={() => filterHandler(null)} active={rSelected === null}>All Sports</Button>
                    <Button color="primary" onClick={myEventHandler} active={rSelected === 'myevents'}>My Events</Button>
                    <Button color="primary" onClick={() => filterHandler("football")} active={rSelected === 'football'}>Football</Button>
                    <Button color="primary" onClick={() => filterHandler("cricket")} active={rSelected === 'cricket'}>Cricket</Button>
                    <Button color="primary" onClick={() => filterHandler('swimming')} active={rSelected === 'swimming'}>Swimming</Button>
                    <Button color="primary" onClick={() => filterHandler('basketball')} active={rSelected === 'basketball'}>Basketball</Button>
                </ButtonGroup>
                <Button color="secondary" onClick={() => history.push('events')}>Events</Button>
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
                        <Button color="primary">Subscribe</Button>
                    </li>
                ))}
            </ul>
        </>
    )
}