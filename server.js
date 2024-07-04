const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'product_db',
    connectTimeout: 10000 
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Serve static files
app.use(express.static('public'));

// Handle form submission
app.post('/register-product', upload.single('upload-file'), (req, res) => {
    const { category, modal, 'serial-number': serialNumber, 'date-of-invoice': dateOfInvoice } = req.body;
    const productFile = req.file.buffer;

    const query = 'INSERT INTO products (category, modal, serial_number, date_of_invoice, product_file) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [category, modal, serialNumber, dateOfInvoice, productFile], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.send('Product registered successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
