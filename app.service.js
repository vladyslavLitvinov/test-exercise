module.exports = function validate(req, res, next) {
  if (!req.body) {
    res.status(400).send("Should be an adverticement object in body!");
  }

  if (
    req.body.name.length > 200 ||
    req.body.description.length > 1000 ||
    req.photos.length > 3
  ) {
    res.status(422).send("Invalid properties!");
  }

  res.adverticement = {
    name: req.body.name,
    description: req.body.description,
    mainPhono: req.body.photos[0],
    photos: req.photos,
    price: req.body.price || 0,
  };

  next();
};
