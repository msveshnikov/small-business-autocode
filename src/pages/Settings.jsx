import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Select,
    Stack,
    Switch,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    useToast
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Component() {
    const [settings, setSettings] = useState({
        businessName: '',
        businessType: '',
        timezone: '',
        currency: '',
        emailNotifications: true,
        smsNotifications: false,
        appointmentBuffer: 15,
        cancellationPolicy: '',
        onlineBooking: true
    });

    const toast = useToast();
    const { user } = useAuth();
    const { toggleTheme, theme } = useTheme();
    const dispatch = useDispatch();

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Load settings from API
                const response = await fetch(`/api/settings/${user.id}`);
                const data = await response.json();
                setSettings(data);
            } catch (error) {
                toast({
                    title: 'Error loading settings',
                    status: 'error',
                    duration: 3000
                });
            }
        };

        if (user) {
            loadSettings();
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: e.target.type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/settings/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                toast({
                    title: 'Settings saved successfully',
                    status: 'success',
                    duration: 3000
                });
            }
        } catch (error) {
            toast({
                title: 'Error saving settings',
                status: 'error',
                duration: 3000
            });
        }
    };

    return (
        <Container maxW="container.lg" py={8}>
            <Heading mb={6}>Settings</Heading>

            <Tabs>
                <TabList>
                    <Tab>General</Tab>
                    <Tab>Notifications</Tab>
                    <Tab>Booking</Tab>
                    <Tab>Appearance</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>Business Name</FormLabel>
                                <Input
                                    name="businessName"
                                    value={settings.businessName}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Business Type</FormLabel>
                                <Select
                                    name="businessType"
                                    value={settings.businessType}
                                    onChange={handleChange}
                                >
                                    <option value="salon">Hair Salon/Barbershop</option>
                                    <option value="medical">Medical Practice</option>
                                    <option value="spa">Spa & Wellness</option>
                                    <option value="fitness">Personal Training</option>
                                    <option value="professional">Professional Services</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Timezone</FormLabel>
                                <Select
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleChange}
                                >
                                    <option value="UTC">UTC</option>
                                    <option value="EST">Eastern Time</option>
                                    <option value="CST">Central Time</option>
                                    <option value="MST">Mountain Time</option>
                                    <option value="PST">Pacific Time</option>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Currency</FormLabel>
                                <Select
                                    name="currency"
                                    value={settings.currency}
                                    onChange={handleChange}
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </Select>
                            </FormControl>
                        </Stack>
                    </TabPanel>

                    <TabPanel>
                        <Stack spacing={4}>
                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Email Notifications</FormLabel>
                                <Switch
                                    name="emailNotifications"
                                    isChecked={settings.emailNotifications}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">SMS Notifications</FormLabel>
                                <Switch
                                    name="smsNotifications"
                                    isChecked={settings.smsNotifications}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Stack>
                    </TabPanel>

                    <TabPanel>
                        <Stack spacing={4}>
                            <FormControl>
                                <FormLabel>Appointment Buffer (minutes)</FormLabel>
                                <Input
                                    name="appointmentBuffer"
                                    type="number"
                                    value={settings.appointmentBuffer}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Cancellation Policy</FormLabel>
                                <Input
                                    name="cancellationPolicy"
                                    value={settings.cancellationPolicy}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Enable Online Booking</FormLabel>
                                <Switch
                                    name="onlineBooking"
                                    isChecked={settings.onlineBooking}
                                    onChange={handleChange}
                                />
                            </FormControl>
                        </Stack>
                    </TabPanel>

                    <TabPanel>
                        <Stack spacing={4}>
                            <FormControl display="flex" alignItems="center">
                                <FormLabel mb="0">Dark Mode</FormLabel>
                                <Switch isChecked={theme === 'dark'} onChange={toggleTheme} />
                            </FormControl>
                        </Stack>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            <Box mt={8}>
                <Button colorScheme="blue" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Box>
        </Container>
    );
}

export default Component;
