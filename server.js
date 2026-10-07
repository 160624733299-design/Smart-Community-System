const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const appRoutes = express.Router();
const PORT = process.env.PORT || 3000;

const resident = {
    id: 'resident-204',
    name: 'Shravani Rao',
    unit: 'B-204',
    email: 'shravani@example.com',
    mobile: '+91 90000 12345',
    password: '123456',
    role: 'resident',
    building: 'Green Valley Residency',
    city: 'Hyderabad'
};

const dashboardData = {
    resident,
    stats: [
        { label: 'Water status', value: '72%', unit: 'stored', status: 'Normal', tone: 'secondary' },
        { label: 'Parking', value: '45', unit: 'slots open', status: 'Available', tone: 'primary' },
        { label: 'Waste', value: 'Wet Waste', unit: 'Pickup 8:00 AM', status: 'Today', tone: 'tertiary' },
        { label: 'Drainage', value: '1 issue', unit: 'crew active', status: 'Block B', tone: 'error' }
    ],
    quickActions: [
        { name: 'Reserve Parking', href: '/parking_management/code.html', color: 'primary' },
        { name: 'Check Water', href: '/water_availability_quality/code.html', color: 'secondary' },
        { name: 'Report Issue', href: '/complaints_maintenance/code.html', color: 'surface' },
        { name: 'Waste & Flow', href: '/waste_drainage_management/code.html', color: 'tertiary' },
        { name: 'Organic Food', href: '/healthy_food_directory/code.html', color: 'primary' },
        { name: 'Green & Fit', href: '#', color: 'secondary' }
    ],
    notices: [
        'Rainwater harvesting tanks are operating at 92% capacity.',
        'Community solar output is stable and above average today.',
        'Your parking slot P-B-042 is active and verified.'
    ],
    complaints: [
        { id: 'CMP-1048', title: 'Drainage clog near Block B gate', status: 'In progress', priority: 'High' },
        { id: 'CMP-1042', title: 'Water filter replacement request', status: 'Resolved', priority: 'Medium' }
    ]
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', appRoutes);

appRoutes.get('/health', (req, res) => {
    res.json({ status: 'ok', project: 'Smart Community System', time: new Date().toISOString() });
});

appRoutes.post('/login', (req, res) => {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const password = String(req.body?.password || '');

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const validLogin =
        (email === resident.email && password === resident.password) ||
        (email === 'resident@greenvalley.in' && password === resident.password) ||
        (email === 'shravani@example.com' && password === resident.password);

    if (!validLogin) {
        return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.json({
        success: true,
        message: 'Login successful',
        resident: {
            id: resident.id,
            name: resident.name,
            unit: resident.unit,
            email: resident.email,
            role: resident.role,
            building: resident.building,
            city: resident.city
        },
        redirect: '/resident_dashboard/code.html'
    });
});

appRoutes.get('/dashboard', (req, res) => {
    res.json(dashboardData);
});

appRoutes.get('/services', (req, res) => {
    res.json({
        services: [
            'Parking Management',
            'Water Availability',
            'Waste and Drainage',
            'Complaints and Maintenance',
            'Healthy Food Directory',
            'Community Dashboard'
        ]
    });
});

appRoutes.get('/parking', (req, res) => {
    res.json({
        availableSlots: 45,
        activeSlot: 'P-B-042',
        vehicle: 'Honda Activa',
        plateNumber: 'TS09AB1234'
    });
});

appRoutes.get('/water', (req, res) => {
    res.json({
        storage: 72,
        status: 'Normal',
        supplyHoursLeft: 18,
        quality: 'Safe'
    });
});

appRoutes.get('/waste', (req, res) => {
    res.json({
        status: 'Normal',
        nextPickup: '8:00 AM',
        bins: [
            { name: 'Wet Waste', status: 'Collected', level: '80%' },
            { name: 'Dry Waste', status: 'Normal', level: '52%' },
            { name: 'Recycling', status: 'Ready', level: '67%' }
        ]
    });
});

appRoutes.get('/drainage', (req, res) => {
    res.json({
        status: 'Clear',
        blocks: [
            { name: 'Block A', flow: '1.8 m³/h', level: '18%' },
            { name: 'Block B', flow: '2.3 m³/h', level: '22%' },
            { name: 'Block C', flow: '1.9 m³/h', level: '20%' }
        ],
        logs: [
            'Storm Grate 14 Desilting',
            'Central Rain Harvester Backwash',
            'Sediment check completed for Ramp B'
        ]
    });
});

appRoutes.get('/complaints', (req, res) => {
    res.json({ complaints: dashboardData.complaints });
});

appRoutes.post('/complaints', (req, res) => {
    const { title, priority } = req.body || {};

    if (!title) {
        return res.status(400).json({ success: false, message: 'Complaint title is required.' });
    }

    const complaint = {
        id: `CMP-${Date.now().toString().slice(-4)}`,
        title,
        status: 'Submitted',
        priority: priority || 'Medium'
    };

    dashboardData.complaints.unshift(complaint);

    return res.status(201).json({ success: true, complaint });
});

appRoutes.get('/food', (req, res) => {
    res.json({
        items: [
            { name: 'Organic Breakfast Box', price: '₹299' },
            { name: 'Millet Khichdi', price: '₹199' },
            { name: 'Fresh Fruit Basket', price: '₹349' }
        ]
    });
});

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/resident_dashboard', (req, res) => {
    res.redirect('/resident_dashboard/code.html');
});

function startServer(port = PORT) {
    return new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
            console.log(`Smart Community System backend running at http://localhost:${port}`);
            resolve(server);
        });

        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.warn(`Port ${port} is already in use. Using existing server instance.`);
                resolve(null);
                return;
            }
            reject(error);
        });
    });
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };
