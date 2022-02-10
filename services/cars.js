const Car = require('../models/Car');

const filePath = './services/data.json';


async function getAll(query) {
    const options = {
        isDeleted: false
    };

    if (query.search) {
        options.name = new RegExp(query.search, 'i');
    }
    if (query.from) {
        options.price = { $gte: Number(query.from) };
    }
    if (query.to) {
        if (!options.price) {
            options.price = {};
        }
        options.price.$lte = Number(query.to);
    }

    const cars = await Car.find(options).lean();
    return cars;
}

async function getById(id) {
    const car = await Car.findById(id).where({ isDeleted: false }).populate('accessories').lean();

    if (car) {
        return car;
    } else {
        return undefined;
    }
}

async function deleteById(id) {
    await Car.findByIdAndDelete(id);
    // await Car.findByIdAndUpdate(id, { isDeleted: true });
}

async function editById(id, car, ownerId) {
    const existing = await Car.findById(id);

    if (existing.owner != ownerId) {
        return false;
    }

    existing.name = car.name;
    existing.description = car.description;
    existing.imageUrl = car.imageUrl || undefined;
    existing.price = car.price;
    existing.accessories = car.accessories;
    console.log("car", car.accessories)

    await existing.save();

    return true;
}


async function attachAccessory(carId, accessoryId, ownerId) {
    const existing = await Car.findById(carId);

    existing.accessories.push(accessoryId);
    await existing.save();
}

async function createCar(car) {
    const result = new Car(car);
    await result.save();
}

module.exports = () => (req, res, next) => {
    req.storage = {
        getAll,
        getById,
        createCar,
        deleteById,
        editById,
        attachAccessory
    };
    next();
}
