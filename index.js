const express = require('express');
const hbs = require('express-handlebars');
const session = require('express-session');

const initDb = require('./models');

const carsService = require('./services/cars');
const accessoryService = require('./services/accessory');
const authService = require('./services/auth');
const { isLoggedIn } = require('./services/util');

const { about } = require('./controllers/about');

const create = require('./controllers/create');
const del = require('./controllers/delete');
const edit = require('./controllers/edit');

const accessory = require('./controllers/accessory');

const { details } = require('./controllers/details');
const { home } = require('./controllers/home');
const { notFound } = require('./controllers/notFound');
const attach = require('./controllers/attach');
const authController = require('./controllers/auth');



start();

async function start() {
	await initDb();

	const app = express();

	app.engine('hbs', hbs.create({
		extname: '.hbs'
	}).engine);
	app.set('view engine', 'hbs');

	app.use(session({
		secret: 'this is very secret',
		resave: false, 
		saveUninitialized: true,
		cookie: { secret: 'auto' }
	}))
	app.use(express.urlencoded({ extended: true }));
	app.use('/static', express.static('static'));
	
	app.use(carsService());
	app.use(accessoryService());
	app.use(authService());

	app.get('/', home);
	app.get('/about', about);

	app.get('/create', isLoggedIn(), create.get);
	app.post('/create', isLoggedIn(), create.post);

	app.get('/details/:id', details);
	app.route('/delete/:id')
		.get(del.get)
		.post(del.post);

	app.route('/edit/:id')
		.get(isLoggedIn(), edit.get)
		.post(isLoggedIn(), edit.post);

	app.route('/accessory')
		.get(isLoggedIn(), accessory.get)
		.post(isLoggedIn(), accessory.post);

	app.route('/attach/:id')
		.get(isLoggedIn(), attach.get)
		.post(isLoggedIn(), attach.post);

	app.use(authController);

	app.all('*', notFound);

	app.listen(3000, () => console.log('Server started on port 3000'));
}