module.exports = {
    get(req, res){
        res.render('createAccessory', { title: 'Create Accessory'})
    },
    async post(req, res){
        const accessory = {
            name: req.body.name,
            imageUrl: req.body.imageUrl || undefined,
            description: req.body.description,
            price: Number(req.body.price),
            owner: req.session.user.id
        };
        try{
            await req.accessory.createAccessory(accessory);

            res.redirect('/');
        }catch(err){
            console.log(err);
            console.log('Error creating');

            res.redirect('/accessory');
        }        
    }
}