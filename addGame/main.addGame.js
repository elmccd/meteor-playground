if (Meteor.isServer) {
    Meteor.publish('games', function () {
        return games.find();
    });
}

if (Meteor.isClient) {
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
}
