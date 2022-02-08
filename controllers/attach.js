module.exports = {
    async get(req, res){
        const id = req.params.id;
        const [car, accessories] = await Promise.all([
            req.storage.getById(id),
            req.accessory.getAll()
        ]);

        if(car.owner != req.session.user.id){
            console.log('User is not owner');
            return res.redirect('/login');
        }

        const existingIds = car.accessories.map(a => a._id.toString());
        const availableAccessories = accessories.filter(a => existingIds.includes(a._id.toString()) == false);

        if(car){
            res.render('attachAccessory', { title: `Attach Accesory - ${car.name}`, car, accessories: availableAccessories });
        }else{
            res.redirect('/404');
        }
    },
    async post(req, res){
        const carId = req.params.id;
        const accessoryId = req.body.accessory;
        const car = await req.storage.getById(carId);

        if(car.owner != req.session.user.id){
            console.log('User is not owner');
            return res.redirect('/login');
        }

        try{
            await req.storage.attachAccessory(carId, accessoryId, req.session.user.id);

            res.redirect('/');
        }catch(err){
            console.log('Error creating');

            res.redirect('/attach/' + carId);
        }        
    }
}