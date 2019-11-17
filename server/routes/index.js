'use strict';

var express = require('express');
var router = express.Router();
var data = [
  {
    image: 'https://c.ndtvimg.com/2019-08/k8519lf8_bugatti-centodieci-unveiled-at-pebble-beach-car-show_625x300_17_August_19.jpg',
    brandModel: 'Teste',
    year: '1970',
    plate: 'AAA-0000',
    color: 'Branco' 
  }
];

router.get('/', function(req, res) {
  res.json(data);
});

router.post('/', function(req, res) {
  data.push({
    image: req.body.image,
    brandModel: req.body.brandModel,
    year: req.body.year,
    plate: req.body.plate,
    color: req.body.color 
  });
  console.log(data);
  res.json({ message: 'success' });
});

module.exports = router;
