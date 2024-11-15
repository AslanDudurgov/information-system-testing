describe('Тестирование сайта OpenVPN', () => {
  // Посещение главной страницы перед каждым тестом
  beforeEach(() => {
    cy.visit('https://openvpn.net/');
  });

  // 1. Проверка доступности главной страницы и основных элементов навигации
  describe('Главная страница и навигация', () => {
    it('Должна отображать логотип и основные элементы навигации', () => {
      cy.get('header').within(() => {
        cy.get('img[alt="OpenVPN Logo"]').should('be.visible');
        cy.contains('Products').should('be.visible');
        cy.contains('Solutions').should('be.visible');
        cy.contains('Resources').should('be.visible');
        cy.contains('Partners').should('be.visible');
      });
    });

    it('Переход по ссылкам навигации должен работать корректно', () => {
      cy.contains('Products').click();
      cy.url().should('include', '/products');
      cy.go('back');

      cy.contains('Solutions').click();
      cy.url().should('include', '/solutions');
      cy.go('back');

      cy.contains('Resources').click();
      cy.url().should('include', '/resources');
      cy.go('back');

      cy.contains('Partners').click();
      cy.url().should('include', '/partners');
      cy.go('back');
    });
  });

  // 2. Проверка формы запроса демонстрации
  describe('Форма запроса демонстрации', () => {
    it('Должна успешно отправлять форму с корректными данными', () => {
      cy.contains('Request a Demo').click();
      cy.url().should('include', '/request-a-demo');

      cy.get('form').within(() => {
        cy.get('input[name="first_name"]').type('Иван');
        cy.get('input[name="last_name"]').type('Иванов');
        cy.get('input[name="email"]').type('ivan.ivanov@example.com');
        cy.get('input[name="company"]').type('ООО Пример');
        cy.get('input[name="phone"]').type('+37112345678');
        cy.get('select[name="country"]').select('Latvia');
        cy.get('textarea[name="message"]').type('Хотел бы узнать больше о ваших продуктах.');
        cy.get('button[type="submit"]').click();
      });

      cy.contains('Thank you for your request').should('be.visible');
    });
  });

  // 3. Проверка страницы входа в систему
  describe('Страница входа', () => {
    it('Должна отображать форму входа и реагировать на некорректные данные', () => {
      cy.contains('Log In').click();
      cy.url().should('include', '/login');

      cy.get('form').within(() => {
        cy.get('input[name="username"]').type('неверный_пользователь');
        cy.get('input[name="password"]').type('неверный_пароль');
        cy.get('button[type="submit"]').click();
      });

      cy.contains('Invalid username or password').should('be.visible');
    });
  });

  // 4. Проверка страницы загрузок
  describe('Страница загрузок', () => {
    it('Должна отображать доступные загрузки для различных платформ', () => {
      cy.contains('Downloads').click();
      cy.url().should('include', '/downloads');

      cy.contains('Windows').should('be.visible');
      cy.contains('macOS').should('be.visible');
      cy.contains('Linux').should('be.visible');
      cy.contains('Android').should('be.visible');
      cy.contains('iOS').should('be.visible');
    });
  });

  // 5. Проверка страницы документации
  describe('Страница документации', () => {
    it('Должна отображать разделы документации и позволять переходить к статьям', () => {
      cy.contains('Resources').click();
      cy.contains('Documentation').click();
      cy.url().should('include', '/resources/documentation');

      cy.contains('Getting Started').should('be.visible');
      cy.contains('User Manuals').should('be.visible');
      cy.contains('FAQs').should('be.visible');

      cy.contains('Getting Started').click();
      cy.url().should('include', '/resources/documentation/getting-started');
      cy.contains('Introduction to OpenVPN').should('be.visible');
    });
  });
});
