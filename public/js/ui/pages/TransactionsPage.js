/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */

class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (!element) {
      throw new Error("Данных нет");
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (event) => {
      event.preventDefault();
      let account = [...document.querySelectorAll('.account')].length;
      if (event.target.closest('.remove-account') && User.current() && account !== 0 && document.querySelector('.content-title').dataset.id !== undefined) {
        this.removeAccount();
      }

      if (event.target.closest('.transaction__remove')) {
        let dataButton = event.target.closest('.transaction__remove').getAttribute('data-id');
        this.removeTransaction(dataButton);
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {

    if (!this.lastOptions) {
      return;
    }

    if (confirm('Счет будет удален. Вы дейсвительно хотите удалить счет?')) {
      let id = document.querySelector('.content-title').dataset.id;
      let data = {id};

      Account.remove(data, (err, response) => {
        if (response.success) {
          this.clear();
          document.querySelector('.content-title').removeAttribute('data-id');
          App.update(); //App.updateWidgets() не обновляет селект в формах дохода и расхода.
        }
      });
    } else {
      App.updatePages();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    let data = {id};

    if (confirm('Транзакция будет удалена. Вы дейсвительно хотите удалить транзакцию?')) {
      Transaction.remove(data, (err, response) => {
        if (response.success) {
          App.update();
        }
      });
    } else {
      App.updatePages();
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (!options) {
      return;
    }

    this.lastOptions = options;
    Account.get(options, options.account_id, (err, response) => {
      if (response.success) {
        this.renderTitle(response.data.name, options.account_id);
      }
    });

    Transaction.list(options, (err, response) => {
      if (response && response.success) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    let contentTitle = document.querySelector('.content-title');
    contentTitle.textContent = 'Название счета';
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name, id) {
    if (!name) {
      this.clear();
    } else {
      let contentTitle = document.querySelector('.content-title');
      contentTitle.textContent = name;
      contentTitle.dataset.id = id;
    }
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    let DateTime = new Date(date);
    let transactionDate = DateTime.toLocaleString();
    let transactionTime = DateTime.toLocaleDateString();

    return `${transactionDate} в ${transactionTime}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction_${item.type.toLowerCase()} row"> 
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
          <!-- дата -->
          <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
          <!--  сумма -->
          ${item.sum}<span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
        <!-- в data-id нужно поместить id -->
        <button class="btn btn-danger transaction__remove" data-id="${item.id}">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const content = document.querySelector('.content');
    content.innerHTML = '';
    const modal = document.querySelector('.content-header');
    let paragraph = modal.querySelector('p');
    if (paragraph) {
      paragraph.remove();
    }
    for (let item of data) {
      content.insertAdjacentHTML('afterbegin', this.getTransactionHTML(item));
    }
  }
}
