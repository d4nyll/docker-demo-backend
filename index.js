const express = require('express');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');

const app = express();
app.use(bodyParser.json());

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");

  next();
});

app.get('/', async function(req, res, next) {
  const response = await client.search({
    index: 'demo',
    type: 'dump',
    ignore: [404],
    body: {
      query: {
        match_all : {}
      },
      size: 10000
    }
  });
  if(!response.hits || response.hits.total < 1) {
    return res.json([]);
  }
  const extractItems = response.hits.hits.map(hit => hit._source);
  res.json(extractItems)
 });

app.post('/', async function(req, res, next) {
  const response = await client.index({
    index: 'demo',
    type: 'dump',
    body: req.body,
    refresh: "true"
  });
  res.end(response._id);
});

app.delete('/', async function(req, res, next) {
  const response = await client.indices.delete({
    index: 'demo',
    ignore: [404],
  });
  return res.end('Data Deleted');
});

app.listen(3000, () => console.log('Backend listening on port 3000!'))
