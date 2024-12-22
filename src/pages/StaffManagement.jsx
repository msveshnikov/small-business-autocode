import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Stack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    useToast
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

export default function StaffManagement() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [staff, setStaff] = useState([]);
    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        role: '',
        schedule: ''
    });
    const { currentUser } = useAuth();
    const toast = useToast();

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await fetch('/api/staff');
            const data = await response.json();
            setStaff(data);
        } catch (error) {
            toast({
                title: 'Error fetching staff',
                description: error.message,
                status: 'error',
                duration: 5000
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStaff((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newStaff)
            });

            if (!response.ok) throw new Error('Failed to add staff member');

            await fetchStaff();
            onClose();
            setNewStaff({
                name: '',
                email: '',
                role: '',
                schedule: ''
            });

            toast({
                title: 'Staff member added',
                status: 'success',
                duration: 3000
            });
        } catch (error) {
            toast({
                title: 'Error adding staff member',
                description: error.message,
                status: 'error',
                duration: 5000
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/staff/${id}`, {
                method: 'DELETE'
            });
            await fetchStaff();
            toast({
                title: 'Staff member removed',
                status: 'success',
                duration: 3000
            });
        } catch (error) {
            toast({
                title: 'Error removing staff member',
                description: error.message,
                status: 'error',
                duration: 5000
            });
        }
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={8}>
                <Heading size="lg">Staff Management</Heading>
                <Button colorScheme="blue" onClick={onOpen}>
                    Add Staff Member
                </Button>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Role</Th>
                        <Th>Schedule</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {staff.map((member) => (
                        <Tr key={member.id}>
                            <Td>{member.name}</Td>
                            <Td>{member.email}</Td>
                            <Td>{member.role}</Td>
                            <Td>{member.schedule}</Td>
                            <Td>
                                <Button
                                    size="sm"
                                    colorScheme="red"
                                    onClick={() => handleDelete(member.id)}
                                >
                                    Remove
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Staff Member</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={handleSubmit}>
                        <ModalBody>
                            <Stack spacing={4}>
                                <FormControl isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        name="name"
                                        value={newStaff.name}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={newStaff.email}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        name="role"
                                        value={newStaff.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select role</option>
                                        <option value="stylist">Stylist</option>
                                        <option value="therapist">Therapist</option>
                                        <option value="trainer">Trainer</option>
                                        <option value="doctor">Doctor</option>
                                    </Select>
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Schedule</FormLabel>
                                    <Select
                                        name="schedule"
                                        value={newStaff.schedule}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select schedule</option>
                                        <option value="full-time">Full Time</option>
                                        <option value="part-time">Part Time</option>
                                        <option value="flexible">Flexible</option>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" colorScheme="blue">
                                Add Staff Member
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </Container>
    );
}
