import { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Calendar from 'react-calendar';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { format } from 'date-fns';
import './App.css';

function App() {
    const [selectedTab, setSelectedTab] = useState('builder');
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [websiteElements, setWebsiteElements] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onDragEnd = useCallback((result) => {
        if (!result.destination) return;
        const items = Array.from(websiteElements);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setWebsiteElements(items);
    }, [websiteElements]);

    const addWebsiteElement = (elementType) => {
        const newElement = {
            id: `element-${websiteElements.length + 1}`,
            type: elementType,
            content: `New ${elementType}`
        };
        setWebsiteElements([...websiteElements, newElement]);
    };

    const addAppointment = async (values) => {
        try {
            const response = await axios.post('/api/appointments', values);
            setAppointments([...appointments, response.data]);
        } catch (error) {
            console.error('Failed to add appointment:', error);
        }
    };

    const addClient = async (values) => {
        try {
            const response = await axios.post('/api/clients', values);
            setClients([...clients, response.data]);
        } catch (error) {
            console.error('Failed to add client:', error);
        }
    };

    const renderBuilderTab = () => (
        <div className="builder-container">
            <div className="toolbar">
                <button onClick={() => addWebsiteElement('section')}>Add Section</button>
                <button onClick={() => addWebsiteElement('text')}>Add Text</button>
                <button onClick={() => addWebsiteElement('image')}>Add Image</button>
                <button onClick={() => addWebsiteElement('calendar')}>Add Calendar</button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="website-elements">
                    {(provided) => (
                        <div
                            className="preview-area"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {websiteElements.map((element, index) => (
                                <Draggable
                                    key={element.id}
                                    draggableId={element.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="website-element"
                                        >
                                            {element.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );

    const renderSchedulingTab = () => (
        <div className="scheduling-container">
            <div className="calendar-view">
                <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    className="calendar"
                />
                <Formik
                    initialValues={{
                        title: '',
                        date: format(selectedDate, 'yyyy-MM-dd'),
                        time: '',
                        clientId: ''
                    }}
                    validationSchema={Yup.object({
                        title: Yup.string().required('Required'),
                        time: Yup.string().required('Required'),
                        clientId: Yup.string().required('Required')
                    })}
                    onSubmit={addAppointment}
                >
                    <Form className="appointment-form">
                        <Field name="title" placeholder="Appointment Title" />
                        <Field name="time" type="time" />
                        <Field as="select" name="clientId">
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </Field>
                        <button type="submit">Add Appointment</button>
                    </Form>
                </Formik>
                <div className="appointments-list">
                    {appointments.map((appointment) => (
                        <div key={appointment.id} className="appointment-card">
                            <h3>{appointment.title}</h3>
                            <p>{format(new Date(appointment.date), 'PPP')}</p>
                            <p>{appointment.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderClientsTab = () => (
        <div className="clients-container">
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    phone: ''
                }}
                validationSchema={Yup.object({
                    name: Yup.string().required('Required'),
                    email: Yup.string().email('Invalid email').required('Required'),
                    phone: Yup.string().required('Required')
                })}
                onSubmit={addClient}
            >
                <Form className="client-form">
                    <Field name="name" placeholder="Client Name" />
                    <Field name="email" type="email" placeholder="Email" />
                    <Field name="phone" placeholder="Phone" />
                    <button type="submit">Add Client</button>
                </Form>
            </Formik>
            <div className="clients-list">
                {clients.map((client) => (
                    <div key={client.id} className="client-card">
                        <h3>{client.name}</h3>
                        <p>{client.email}</p>
                        <p>{client.phone}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <nav className="main-nav">
                <button
                    className={`nav-button ${selectedTab === 'builder' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('builder')}
                >
                    Website Builder
                </button>
                <button
                    className={`nav-button ${selectedTab === 'scheduling' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('scheduling')}
                >
                    Scheduling
                </button>
                <button
                    className={`nav-button ${selectedTab === 'clients' ? 'active' : ''}`}
                    onClick={() => setSelectedTab('clients')}
                >
                    Clients
                </button>
            </nav>
            <main className="main-content">
                {selectedTab === 'builder' && renderBuilderTab()}
                {selectedTab === 'scheduling' && renderSchedulingTab()}
                {selectedTab === 'clients' && renderClientsTab()}
            </main>
            <footer className="app-footer">
                <p>Business Scheduling Website Builder - MVP Version</p>
            </footer>
        </div>
    );
}

export default App;