if (Meteor.isServer) {
    Meteor.publish('games', function () {
        return games.find();
    });
}

if (Meteor.isClient) {
    Template.game.helpers({
        parseDate: function (date) {
            return moment(date).format('D MMM, HH:mm');
        },
        alreadyJoin: function (players) {
            return $.inArray(Meteor.userId(), players);
        },
        player: function () {
            return users.findOne({_id: this.toString()});
        }
    });


    Template.game.events({
        'click [data-action=save]': function (event) {
            if (!Meteor.userId()) {
                Meteor.loginWithGoogle();
                return false;
            }
            games.update({
                _id: $(event.target).data('game-id')
            }, {
                $addToSet: {
                    players: Meteor.userId()
                }
            });
        },
        'click [data-action=leave]': function (event) {
            games.update({
                    _id: $(event.target).data('game-id')
                },
                {
                    $pull: {
                        players: Meteor.userId()
                    }
                }
            );
        }
    });
}
