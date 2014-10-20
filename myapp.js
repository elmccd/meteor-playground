counters = new Mongo.Collection('counters');
players = new Mongo.Collection('players');
games = new Mongo.Collection('games');
users = Meteor.users;

Router.route('/', function () {
    this.render('Index');
});

Router.route('/add', function () {
    this.render('Add');
});

Router.route('/games', function () {
    this.render('Games');
});


if (Meteor.isClient) {

    Meteor.subscribe('users');
    Meteor.subscribe('games');

    Template.Index.helpers({
        user: function () {
            return Meteor.user() ? Meteor.user() : false;
        }
    });

    Template.Nav.helpers({
        personsOnline: function () {
            return Meteor.users.find({'status.online': true}).fetch();
        }
    });

    Template.Games.helpers({
        games: function () {
            return games.find();
        },
        upcomingGames: function () {
            return games.find({
                date: {
                    $gt: new Date()
                }
            });
        },
        player: function () {
            console.info(this.toString());
            console.info(users.findOne({_id: this.toString()}));
            return users.findOne({_id: this.toString()});
        }
    });

    Template.Index.events({
        'click .logout': function () {
            console.log('logout');
            Meteor.logout();
        },
        'click .login': function () {
            console.log('login');
            Meteor.loginWithGoogle();
        }
    });



    Template.Add.events({
        'submit form': function (event) {
            event.preventDefault();

            var $date = $(event.target).find('[name=date]');
            var date = null;

            if ($date.val() !== "") {
                date = $date.data("DateTimePicker").getDate()._d;
            }
            games.insert({
                date: date,
                comment: $(event.target).find('[name=comment]').val(),
                players: []
            });

            Router.go('/');


            return false;
        }
    });

    Template.Add.rendered = function() {
        $('[data-datetime]').datetimepicker({
            minuteStepping: 5
        });
    };
    Template.Games.events({
        'click [data-action=save]': function (event) {
            games.update({
                _id: $(event.target).data('game-id')
            }, {
                $addToSet: {
                    players: Meteor.user()._id
                }
            });
        },
        'click [data-action=leave]': function (event) {
            console.log($(event.target).data('game-id'));
            games.update({
                    _id: $(event.target).data('game-id')
                },
                {
                    $pull: {
                        players: Meteor.user()._id
                    }
                }
            );
        }
    });
}

if (Meteor.isServer) {


    Meteor.publish('games', function () {
        return games.find();
    });

    Meteor.publish('users', function () {
        return Meteor.users.find({}, {
            fields: {
                'profile.name': 1,
                'status.online': 1,
                'services.google.email': 1
            }
        });
    });

// first, remove configuration entry in case service is already configured
    ServiceConfiguration.configurations.remove({
        service: "google"
    });

    ServiceConfiguration.configurations.insert({
        service: "google",
        clientId: "571219495073-iaivsrdq35fso78i6ku81idbudstlpmq.apps.googleusercontent.com",
        secret: "OSBDpwnbWBDVcN0L41owGa65"
    });


    Meteor.methods({
        removeAllGames: function () {
            games.remove({});
        }
    });
}