counters = new Mongo.Collection('counters');
players = new Mongo.Collection('players');
games = new Mongo.Collection('games');
messages = new Mongo.Collection('messages');
users = Meteor.users;

Router.configure({
    layoutTemplate: 'layoutDefault'
});

Router.route('/', function () {
    this.render('Index');
});

Router.route('/add', function () {
    this.render('Add');
});

Router.route('/archive', function () {
    this.render('archive');
});


if (Meteor.isClient) {

    Meteor.subscribe('users');
    Meteor.subscribe('games');
    Meteor.subscribe('messages');

    Template.userInfo.helpers({
        user: function () {
            return Meteor.user() || false;
        }
    });

    Template.usersOnline.helpers({
        personsOnline: function () {
            return Meteor.users.find({'status.online': true}).fetch();
        }
    });

    Template.nav.helpers({
        currentRoute: function (route) {
            return Router.current().route.path() === route ? 'active' : '';
        }
    });


    Template.upcomingGames.helpers({
        games: function () {
            return games.find({
                date: {
                    $gt: new Date()
                }
            });
        }
    });
    Template.archive.helpers({
        games: function () {
            return games.find({
                date: {
                    $gt: new Date()
                }
            });
        }
    });

    Template.userInfo.events({
        'click [data-action=logout]': function () {
            console.log('logout');
            Meteor.logout();
        },
        'click [data-action=login]': function () {
            console.log('login');
            Meteor.loginWithGoogle();
        }
    });
}

if (Meteor.isServer) {
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
            Meteor.user().services.google.email === 'elmccd@gmail.com' ?  games.remove({}) : '';
        }
    });

    Meteor.methods({
        removeAllMessages: function () {
            Meteor.user().services.google.email === 'elmccd@gmail.com' ?  messages.remove({}) : '';
        }
    });
}