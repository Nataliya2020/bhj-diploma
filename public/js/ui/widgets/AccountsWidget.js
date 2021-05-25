/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element) {
    if (element === null || element === undefined || !element) {
      throw new Error("Данных нет");
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const newAccount = this.element.querySelector('.create-account');

    newAccount.addEventListener('click', this.createNewAccount);

    this.element.addEventListener('click', (event) => this.onSelectAccount(event));
  }

  createNewAccount(event) {
    App.getModal('createAccount').open();
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response && response.success) {
          if (response.data) {
            this.clear();
            for (let item of response.data) {
              this.renderItem(item);
            }
          }
        }
      })
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    let account = [...this.element.querySelectorAll('.account')];

    for (let item of account) {
      item.remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(event) {
    let account = [...this.element.querySelectorAll('.account')];
    if ((event.target.tagName === 'SPAN' && event.target.closest('.account') && !event.target.closest('.active')) || (event.target.tagName === 'A' && event.target.closest('.account') && !event.target.closest('.active'))) {
      for (let item of account) {
        item.classList.remove('active');
      }
      event.target.closest('.account').classList.add('active');
      App.showPage('transactions', {account_id: event.target.closest('.account').dataset.id});
    }
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    let html = `
    <li class="account" data-id="${item.id}">
      <a href="#">
        <span>${item.name} / </span>
        <span>${item.sum}</span>
      </a>
    </li>`;
    return html;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(item) {
    this.element.insertAdjacentHTML('beforeEnd', this.getAccountHTML(item));
  }
}
