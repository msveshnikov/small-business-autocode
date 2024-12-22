import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Container,
    Flex,
    Heading,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormControl,
    FormLabel,
    Stack,
    Select,
    Text,
    useToast
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { useAuth } from '../contexts/AuthContext';

export default function ClientManagement() {
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'active'
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useAuth();
    const toast = useToast();

    const fetchClients = useCallback(async () => {
        try {
            const response = await fetch('/api/clients', {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            setClients(data);
        } catch (error) {
            toast({
                title: 'Error fetching clients',
                status: 'error',
                duration: 3000
            });
        }
    }, [user, toast]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = selectedClient ? `/api/clients/${selectedClient.id}` : '/api/clients';

            const method = selectedClient ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify(formData)
            });

            toast({
                title: `Client ${selectedClient ? 'updated' : 'created'} successfully`,
                status: 'success',
                duration: 3000
            });

            onClose();
            fetchClients();
            resetForm();
        } catch (error) {
            toast({
                title: 'Error saving client',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            toast({
                title: 'Client deleted successfully',
                status: 'success',
                duration: 3000
            });

            fetchClients();
        } catch (error) {
            toast({
                title: 'Error deleting client',
                status: 'error',
                duration: 3000
            });
        }
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setFormData({
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone,
            status: client.status
        });
        onOpen();
    };

    const resetForm = () => {
        setSelectedClient(null);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            status: 'active'
        });
    };

    const filteredClients = clients.filter(
        (client) =>
            client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Container maxW="container.xl" py={8}>
            <Flex justify="space-between" align="center" mb={8}>
                <Heading size="lg">Client Management</Heading>
                <Button
                    leftIcon={<AddIcon />}
                    colorScheme="blue"
                    onClick={() => {
                        resetForm();
                        onOpen();
                    }}
                >
                    Add Client
                </Button>
            </Flex>

            <Flex mb={6}>
                <Input
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    mr={4}
                />
                <IconButton aria-label="Search" icon={<SearchIcon />} colorScheme="blue" />
            </Flex>

            <Box overflowX="auto">
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Phone</Th>
                            <Th>Status</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredClients.map((client) => (
                            <Tr key={client.id}>
                                <Td>{`${client.firstName} ${client.lastName}`}</Td>
                                <Td>{client.email}</Td>
                                <Td>{client.phone}</Td>
                                <Td>
                                    <Text
                                        color={client.status === 'active' ? 'green.500' : 'red.500'}
                                    >
                                        {client.status}
                                    </Text>
                                </Td>
                                <Td>
                                    <IconButton
                                        aria-label="Edit client"
                                        icon={<EditIcon />}
                                        size="sm"
                                        mr={2}
                                        onClick={() => handleEdit(client)}
                                    />
                                    <IconButton
                                        aria-label="Delete client"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => handleDelete(client.id)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedClient ? 'Edit Client' : 'Add New Client'}</ModalHeader>
                    <ModalBody>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>First Name</FormLabel>
                                <Input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Last Name</FormLabel>
                                <Input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Phone</FormLabel>
                                <Input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Select>
                            </FormControl>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            {selectedClient ? 'Update' : 'Save'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Container>
    );
}
