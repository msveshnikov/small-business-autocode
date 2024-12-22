import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Grid,
    Heading,
    Input,
    Select,
    Stack,
    Text,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel
} from '@chakra-ui/react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSelector } from 'react-redux';

const locales = {
    'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

export default function Scheduling() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [services, setServices] = useState([]);
    const [staff, setStaff] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        // Fetch initial data
        fetchEvents();
        fetchServices();
        fetchStaff();
    }, []);

    const fetchEvents = async () => {
        try {
            // API call to fetch events
            const response = await fetch('/api/events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            toast({
                title: 'Error fetching events',
                status: 'error',
                duration: 3000
            });
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch('/api/services');
            const data = await response.json();
            setServices(data);
        } catch (error) {
            toast({
                title: 'Error fetching services',
                status: 'error',
                duration: 3000
            });
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await fetch('/api/staff');
            const data = await response.json();
            setStaff(data);
        } catch (error) {
            toast({
                title: 'Error fetching staff',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        setSelectedEvent({
            start,
            end,
            title: '',
            serviceId: '',
            staffId: '',
            clientName: '',
            clientEmail: ''
        });
        onOpen();
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
        onOpen();
    };

    const handleSaveEvent = async () => {
        try {
            const method = selectedEvent.id ? 'PUT' : 'POST';
            const url = selectedEvent.id ? `/api/events/${selectedEvent.id}` : '/api/events';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedEvent)
            });

            if (!response.ok) throw new Error('Failed to save event');

            fetchEvents();
            onClose();
            toast({
                title: `Appointment ${selectedEvent.id ? 'updated' : 'created'} successfully`,
                status: 'success',
                duration: 3000
            });
        } catch (error) {
            toast({
                title: 'Error saving appointment',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleDeleteEvent = async () => {
        try {
            await fetch(`/api/events/${selectedEvent.id}`, {
                method: 'DELETE'
            });

            fetchEvents();
            onClose();
            toast({
                title: 'Appointment deleted successfully',
                status: 'success',
                duration: 3000
            });
        } catch (error) {
            toast({
                title: 'Error deleting appointment',
                status: 'error',
                duration: 3000
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={8}>
                <Heading>Scheduling</Heading>
                <Button
                    colorScheme="blue"
                    onClick={() => handleSelectSlot({ start: new Date(), end: new Date() })}
                >
                    New Appointment
                </Button>
            </Flex>

            <Box height="600px">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    defaultView="week"
                />
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {selectedEvent?.id ? 'Edit Appointment' : 'New Appointment'}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4} mb={4}>
                            <FormControl>
                                <FormLabel>Service</FormLabel>
                                <Select
                                    value={selectedEvent?.serviceId}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            serviceId: e.target.value
                                        })
                                    }
                                >
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Staff Member</FormLabel>
                                <Select
                                    value={selectedEvent?.staffId}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            staffId: e.target.value
                                        })
                                    }
                                >
                                    {staff.map((member) => (
                                        <option key={member.id} value={member.id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Client Name</FormLabel>
                                <Input
                                    value={selectedEvent?.clientName}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            clientName: e.target.value
                                        })
                                    }
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Client Email</FormLabel>
                                <Input
                                    type="email"
                                    value={selectedEvent?.clientEmail}
                                    onChange={(e) =>
                                        setSelectedEvent({
                                            ...selectedEvent,
                                            clientEmail: e.target.value
                                        })
                                    }
                                />
                            </FormControl>

                            <Grid templateColumns="1fr 1fr" gap={4}>
                                <Button colorScheme="blue" onClick={handleSaveEvent}>
                                    Save
                                </Button>
                                {selectedEvent?.id && (
                                    <Button colorScheme="red" onClick={handleDeleteEvent}>
                                        Delete
                                    </Button>
                                )}
                            </Grid>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    );
}
