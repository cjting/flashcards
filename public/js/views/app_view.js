App.views.AppView = Backbone.View.extend({
    el : '#main',

    events : {

    },

    initialize : function() {
        var self = this;

        this.cardCollection = null;
        this.listView = null;

        // setup special listener for the filter
        $('#filter').chosen().change(function(e) {
            var selectedFilter = $('#filter').find(':selected').val();
            self.cardCollection.each(function(card) {
                if(card.get('type') === selectedFilter) {
                    console.log('found question ' + card.get('question'));
                    card.set('visible', true);
                }
                else {
                    card.set('visible', false);
                }
            });

            self.listView.render();
        });
    },

    render : function() {
        var c1 = new App.models.Card();
        c1.set('type', 'javascript');
        c1.set('question', 'How do you find the intersection of two array?');

        var c2 = new App.models.Card();
        c2.set('type', 'javascript');
        c2.set('question', 'What is 1 + 1?');

        var c3 = new App.models.Card();
        c3.set('type', 'coffeescript');
        c3.set('question', 'Here\'s a really really long question, basically I just want to fill up some space.');

        var c4 = new App.models.Card();
        c4.set('type', 'javascript');
        c4.set('question', 'What are global variables?');

        var c5 = new App.models.Card();
        c5.set('type', 'coffeescript');
        c5.set('question', 'How are global variables declared?');

        var c6 = new App.models.Card();
        c6.set('type', 'javascript');
        c6.set('question', 'What are Javascript types?');

        this.cardCollection = new App.collections.CardsCollection([c1, c2, c3, c4, c5, c6]);
        this.listView = new App.views.ListView({collection : this.cardCollection});
        this.listView.render();
    }
});
