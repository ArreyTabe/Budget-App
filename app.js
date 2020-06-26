
//Budget Controller
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp = 0,
            inc = 0
        }
    };

    return {
        addItem: function (type, des, val) {
            var newItem, id;


            id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            if (type === 'exp') {
                newItem = new Expense(id, des, value);
            } else if (type === 'inc') {
                newItem = new income(id, des, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        }
    };


})();


//UI controller
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will either be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };

        },

        getDOMstrings: function () {
            return DOMstrings;
        }

    };


})();




//Global App Controller 
var controller = (function (budgetctrl, UIcntrl) {

    var setupEventListeners = function () {
        var DOM = UIcntrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }

        });
    };

    var ctrlAddItem = function () {
        //1 get the field input data

        var input = UIcntrl.getInput();

        //2 add the item to the budget controller
        //3 add the item to the UI
        //4 calculate the budget
        // didplay the result on the UI

    }


    return {
        init: function () {
            console.log('Application started!');
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();




