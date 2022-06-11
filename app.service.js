module.exports = function validate(req, res, next) {
  if (!req.body) {
    res.status(400).send("Should be an adverticement object in body!");
  }

  if (!req.body.name || req.body.name.length > 200) 
  res.status(422).send("Invalid name!");
  
  if (!req.body.description || req.body.description.length > 1000) 
  res.status(422).send("Invalid description!");

  if (!req.body.photos || req.body.photos.length === 0 || req.body.photos.length > 3) 
  res.status(422).send("Invalid photos!");

  req.adverticement = {
    name: req.body.name,
    description: req.body.description,
    mainPhono: req.body.photos[0],
    photos: req.body.photos,
    price: req.body.price || 0,
  };

  next();
};
