const express = require('express');
const fs = require('fs'); // Require the file system module
const app = express();
const port = 8086; // or any other available port

app.use(express.json());

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// app.get('/', (req, res) => {
//     // Example data
//     const filesData = [
//       { name: 'file1.txt', size: '2KB', date: '2021-01-01' },
//       { name: 'report.pdf', size: '5MB', date: '2021-02-01' },
//       // Add more file data here
//     ];
  
//     // Render the EJS template and pass the files data
//     res.render('index', { files: filesData });
//   });

app.get('/', (req, res) => {
    const dataStorePath = './datastore.json'; // The path to your data store file

    fs.readFile(dataStorePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).render('error', { message: "Error loading the file data." });
        }

        // Parse the data from JSON format
        const filesData = JSON.parse(data);

        // Render the EJS template and pass the files data
        res.render('index', { files: filesData });
    });
});


// This route provides the stored data as an API response
app.get('/api/file_tempo', (req, res) => {
    const dataStorePath = './datastore.json'; // The path to your data store file

    // Read the current data from the data store
    fs.readFile(dataStorePath, 'utf8', (err, data) => {
        if (err) {
            // If there's an error reading the file, send a server error response
            console.error(err);
            return res.status(500).json({ message: "Error fetching data" });
        }

        // If the file is read successfully, send the data as a response
        res.json(JSON.parse(data));
    });
});

// This route simulates adding new data and storing it
app.post('/api/file_tempo/add', (req, res) => {
    const newData = req.body; // This would be the new data you want to add

    // Read the current data and then append the new data
    fs.readFile(dataStorePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error reading data for update" });
        }

        // Parse the existing data and add the new data
        const currentData = JSON.parse(data);
        currentData.push(newData);

        // Write the updated data back to the file
        fs.writeFile(dataStorePath, JSON.stringify(currentData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error writing updated data" });
            }

            // Send a success response
            res.json({ message: "Data added successfully" });
        });
    });
});
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
