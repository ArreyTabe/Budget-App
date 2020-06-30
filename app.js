
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
            exp: 0,
            inc: 0
        },
    };

    return {
        addItem: function (type, des, val) {
            var newItem, id;

            // create new id;
            if (data.allItems[type] > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            //create new item based on 'inc' or 'exp' type;
            if (type === 'exp') {
                newItem = new Expense(id, des, val);
            } else if (type === 'inc') {
                newItem = new Income(id, des, val);
            }
            // push it into our data structure
            data.allItems[type].push(newItem);

            // return the element
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
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will either be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };

        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            //create an HTML string with some placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete" > <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div ></div ></div > ';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with some actuall data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);


            //insert the HTMl into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

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
        var input, newItem;
        //1 get the field input data

        input = UIcntrl.getInput();

        //2 add the item to the budget controller

        newItem = budgetctrl.addItem(input.type, input.description, input.value);

        //3 add the item to the UI
        UIcntrl.addListItem(newItem, input.type);
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




