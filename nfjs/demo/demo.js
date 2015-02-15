function DemoViewModel() {
    var _this = this;

    this.incompleteCount = 0;
    this.newTodoText = '';

    this.todos = [
        { isComplete: true, text: 'Get out of bed' },
        { isComplete: true, text: 'Drink coffee' },
        { isComplete: true, text: 'Go to work' },
        { isComplete: true, text: 'Drink coffee' },
        { isComplete: true, text: 'Eat lunch' },
        { isComplete: true, text: 'Drink coffee' },
        { isComplete: false, text: 'Go home' },
        { isComplete: false, text: 'Drink decaf coffee' },
        { isComplete: false, text: 'Go to bed' },
    ];

    toggleTodoCompleteStatus = function (todo) {
        todo.isComplete = !todo.isComplete;
        recalculateIncompleteCount();
    }

    deleteTodo = function (todo) {
        var indexToDelete = _this.todos.indexOf(todo);
        if (indexToDelete !== -1) {
            _this.todos.splice(indexToDelete, 1);
            recalculateIncompleteCount();
        }
    }

    addTodoClicked = function (item, e) {
        e.preventDefault();       
        addTodo();
        return false;
    }

    addTodoInputKeypress = function (item, e) {
        if (e.which === 13) {
            e.preventDefault();
            addTodo();
            return false;
        }
    }

    addTodo = function () {
        // if string is empty or just whitespace, don't add a new todo
        if (! (/\S/.test(_this.newTodoText))) {
            return;
        }

        _this.todos.push({
            isComplete: false,
            text: _this.newTodoText
        });

        _this.newTodoText = '';
        recalculateIncompleteCount();
    }

    recalculateIncompleteCount = function () {
        var newIncompleteCount = 0;
        for (var i = 0; i < _this.todos.length; i++) {
            if (!(_this.todos[i].isComplete)) {
                newIncompleteCount++;
            }
        }

        _this.incompleteCount = newIncompleteCount;
    }

    recalculateIncompleteCount();
}

NF.run(new DemoViewModel());