const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const PORT = 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/orders', (req, res) => {
    const db = router.db;
    const orders = db.get('orders');
    orders.push(req.body).write();
    res.status(201).send(req.body);
});

server.use(router);
server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
});
