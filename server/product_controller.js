const express = require('express');
var router = express.Router();
var Product = require('./product');

router.post('/', function(req, res) {
    console.log(req.body);
    let p = new Product({
        name: req.body.name, 
        price: req.body.price,
        stock: req.body.stock,
        departments: req.body.departments
    });
    p.save((err,prod) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prod);
    });
})

router.get('/', function(req, res) {    
    
    Product.find().exec((err,prods) => {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(prods);
    });
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;
    Product.deleteOne({_id: id}, (err) => {
        if (err)
            res.status(500).send(err);
        else 
            res.status(200).send({});
    })
})

router.patch('/:id', (req, res) => {
    Product.findById(req.params.id, (err, prod) => {
        if (err)
            res.status(500).send(err);
        else if (!prod)
            res.status(404).send({})
        else {
            prod.name = req.body.name;
            prod.price = req.body.price;
            prod.stock = req.body.stock;
            prod.departments = req.body.departments;
            dep.save()
                .then((p) => res.status(200).send(p))
                .catch((e) => res.status(500).send(e));

        }
    })
})

module.exports = router;