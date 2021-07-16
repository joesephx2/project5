var express = require('express');
var router = express.Router();
const knex = require('knex')(require('../knexfile.js')['development']);

router.get('/', function(req, res, next) {
    knex.select().table('tests')
    .then(response => res.status(200).json(response))
    .catch(err => res.status(404).send("There was an error"))
});

router.post('/', (req, res) => {
    if (Object.keys(req.body).length === 12) {
        knex('tests').insert(req.body)
            .then(response => {
            console.log(response)
            res.status(200).send("added test")
            })
            .catch(err => {
            console.log(err)
            res.status(404).send("There was an error")
            })
    } else {
      res.status(400).send("all fields must be filled out")
    }
});

router.put('/', (req, res) => {
    if (req.body.test_id && Object.keys(req.body).length > 1) {
      knex('tests')
        .where('test_id', '=', req.body.test_id)
        .update(req.body)
        .then(response => {
        console.log(response)
        res.status(200).send("updated test")
        })
        .catch(err => {
        console.log(err)
        res.status(404).send("There was an error")
        })
    } else {
      res.status(400).send("must have a test_id or some type of info")
    }
});

router.delete('/', (req, res) => {
  if (req.body.test_id) {
    knex('tests')
    .where('test_id', '=', req.body.test_id)
    .del()
    .then(() => res.status(200).send("Item deleted"))
    .catch(err => res.status(404).send("There was error, maybe the test_id was invalid"))
  } else {
    res.status(400).send("must have a test_id")
  }
});

module.exports = router;


