const { mapError } = require("../services/util");

module.exports = {
    async get(req, res) {
        const id = req.params.id;
        const car = await req.storage.getById(id);

        if (car.owner != req.session.user.id) {
            console.log('User is not owner');
            return res.redirect('/login');
        }

        if (car) {
            res.render('edit', { title: `Edit - ${car.name}`, car });
        } else {
            console.log('yikes')
            res.redirect('/404');
        }
    },
    async post(req, res) {
        const id = req.params.id;
        const old = await req.storage.getById(id);

        const car = {
            name: req.body.name,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            price: Number(req.body.price),
            accessories: old.accessories,
            _id: id
        };
        try {
            if (await req.storage.editById(id, car, req.session.user.id)) {
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        } catch (err) {
            res.locals.errors = mapError(err);
            res.render('edit', { title: `Edit - ${car.name}`, car });
            //console.log(err.message)
            // res.redirect('/404');
        }
    }
}