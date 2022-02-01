module.exports = {
    async get(req, res){
        const id = req.params.id;
        const [car, accessories] = await Promise.all([
            req.storage.getById(id),
            req.accessory.getAll()
        ]);

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

        try{
            await req.storage.attachAccessory(carId, accessoryId);

            res.redirect('/');
        }catch(err){
            console.log('Error creating');

            res.redirect('/attach/' + carId);
        }        
    }
}