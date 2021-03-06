﻿function TestViewModel() {
    var _this = this;

    _this.messages = ['Does this work?', 'Hello world!', 'Nathan Friend'];
    _this.deleteMessage = function (messageToDelete) {
        var indexToDelete = _this.messages.indexOf(messageToDelete);
        if (indexToDelete !== -1) {
            _this.messages.splice(indexToDelete, 1);
        }
    };

    _this.message = 'It works!';
    _this.clickMeHandler = function () {
        console.log('Click handlers work!');
        _this.clickMeCount++;
    };
    _this.clickMeTooMouseDownHandler = function () {
        console.log('The Event binding works!');
        _this.clickMeTooCount++;
    }

    _this.clickMeCount = 0;
    _this.clickMeTooCount = 0;

    _this.firstName = 'Nathan';
    _this.lastName = 'Friend';
    _this.changeName = function () {
        _this.firstName = 'John'
        _this.lastName = 'Doe';
    }

    _this.currentDate = null;

    _this.complexObject = {
        aKey: {
            anotherKey: {
                finallyTheValue: 'Hello there.'
            }
        }
    }

    setInterval(calculateAndSetDate, 500);

    function calculateAndSetDate() {
        _this.currentDate = moment(Date.now()).format('MMMM Do YYYY, h:mm:ss a');
    }

    calculateAndSetDate();
}

NF.run(new TestViewModel());