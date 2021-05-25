/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-mini');
    sidebarToggle.addEventListener('click', this.toggleShowSidebar);
  }

  static toggleShowSidebar(event) {
    const bodyTarget = event.currentTarget;
    if (!event.target.classList.contains('sidebar-toggle')) {
      return;
    }
    if (!bodyTarget.classList.contains('sidebar-open')) {
      bodyTarget.classList.remove('sidebar-collapse');
      bodyTarget.classList.add('sidebar-open');
    } else {
      bodyTarget.classList.remove('sidebar-open');
      bodyTarget.classList.add('sidebar-collapse');
    }
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const sideBarLink = [...document.querySelectorAll('.sidebar-menu .menu-item')];

    for (let child of sideBarLink) {
      child.addEventListener('click', this.showModal);
    }
  }

  static showModal(event) {
    event.preventDefault();
    if (event.target.tagName !== 'SPAN') {
      return;
    }

    if (event.target.closest('.menu-item_login')) {
      App.getModal('login').open();
    }

    if (event.target.closest('.menu-item_register')) {
      App.getModal('register').open();
    }

    if (event.target.closest('.menu-item_logout')) {
      let userName = document.querySelector('.user-panel .info .user-name');
      let data = {
        name: userName
      }

      User.logout(data, (err, response) => {
        if (response.success) {
          App.setState('init');
        }
      });
    }
  }
}
