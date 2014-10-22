if (Meteor.isServer) {
    Meteor.publish('messages', function () {
        return messages.find({}, {
            fields: {
                'content': 1,
                'author': 1,
                'date': 1
            }
        });
    });
}

if (Meteor.isClient) {
    var scrollChatDown = function () {
        $(".chat-list").stop(true, true).animate({
            scrollTop: $(".chat-list table").height()
        }, "slow");
    };

    messages.find().observeChanges({
        added: function () {
            scrollChatDown();
        }
    });

    Template.chat.helpers({
        messages: function () {
            return messages.find();
        },
        getName: function (id) {
            return Meteor.users.findOne({_id: id}).profile.name;
        },
        parseDatetime: function (date) {
            return moment(date).format('D MMM, HH:mm:ss');
        }
    });

    Template.chat.events({
        'submit form': function (event) {
            event.preventDefault();
            var $input = $(event.target).find('[name=message]');

            if (!$input.val().length) {
                return false;
            }

            messages.insert({
                date: new Date(),
                author: Meteor.userId(),
                content: $input.val()
            });

            scrollChatDown();

            $input.val('');

            return false;
        }
    });
}