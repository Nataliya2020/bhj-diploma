/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Данных нет");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {

    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      const createIncomeButton = event.target.closest('.create-income-button');
      const createExpenseButton = event.target.closest('.create-expense-button');
      const accounts = [...document.querySelectorAll('.account')].length;

      if (createIncomeButton && accounts !== 0) {
        App.getModal('newIncome').open();
      }

      if (createExpenseButton && accounts !== 0) {
        App.getModal('newExpense').open();
      }
    })
  }
}
