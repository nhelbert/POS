const express = require('express')
const bodyParser = require('body-parser')
// const nano = require('nano')('http://hrdapps50:5984')
// const myDb = nano.db.use('sd2_nic')
const cors = require('cors')
const mysql = require('mysql')
//const fs =   require('fs')
const router = express.Router();
router.use(cors())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const pos = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    // password: '',
    database: 'pos'
})
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'pos'
    }
})

// ========================== NHEL routes here ==============================//

router.get('/', (req, res) => {
    res.send('stop it')
})
router.get('/login/:username', (req, res) => {
    knex.select()
        .from('users')
        .where('username', req.params.username)
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })

})

router.get('/items', (req, res) => {
    knex.select()
        .from('items')
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/itemsMaster', (req, res) => {
    knex.select()
        .from('items')
        .where('DeletedDate', null)
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/units', (req, res) => {
    knex.select()
        .from('units')
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/users', (req, res) => {
    knex.select()
        .from('users')
        .orderBy('ID', 'desc')
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/supplier', (req, res) => {
    knex.select()
        .from('supplier')
        .orderBy('supplierId', 'desc')
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/customers', (req, res) => {
    knex.select()
        .from('customers')
        .orderBy('ID', 'desc')
        .then(data => {
            res.send(data)

        })
        .catch(err => { res.send(err) })
})
router.get('/sale_transaction_history', (req, res) => {
    knex.select()
        .from('sale_transaction')
        .innerJoin('users', 'sale_transaction.userId', 'users.ID')
        .innerJoin('customers', 'sale_transaction.customerId', 'customers.ID')
        .orderBy('sale_transaction.invoiceNo', 'desc')
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/sale_product_history/:invoiceNo', (req, res) => {
    knex.select()
        .from('sale_product')
        .where('invoiceNo', req.params.invoiceNo)
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})
router.get('/sale_product/', (req, res) => {
    knex.select()
        .from('sale_product')
        .then(data => {
            res.send(data)
        })
        .catch(err => { res.send(err) })
})

// ========================== NHEL Post routes here ==============================//
router.post('/deleteusers', (req, res) => {
    let userdata = req.body
    knex('users')
        .where('ID', userdata.ID)
        .del()
        .then(data => {
            res.send(userdata)
        })
        .catch(err => { res.send(err) })
})
router.post('/updateusers', function (req, res) {
    let userdata = req.body

    knex('users').where('id', userdata.ID).update({
        Fname: userdata.FirstName,
        Mname: userdata.MiddleName,
        Lname: userdata.LastName,
        Email: userdata.EmailAddress + userdata.Emailsuffix,
        Username: userdata.Username,
        Password: userdata.UserPassword,
        UserType: userdata.UserType,
        Branch: 1
    }).then(body => {
        res.send(userdata)
    }).catch((err) => {
        res.send(err)
    })
})

router.post('/insertusers', function (req, res) {
    let userdata = req.body
    knex('users').insert({
        Fname: userdata.FirstName,
        Mname: userdata.MiddleName,
        Lname: userdata.LastName,
        Email: userdata.EmailAddress,
        Username: userdata.Username,
        Password: userdata.UserPassword,
        UserType: userdata.UserType,
        Branch: 1
    }).then(body => {
        res.send(userdata)
    }).catch((err) => {
        res.send(err)
    })
})
router.post('/sale_transaction', function (req, res) {
    let data = req.body

    knex('sale_transaction').insert({
        invoiceNo: data.invoiceNo,
        userId: data.userId,
        customerId: 1,
        totalPurchase: data.totalPurchase,
        recievedcash: data.recievedcash,
        change: data.change
    }).then(body => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    })
})
router.post('/sale_product', function (req, res) {
    let data = req.body
    knex('sale_product').insert(data).then(body => {
        res.send(data)
    }).catch((err) => {
        res.send(err)
    })
})
router.post('/updateitemqty/:invoiceNo', function (req, res) {
    knex.raw(`UPDATE items a,sale_product b SET A.actualQty = a.actualQty-b.qty WHERE a.itemcode =b.itemcode and b.invoiceNo='` + req.params.invoiceNo + `'`)
        .then(body => {
            res.send(req.params.invoiceNo)
        }).catch((err) => {
            res.send(err)

        })
})
router.post('/deletesupplier', (req, res) => {
    let userdata = req.body
    knex('supplier')
        .where('supplierId', userdata.supplierId)
        .del()
        .then(data => {
            res.send(userdata)
        })
        .catch(err => { res.send(err) })
})
router.post('/updatesupplier', function (req, res) {
    let userdata = req.body
    knex('supplier')
        .where('supplierId', userdata.supplierId)
        .update({
            name: userdata.name,
            address: userdata.address,
            contact: userdata.contact
        }).then(body => {
            res.send(userdata)
        }).catch((err) => {
            res.send(err)
        })
})
router.post('/insertsupplier', function (req, res) {
    let userdata = req.body
    knex('supplier').insert({
        name: userdata.name,
        address: userdata.address,
        contact: userdata.contact
    }).then(body => {
        res.send(userdata)
    }).catch((err) => {
        res.send(err)
    })
})
router.post('/deletecustomers', (req, res) => {
    let userdata = req.body
    knex('customers')
        .where('ID', userdata.ID)
        .del()
        .then(data => {
            res.send(userdata)
        })
        .catch(err => { res.send(err) })
})
router.post('/updatecustomers', function (req, res) {
    let userdata = req.body
    knex('customers')
        .where('ID', userdata.ID)
        .update({
            Fullname: userdata.FullName,
            Contact: userdata.Contact
        }).then(body => {
            res.send(userdata)
        }).catch((err) => {
            res.send(err)
        })
})
router.post('/insertcustomers', function (req, res) {
    let userdata = req.body
    knex('customers').insert({
        Fullname: userdata.Fullname,
        Contact: userdata.Contact
    }).then(body => {
        res.send(userdata)
    }).catch((err) => {
        res.send(err)
    })
})
router.post('/deleteitems', (req, res) => {
    let userdata = req.body
    knex('items')
        .where('itemId', userdata.itemId)
        .update({
            DeletedDate: userdata.DeletedDate,
        }).then(body => {
            res.send(userdata)
        }).catch((err) => {
            res.send(err)
        })
})
router.post('/updateitems', function (req, res) {
    let userdata = req.body
    knex('items')
        .where('itemId', userdata.itemId)
        .update({
            itemcode: userdata.itemcode,
            itemname: userdata.itemname,
            minimumQty: userdata.minimumQty,
            actualQty: userdata.actualQty,
            unitid: userdata.unitid,
            actualprice: userdata.actualprice,
            price: userdata.price,
            supplierId: userdata.supplierId,
            expiryDate: userdata.expiryDate,
        }).then(body => {
            res.send(userdata)
        }).catch((err) => {
            res.send(err)
        })
})
router.post('/insertitems', function (req, res) {
    let userdata = req.body
    knex('items').insert(userdata).then(body => {
        res.send(userdata)
    }).catch((err) => {
        res.send(err)
    })
})



module.exports = router;