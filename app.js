var express = require('express'),
    dbHelper = require('./db.js'),
    app = express(),
    database = {
        HOST : 'localhost',
        PORT : 27017,
        DB_NAME : 'flashcards'
    },
    NODE_PORT = 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');

// Use the bodyParser middleware to parse post data
app.use(express.bodyParser());

dbHelper.connect(database.HOST, database.PORT, database.DB_NAME)
    .done(onConnectSuccessful)
    .fail(onConnectFail);

app.listen(NODE_PORT);
console.log('Node server started, listening on ' + NODE_PORT);

function onConnectSuccessful(db) {
    console.log('connection successful');

    app.get('/', function(req, res) {
        res.render('index', {});
    });

    app.configure(function() {
        app.use(express.static('public'));
        app.use(app.router);
    });

    app.post('/deck', function(req, res) {
        console.log("in /deck");
        var seedTypes = req.param('seedTypes', '');
        console.dir(req.body);
        console.log(req.body['seedTypes']);
        var seedTypesArray = seedTypes.split(',');

        //TODO: use the seedTypesArray to create a new deck and return the deck id and all of the cards
        res.render('deck', {list : []});
    });

    app.get('/list/:id', function(req, res) {
        dbHelper.getList(db, req.params.id)
            .done(function(list) {
//                res.render('list', {
//                    list : list
//                });
            })
            .fail(function(err) {
                res.send(err);
            });
    });

    //====================================
    // CARDS REST API
    //====================================
    app.get('/cards', function(req, res) {
        dbHelper.getAllCards(db)
            .done(function(cardsList) {
                res.send(cardsList);

            })
            .fail(function(err) {
                res.send(err);
            });
    });

    app.get('/card/:id', function(req, res) {
        dbHelper.getCard(db, req.params.id)
            .done(function(card) {
                //res.render('list', {
                //    list : list
                //});
                res.send(card);

            })
            .fail(function(err) {
                res.send(err);
            });
    });

    app.post('/card', function(req,res) {
        var card = {};
        //card._id = req.body.id;
        card.userid = req.body.userid;
        card.question = req.body.question;
        card.answer = req.body.answer;
        card.is_public = false;
        card.difficuly = req.body.difficulty;
        card.owner_id = req.body.owner;
        card.creation_ts = new Date();
        card.last_modified = new Date();
        card.status = 'active';

        dbHelper.createCard(db, card)
         .done(function(card) {
                console.log('New card created.')
                res.send(card);
            })
         .fail(function(err) {
                console.log('Failed to create new card')
                res.send(err);
            });
    });

    app.put('/card/:id', function(req,res) {
        var card = {};
        var id = req.params.id;

        if(req.body.userid) { card.userid = req.body.userid; }
        if(req.body.question) { card.question = req.body.question; }
        if(req.body.answer) { card.answer = req.body.answer; }
        if(req.body.is_public) { card.is_public = req.body.is_public; }
        if(req.body.difficulty) { card.difficuly = req.body.difficulty; }
        if(req.body.owner) { card.owner_id = req.body.owner; }
        card.last_modified = new Date();

        dbHelper.updateCard(db, id, card)
            .done(function(card) {
                console.log('Card id:' + req.params.id+ ' updated.');
                res.send(card);
            })
            .fail(function(err) {
                console.log('Failed to update card')
                res.send(err);
            });

    });


    app.delete('/card/:id', function(req,res) {
        var id = req.params.id;

        dbHelper.deleteCard(db, id)
        .done(function(card) {
            console.log('Card id:' + id + ' deleted.');
            res.send({'status':'ok'});
        })
        .fail(function(err) {
            console.log('Failed to delete card')
            res.send(err);
        });
    });

    //====================================
    // DECKS REST API
    //====================================

    app.get('/deck', function(req, res) {
        dbHelper.getAllDecks(db)
            .done(function(decksList) {
                res.send(decksList);

            })
            .fail(function(err) {
                res.send(err);
            });
    });

    app.get('/deck/:id', function(req, res) {
        dbHelper.getDeck(db, req.params.id)
            .done(function(deck) {
                res.send(deck);
            })
            .fail(function(err) {
                res.send(err);
            });
    });

    app.post('/deck', function(req,res) {

        var deck = {};
        deck.owner_id = req.body.owner_id;
        deck.name = req.body.name;
        deck.card_ids = req.body.card_ids;
        deck.creation_ts = new Date();
        deck.last_modified = new Date();
        deck.status = 'active';

        dbHelper.createDeck(db, deck)
            .done(function(deck) {
                console.log('New deck created.')
                res.send(deck);
            })
            .fail(function(err) {
                console.log('Failed to create new deck')
                res.send(err);
            });
    });

    app.put('/deck/:id', function(req,res) {
        var deck = {};
        var id = req.params.id;

        if(req.body.owner_id) { deck.owner_id = req.body.owner_id; }
        if(req.body.name) { deck.name = req.body.name; }
        if(req.body.card_ids) { deck.card_ids = req.body.card_ids; }
        if(req.body.status) { user.status = req.body.status; }
        deck.last_modified = new Date();

        dbHelper.updateDeck(db, id, card)
            .done(function(card) {
                console.log('Deck id:' + req.params.id+ ' updated.');
                res.send(card);
            })
            .fail(function(err) {
                console.log('Failed to update deck')
                res.send(err);
            });

    });


    app.delete('/deck/:id', function(req,res) {
        var id = req.params.id;

        dbHelper.deleteDeck(db, id)
            .done(function(deck) {
                console.log('Deck id:' + id + ' deleted.');
                res.send({'status':'ok'});
            })
            .fail(function(err) {
                console.log('Failed to delete deck')
                res.send(err);
            });
    });



    //====================================
    // USERS REST API
    //====================================

    app.get('/user', function(req, res) {
        dbHelper.getAllUsers(db)
            .done(function(usersList) {
                res.send(usersList);

            })
            .fail(function(err) {
                res.send(err);
            });
    });

    app.get('/user/:id', function(req, res) {
        dbHelper.getUser(db, req.params.id)
            .done(function(user) {
                //res.render('list', {
                //    list : list
                //});
                res.send(user);

            })
            .fail(function(err) {
                res.send(err);
            });
    });

    app.post('/user', function(req,res) {

        var email = req.body.email;

        var user = {};
        user.email = email;
        user.userid = (email) ? email.substring(0, email.indexOf("@")) : "";
        user.pwd = req.body.pwd;
        user.points = req.body.points;
        user.deck_ids = req.body.deck_ids;
        user.creation_ts = new Date();
        user.last_modified = new Date();
        user.status = 'active';

        dbHelper.createUser(db, user)
            .done(function(user) {
                console.log('New user created.')
                res.send(user);
            })
            .fail(function(err) {
                console.log('Failed to create new user')
                res.send(err);
            });
    });

    app.put('/user/:id', function(req,res) {
        var user = {};
        var id = req.params.id;

        if(req.body.email) { user.email = req.body.email; }
        if(req.body.pwd) { user.question = req.body.pwd; }
        if(req.body.points) { user.points = req.body.points; }
        if(req.body.deck_ids) { user.deck_ids = req.body.deck_ids; }
        if(req.body.status) { user.status = req.body.status; }

        card.last_modified = new Date();

        dbHelper.updateUser(db, id, card)
            .done(function(card) {
                console.log('Card id:' + req.params.id+ ' updated.');
                res.send(card);
            })
            .fail(function(err) {
                console.log('Failed to update card')
                res.send(err);
            });

    });


    app.delete('/user/:id', function(req,res) {
        var id = req.params.id;

        dbHelper.deleteUser(db, id)
            .done(function(user) {
                console.log('User id:' + id + ' deleted.');
                res.send({'status':'ok'});
            })
            .fail(function(err) {
                console.log('Failed to delete user')
                res.send(err);
            });
    });


    // Catches every 404
    app.use(function(req, res, next) {
        res.send(404, 'Oops, requested page does not exist');
    });
}

function onConnectFail() {
    console.log('connection failed');
}
