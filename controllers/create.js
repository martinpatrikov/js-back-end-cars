const { mapError } = require("../services/util");

module.exports = {
    get(req, res) {
        res.render('create', { title: 'Create' });
    },
    async post(req, res) {
        const car = {
            name: req.body.name,
            imageUrl: req.body.imageUrl || undefined,
            description: req.body.description,
            price: Number(req.body.price),
            owner: req.session.user.id
        };
        try {
            await req.storage.createCar(car);

            res.redirect('/');
        } catch (err) {
            res.locals.errors = mapError(err);
            res.render('create', { title: 'Create', car});
        }
    }
}