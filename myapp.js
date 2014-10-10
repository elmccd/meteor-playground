counters = new Mongo.Collection('counters');

if (Meteor.isClient) {
    Template.game.helpers({
        counter1: function () {
            return counters.findOne({
                name: 'counter-a'
            });
        },
        counter2: function () {
            return counters.findOne({
                name: 'counter-b'
            });
        }
    });

    Template.game.events({
        'click .click1': function () {
            counters.update(counters.findOne({name: 'counter-a'})._id,
                {
                    $inc: {
                        value: 1
                    }
                });
        },
        'click .click2': function () {
            counters.update(counters.findOne({name: 'counter-b'})._id,
                {
                    $inc: {
                        value: 1
                    }
                });
        },
        'click .click3': function () {
            console.log('test')
            Meteor.call('clear');
        }
    });
}

if (Meteor.isServer) {

    Meteor.methods({
       'clear': function () {
           console.log('dd');
           counters.update({}, {
               $set: {
                   value: 0
               }
           }, {
               multi: true
           });
       }
    });

    if (counters.find().count() === 0) {
        counters.insert({
            name: 'counter-a',
            value: 0
        });
        counters.insert({
            name: 'counter-b',
            value: 0
        });
    }
}
