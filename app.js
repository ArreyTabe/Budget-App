
//Budget Controller
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    Expense.prototype.calcpercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };

    var calculateTotal = function (type) {
        sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;

    },

        data = {
            allItems: {
                exp: [],
                inc: []
            },
            totals: {
                exp: 0,
                inc: 0
            },
            budget: 0,
            percentage: -1
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
        },

        deleteItem: function (type, id) {
            var index, ids
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });
            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function () {
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (cur) {
                cur.calcpercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function (num, type) {
        var numSplit, int, dec, type;
        /*
        + or - before number
        exactly two decimal places
        comma separating the thousands
        */

        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.')

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }
        dec = numSplit[1];
        type === 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }

    }


    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will either be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };

        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            //create an HTML string with some placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete" > <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div ></div ></div > ';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with some actuall data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            //insert the HTMl into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },
        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = '';

            });
            fieldsArr[0].focus();
        },
        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'inc');
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }

        },

        displaypercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';

                }

            });

        },

        displayMonth: function () {
            var now, year, month, months;

            now = new Date();

            months = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                'October', 'November', 'December'];

            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');

            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UIcntrl.changedType);
    };

    var updateBudget = function () {
        //1 calculate the budget
        budgetctrl.calculateBudget()

        //2 Return the budget 
        var budget = budgetctrl.getBudget();

        //3 didplay the result on the UI
        UIcntrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        // calculate the percentages
        budgetctrl.calculatePercentages();

        // Read percentages from the Budget controller
        var percentages = budgetctrl.getPercentages();

        // update the UI with the new percentages
        UIcntrl.displaypercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        //1 get the field input data

        input = UIcntrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2 add the item to the budget controller

            newItem = budgetctrl.addItem(input.type, input.description, input.value);

            //3 add the item to the UI
            UIcntrl.addListItem(newItem, input.type);

            //4 clear the fields
            UIcntrl.clearFields();

            //5 calculate and update budget
            updateBudget();

            //6 calculate and update the percentages
            updatePercentages();
        }


    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //delete itemm from the data structure
            budgetctrl.deleteItem(type, ID)

            // delete the item from the UI
            UIcntrl.deleteListItem(itemID);

            //update and show the new budget
            updateBudget();

            // calculate and update the percentages
            updatePercentages();

        }

    }


    return {
        init: function () {
            console.log('Application started!');
            UIcntrl.displayMonth();
            UIcntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, UIController);

controller.init();




