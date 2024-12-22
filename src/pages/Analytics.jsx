import { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Select,
    Card,
    CardHeader,
    CardBody,
    LineChart,
    BarChart,
    Stack,
    useColorModeValue
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { format, subDays } from 'date-fns';

export default function Analytics() {
    const [timeRange, setTimeRange] = useState('7d');
    const [metrics, setMetrics] = useState({
        revenue: { value: 0, change: 0 },
        appointments: { value: 0, change: 0 },
        clients: { value: 0, change: 0 },
        retention: { value: 0, change: 0 }
    });
    const [chartData, setChartData] = useState([]);

    const bgColor = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // TODO: Replace with actual API call
                const response = await fetch(
                    `/api/analytics?timeRange=${timeRange}&userId=${user.id}`
                );
                const data = await response.json();

                setMetrics(data.metrics);
                setChartData(data.chartData);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchAnalytics();
    }, [timeRange, user.id]);

    const generateDateLabels = () => {
        const dates = [];
        for (let i = 0; i < parseInt(timeRange); i++) {
            dates.unshift(format(subDays(new Date(), i), 'MMM d'));
        }
        return dates;
    };

    return (
        <Container maxW="container.xl" py={8}>
            <Stack spacing={8}>
                <Box>
                    <Heading size="lg" mb={4}>
                        Analytics Dashboard
                    </Heading>
                    <Select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        maxW="200px"
                        mb={8}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </Select>
                </Box>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
                        <CardHeader pb={0}>
                            <Stat>
                                <StatLabel>Revenue</StatLabel>
                                <StatNumber>${metrics.revenue.value.toLocaleString()}</StatNumber>
                                <StatHelpText>
                                    <StatArrow
                                        type={metrics.revenue.change >= 0 ? 'increase' : 'decrease'}
                                    />
                                    {Math.abs(metrics.revenue.change)}%
                                </StatHelpText>
                            </Stat>
                        </CardHeader>
                    </Card>

                    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
                        <CardHeader pb={0}>
                            <Stat>
                                <StatLabel>Appointments</StatLabel>
                                <StatNumber>{metrics.appointments.value}</StatNumber>
                                <StatHelpText>
                                    <StatArrow
                                        type={
                                            metrics.appointments.change >= 0
                                                ? 'increase'
                                                : 'decrease'
                                        }
                                    />
                                    {Math.abs(metrics.appointments.change)}%
                                </StatHelpText>
                            </Stat>
                        </CardHeader>
                    </Card>

                    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
                        <CardHeader pb={0}>
                            <Stat>
                                <StatLabel>New Clients</StatLabel>
                                <StatNumber>{metrics.clients.value}</StatNumber>
                                <StatHelpText>
                                    <StatArrow
                                        type={metrics.clients.change >= 0 ? 'increase' : 'decrease'}
                                    />
                                    {Math.abs(metrics.clients.change)}%
                                </StatHelpText>
                            </Stat>
                        </CardHeader>
                    </Card>

                    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
                        <CardHeader pb={0}>
                            <Stat>
                                <StatLabel>Client Retention</StatLabel>
                                <StatNumber>{metrics.retention.value}%</StatNumber>
                                <StatHelpText>
                                    <StatArrow
                                        type={
                                            metrics.retention.change >= 0 ? 'increase' : 'decrease'
                                        }
                                    />
                                    {Math.abs(metrics.retention.change)}%
                                </StatHelpText>
                            </Stat>
                        </CardHeader>
                    </Card>
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
                        <CardHeader>
                            <Heading size="md">Revenue Trend</Heading>
                        </CardHeader>
                        <CardBody>
                            <LineChart
                                data={chartData.revenue || []}
                                labels={generateDateLabels()}
                                height={300}
                            />
                        </CardBody>
                    </Card>

                    <Card bg={bgColor} borderColor={borderColor} borderWidth={1}>
                        <CardHeader>
                            <Heading size="md">Appointment Distribution</Heading>
                        </CardHeader>
                        <CardBody>
                            <BarChart
                                data={chartData.appointments || []}
                                labels={generateDateLabels()}
                                height={300}
                            />
                        </CardBody>
                    </Card>
                </SimpleGrid>
            </Stack>
        </Container>
    );
}
