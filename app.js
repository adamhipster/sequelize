var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://melvin:postgress@localhost/testapp');

//use the same hat definition as before
var Hat = sequelize.define('hat', {
    name: Sequelize.STRING,
    material: Sequelize.STRING,
    height: Sequelize.INTEGER,
    brim: Sequelize.BOOLEAN
});

//define a simple person model
var Person = sequelize.define('person', {
    name: Sequelize.STRING
});

//a person can have many hats...
Person.hasMany(Hat);
//... but a hat belongs to a single person.
Hat.belongsTo(Person);

sequelize
    //sync the models
    .sync()
    .then(function(){
        //then create a person
        //turns into INSERT INTO "people" ("id", "name") VALUES (DEFAULT, 'Jane Smith')
        return Person.create({
            name: 'Jane Smith'
        })
    })
    .then(function(person){
        //then create a hat for that person
        //turns into INSERT INTO "hats" ("id", "name", "material", "height", "brim", "personId")
        //  VALUES (DEFAULT, 'cowboy', 'straw', 3, true, 1) RETURNING *;
        return Promise.all([
        
            person.createHat({
                name: 'cowboy',
                material: 'straw',
                height: 3,
                brim:true
            }),
            person.createHat({
                name: 'yay',
                material: 'meh',
                height: 1337,
                brim: false
            }),

        ])
    });