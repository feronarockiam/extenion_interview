const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const app = express();
const port = 3000;
const { spawn } = require('child_process');

const uri = "mongodb+srv://interview:12345@cluster0.1ahe7l7.mongodb.net/interview?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

client.connect(err => {
  if (err) {
    console.error(err);
    res.status(500).json({ message: 'Error connecting to database' });
    return;
  }
  else{
    console.log('connected to db');
  }
  
  const collection = client.db("interview").collection("timestamps");
  app.post('/timestamps', (req, res) => {
    const start = req.body.start
    const end = req.body.end
    collection.countDocuments(function (err, count) {
      if (err) throw err;
      console.log("Number of documents in collection: " + count);
      
        collection.insertOne({ start: start, end: end }, function (err, result) {
          if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error inserting data into database' });
            return;
          }
    
          console.log("1 document inserted");
          res.json({ message: 'Timestamps inserted successfully' });
        });
    });    
  });

app.get('/start', (req, res) => {
  const pythonProcess = spawn('python', ['voicefrommeet.py']);
  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  res.send('Python script start started!');

  collection.deleteMany({}, function (err, result) {
    if (err) throw err;
    console.log("Deleted documents");
  })

  
});

app.get('/end', (req, res) => {
  // Execute the Python script only when the "start" button is clicked
  const pythonProcess = spawn('python', ['end.py']);
  //const pythonProcess1 = spawn('python', ['app.py']);
  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
  pythonProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });
  res.send('Python script end started!');
  
});


// app.get('/app', (req, res) => {
//   fs.readFile('result.txt', 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
//     if(data > 90){
//       res.send(data)
//     }
//     else{
//       res.setHeader('Content-Type', 'text/plain')
//       data += 'Suggested Answer'
//       res.send(data)
      
//     }
//   });
  
// });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});