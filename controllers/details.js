module.exports = {
    /**
     * 
     * @param {IncomingMessage} req 
     * @param {ServerResponse} res 
     */
    async details(req, res){
        const car = await req.storage.getById(req.params.id);
        if(car){
            res.render('details', {car, title: `Details - ${car.name}`});
        }else{
            res.redirect('/not-found');
        }
    }
}