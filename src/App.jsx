import { useState, useCallback, useContext } from 'react';
import { ChakraProvider, Box, VStack, HStack, Button, Heading, Text } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Calendar from 'react-calendar';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { format } from 'date-fns';
import AuthContext from './contexts/AuthContext';

function App() {
    const [selectedTab, setSelectedTab] = useState('builder');
    const [appointments, setAppointments] = useState([]);
    const [clients, setClients] = useState([]);
    const [websiteElements, setWebsiteElements] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { user } = useContext(AuthContext);

    const onDragEnd = useCallback(
        (result) => {
            if (!result.destination) return;
            const items = Array.from(websiteElements);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            setWebsiteElements(items);
        },
        [websiteElements]
    );

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
        <Box>
            <HStack spacing={4} mb={4}>
                <Button onClick={() => addWebsiteElement('section')}>Add Section</Button>
                <Button onClick={() => addWebsiteElement('text')}>Add Text</Button>
                <Button onClick={() => addWebsiteElement('image')}>Add Image</Button>
                <Button onClick={() => addWebsiteElement('calendar')}>Add Calendar</Button>
            </HStack>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="website-elements">
                    {(provided) => (
                        <VStack
                            spacing={4}
                            align="stretch"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {websiteElements.map((element, index) => (
                                <Draggable key={element.id} draggableId={element.id} index={index}>
                                    {(provided) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            p={4}
                                            borderWidth={1}
                                            borderRadius="md"
                                        >
                                            {element.content}
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </VStack>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );

    const renderSchedulingTab = () => (
        <Box>
            <HStack spacing={8} align="flex-start">
                <Box flex={1}>
                    <Calendar onChange={setSelectedDate} value={selectedDate} />
                </Box>
                <VStack flex={1} spacing={4} align="stretch">
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
                        <Form>
                            <VStack spacing={4}>
                                <Field name="title" placeholder="Appointment Title" />
                                <Field name="time" type="time" />
                                <Field as="select" name="clientId">
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </Field>
                                <Button type="submit">Add Appointment</Button>
                            </VStack>
                        </Form>
                    </Formik>
                    <VStack spacing={4} align="stretch">
                        {appointments.map((appointment) => (
                            <Box key={appointment.id} p={4} borderWidth={1} borderRadius="md">
                                <Heading size="sm">{appointment.title}</Heading>
                                <Text>{format(new Date(appointment.date), 'PPP')}</Text>
                                <Text>{appointment.time}</Text>
                            </Box>
                        ))}
                    </VStack>
                </VStack>
            </HStack>
        </Box>
    );

    const renderClientsTab = () => (
        <Box>
            <HStack spacing={8} align="flex-start">
                <Box flex={1}>
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
                        <Form>
                            <VStack spacing={4}>
                                <Field name="name" placeholder="Client Name" />
                                <Field name="email" type="email" placeholder="Email" />
                                <Field name="phone" placeholder="Phone" />
                                <Button type="submit">Add Client</Button>
                            </VStack>
                        </Form>
                    </Formik>
                </Box>
                <VStack flex={1} spacing={4} align="stretch">
                    {clients.map((client) => (
                        <Box key={client.id} p={4} borderWidth={1} borderRadius="md">
                            <Heading size="sm">{client.name}</Heading>
                            <Text>{client.email}</Text>
                            <Text>{client.phone}</Text>
                        </Box>
                    ))}
                </VStack>
            </HStack>
        </Box>
    );

    return (
        <Box minHeight="100vh">
            <HStack as="nav" spacing={4} p={4} bg="gray.100">
                <Button
                    onClick={() => setSelectedTab('builder')}
                    variant={selectedTab === 'builder' ? 'solid' : 'ghost'}
                >
                    Website Builder
                </Button>
                <Button
                    onClick={() => setSelectedTab('scheduling')}
                    variant={selectedTab === 'scheduling' ? 'solid' : 'ghost'}
                >
                    Scheduling
                </Button>
                <Button
                    onClick={() => setSelectedTab('clients')}
                    variant={selectedTab === 'clients' ? 'solid' : 'ghost'}
                >
                    Clients
                </Button>
            </HStack>
            <Box p={8}>
                {selectedTab === 'builder' && renderBuilderTab()}
                {selectedTab === 'scheduling' && renderSchedulingTab()}
                {selectedTab === 'clients' && renderClientsTab()}
            </Box>
            <Box as="footer" textAlign="center" p={4} bg="gray.100">
                <Text>Business Scheduling Website Builder - MVP Version</Text>
            </Box>
        </Box>
    );
}

export default App;
