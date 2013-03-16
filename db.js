var mongo = require('mongodb'),
    BSON = mongo.BSONPure,
    Server = mongo.Server,
    Db = mongo.Db,
    Deferred = require('Deferred');

var apis = {

    connect : function(host, port, database) {
        var deferred = Deferred();

        var server = new Server(host, port, {auto_reconnect : true});
        var db = new Db(database, server);

        // Attempt to connect to db
        db.open(function(err) {
            console.log('connected to db');

            err ? deferred.reject(err) : deferred.resolve(db);
        });

        db.createCollection('users', function(err, collection) {
            console.log('users collection created')
        });

        db.createCollection('cards', function(err, collection) {
            console.log('cards collection created')
        });

        db.createCollection('decks', function(err, collection) {
            console.log('decks collection created')
        });

        return deferred;
    },

    //========================================
    // CARDS DB API's
    //========================================
    getAllCards : function(db) {
        var deferred = Deferred();

        db.collection('cards', function(err, collection) {

            if(!err) {
                var cursor = collection.find({}, function(err, card) {
                            if(err || !card) {
                                deferred.reject('No document found');
                            }
                        });

                var cardsList = [];
                cursor.each(function(item) {
                    cardsList.push(item);
                });
                deferred.resolve(cardsList);

            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    getCard : function(db, id) {
        var deferred = Deferred();

        db.collection('cards', function(err, collection) {

            var query = {
                _id : id
            };

            if(!err) {
                collection.findOne(query, function(err, card) {
                    if(err || !card) {
                        deferred.reject('No document found');
                    }
                    else {
                        // Found the document
                        deferred.resolve(card);
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    createCard : function(db, card) {
        var deferred = Deferred();

        db.collection('cards', function(err, collection) {

            if(!err) {

                collection.insert(card, {safe:true}, function(err, records) {
                    if(!err) { deferred.resolve(records);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error creating card');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    updateCard : function(db, id, card) {
        var deferred = Deferred();

        db.collection('cards', function(err, collection) {

            var o_id = new BSON.ObjectID(id);
            var query = {
                _id : o_id
            };

            if(!err) {
                //collection.findAndModify(query, [['_id','asc']], {$set: card}, {new:true}, function(err, updatedCard) {
                collection.update(query, card, {safe:true, upsert:true}, function(err, updatedCard) {
                    if(!err) { deferred.resolve(updatedCard);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error creating card');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    // Do a soft delete. Just set the flag. Not actually removing record from DB
    deleteCard : function(db, id) {
        var deferred = Deferred();

        db.collection('cards', function(err, collection) {

            var query = {
                _id : id
            };

            if(!err) {

                collection.findAndModify(query, [['_id','asc']], {$set: {'status':'deleted'}}, {new:true}, function(err, updatedCard) {
                    if(!err) { deferred.resolve(updatedCard);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error deleting card');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    createList : function(db, cards) {

    },

    getList : function(db, id) {
        var deferred = Deferred();

        db.collection('lists', function(err, collection) {
            // Initialize query obj
            var query = {
                _id : Number(id)
            };

            if(!err) {
                collection.findOne(query, function(err, document) {
                    if(err || !document) {
                        deferred.reject('No document found');
                    }
                    else {
                        // Found the document
                        deferred.resolve(document.cards);
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    //========================================
    // USERS DB API's
    //========================================
    getUser: function(db, id) {
        var deferred = Deferred();

        db.collection('users', function(err, collection) {

            var query = {
                _id : id
            };

            if(!err) {
                collection.findOne(query, function(err, user) {
                    if(err || !user) {
                        deferred.reject('No user record found');
                    }
                    else {
                        // Found the document
                        deferred.resolve(user);
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to users collection');
            }
        });

        return deferred;
    },

    createUser : function(db, user) {
        var deferred = Deferred();

        db.collection('users', function(err, collection) {

            if(!err) {

                collection.insert(user, {safe:true}, function(err, records) {
                    if(!err) { deferred.resolve(records);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error creating user');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to users collection');
            }
        });

        return deferred;
    },

    updateUser : function(db, id, user) {
        var deferred = Deferred();

        db.collection('users', function(err, collection) {

            var o_id = new BSON.ObjectID(id);
            var query = {
                _id : o_id
            };

            if(!err) {
                //collection.findAndModify(query, [['_id','asc']], {$set: card}, {new:true}, function(err, updatedCard) {
                collection.update(query, user, {safe:true, upsert:true}, function(err, updatedUser) {
                    if(!err) { deferred.resolve(updatedUser);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error updating user: ' + user.email);

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to cards collection');
            }
        });

        return deferred;
    },

    deleteUser : function(db, id) {
        var deferred = Deferred();

        db.collection('users', function(err, collection) {

            var query = {
                _id : id
            };

            if(!err) {

                collection.findAndModify(query, [['_id','asc']], {$set: {'status':'deleted'}}, {new:true}, function(err, updatedCard) {
                    if(!err) { deferred.resolve(updatedCard);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error deleting user');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to users collection');
            }
        });

        return deferred;
    },

    //========================================
    // DECKS DB API's
    //========================================

    getAllDecks : function(db) {
        var deferred = Deferred();

        db.collection('decks', function(err, collection) {

            if(!err) {
                var cursor = collection.find({}, function(err, card) {
                    if(err || !card) {
                        deferred.reject('No documents found');
                    }
                });

                var decksList = [];
                cursor.each(function(item) {
                    decksList.push(item);
                });
                deferred.resolve(decksList);

            }
            else {
                deferred.reject('Cannot connect to decks collection');
            }
        });

        return deferred;
    },

    getDeck: function(db, id) {
        var deferred = Deferred();

        db.collection('decks', function(err, collection) {

            var query = {
                _id : id
            };

            if(!err) {
                collection.findOne(query, function(err, user) {
                    if(err || !user) {
                        deferred.reject('No deck record found');
                    }
                    else {
                        // Found the document
                        deferred.resolve(user);
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to decks collection');
            }
        });

        return deferred;
    },

    createDeck : function(db, deck) {
        var deferred = Deferred();

        db.collection('decks', function(err, collection) {

            if(!err) {

                collection.insert(deck, {safe:true}, function(err, records) {
                    if(!err) { deferred.resolve(records);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error creating deck');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to decks collection');
            }
        });

        return deferred;
    },

    updateDeck : function(db, id, deck) {
        var deferred = Deferred();

        db.collection('decks', function(err, collection) {

            var o_id = new BSON.ObjectID(id);
            var query = {
                _id : o_id
            };

            if(!err) {
                //collection.findAndModify(query, [['_id','asc']], {$set: card}, {new:true}, function(err, updatedCard) {
                collection.update(query, user, {safe:true, upsert:true}, function(err, updatedDeck) {
                    if(!err) { deferred.resolve(updatedUser);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error updating deck: ' + deck.id);

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to decks collection');
            }
        });

        return deferred;
    },

    deleteDeck : function(db, id) {
        var deferred = Deferred();

        db.collection('decks', function(err, collection) {

            var query = {
                _id : id
            };

            if(!err) {

                collection.findAndModify(query, [['_id','asc']], {$set: {'status':'deleted'}}, {new:true}, function(err, updatedDeck) {
                    if(!err) { deferred.resolve(updatedDeck);}
                    else {
                        console.warn(err.message);
                        deferred.reject('Error deleting deck');

                        if (err && err.message.indexOf('E11000 ') !== -1) {
                            // this _id was already inserted in the database
                        }
                    }
                });
            }
            else {
                deferred.reject('Cannot connect to decks collection');
            }
        });

        return deferred;
    }

};

// Export the APIs
for(var i in apis) {
    exports[i] = apis[i];
}
