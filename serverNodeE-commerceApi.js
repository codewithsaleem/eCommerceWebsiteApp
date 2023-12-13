let express = require("express");
let app = express();
app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept",
    );
    res.header(
        "Access-Control-Allow-Methods",
        "POST,GET,PUT,DELETE,PATCH,OPTIONS,HEAD"
    );
    next();
})
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}`));
let { products } = require("./serverNodeE-commerceData.js");
let orders = [];
let customer = [];
let orderDetails = [];

//Fetching data through api:-------
app.get("/products", function (req, res) {
    let category = req.query.category;
    let arr = products;
    if (category) arr = arr.filter((ele => ele.category === category));
    if (category === "All") arr = products;
    res.send(arr);
})
app.get("/products/:id", function (req, res) {
    let id = +req.params.id;
    let fnd = products.find((ele) => ele.id === id)
    if (fnd) res.send(fnd);
    else res.status(404).send("No product found");
})
app.post("/products", function (req, res) {
    let body = req.body;
    let newProduct = { id: products.length + 1, ...body };
    products.push(newProduct);
    res.send(newProduct);
})
app.put("/products/:id", function (req, res) {
    let id = +req.params.id;
    let body = req.body;
    let index = products.findIndex((ele) => ele.id === id)
    if (index >= 0) {
        let updatedProduct = { id: id, ...body };
        products[index] = updatedProduct;
        res.send(updatedProduct);
    }
    else res.status(404).send("No product found");
})
app.delete("/products/:id", function (req, res) {
    let id = +req.params.id;
    let index = products.findIndex((ele) => ele.id === id)
    if (index >= 0) {
        let deletedProduct = products.splice(index, 1);
        res.send(deletedProduct);
    }
    else res.status(404).send("No product found");
})

//orders:-----
app.get("/orders", function (req, res) {
    res.send(orders);
})
app.post("/orders", function (req, res) {
    let body = req.body;
    // Check if an order with the same ID already exists
    let existingOrderIndex = orders.findIndex(item => item.id === body.id);
    console.log(existingOrderIndex)

    if (existingOrderIndex !== -1) {
        orders[existingOrderIndex].qty += 1;
        res.send(orders[existingOrderIndex]);
    } else {
        orders.push({ ...body, qty: 1 });
        res.send({ ...body, qty: 1 });
    }
});

app.delete("/orders/:id", function (req, res) {
    let id = +req.params.id;
    let index = orders.findIndex((ele) => ele.id === id)
    console.log(index)
    if (index !== -1) {
        orders[index].qty -= 1;
        if (orders[index].qty === 0) {
            let deletedProduct = orders.splice(index, 1);
            res.send(deletedProduct);
        }
        res.send(orders[index]);
    }

    // if (index >= 0) {
    //     let deletedProduct = orders.splice(index, 1);
    //     res.send(deletedProduct);
    // }
    else res.status(404).send("No product found");
})

//login:----
app.post("/login", function (req, res) {
    let body = req.body;
    let verifyEmailPass = customer.find((ele) => ele.email === body.email && ele.password === body.password);
    console.log(verifyEmailPass)

    if (verifyEmailPass) {
        res.send(verifyEmailPass);
    } else {
        res.status(404).send("Invalid Credentials. Login again!!!")
    }
})
app.post("/register", function (req, res) {
    let body = req.body;
    let newCustomer = { name: body.name, email: body.email, password: body.password, user: body.user };
    customer.push(newCustomer);
    console.log(newCustomer)
    res.send(newCustomer);
})

//orderDeatils:---
app.post("/orderDetails", function (req, res) {
    let body = req.body;
    let newOrders = { name: body.name, city: body.city, addressLine1: body.addressLine1, totalValue: body.totalValue, qty: body.qty };
    orderDetails.push(newOrders);
    res.send(newOrders);
})
app.get("/orderDetails", function (req, res) {
    res.send(orderDetails);
})