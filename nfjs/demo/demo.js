function DemoViewModel() {
    var _this = this;

    _this.messages = ['Does this work?', 'Hello world!', 'Nathan Friend'];
    _this.message = 'It works!';
    _this.clickMeHandler = function () {
        console.log('Click handlers work!');
    };
    _this.clickMeTooMouseDownHandler = function () {
        console.log('The Event binding works!');
    }

    _this.firstName = 'Nathan';
    _this.lastName = 'Friend';
    _this.changeName = function () {
        _this.firstName = 'John '
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

NF.run(new DemoViewModel());