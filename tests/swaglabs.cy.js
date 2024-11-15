describe('Тестирование Swag Labs', () => {
  
  const baseUrl = 'https://www.saucedemo.com';
  const credentials = {
    username: 'standard_user',
    password: 'secret_sauce'
  };

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('Авторизация пользователя через форму логина', () => {
    cy.get('#user-name')
      .type(credentials.username)
      .should('have.value', credentials.username);

    cy.get('#password')
      .type(credentials.password)
      .should('have.value', credentials.password);

    cy.get('#login-button').click();

    cy.url().should('eq', `${baseUrl}/inventory.html`);
  });

  it('Сортировка товаров по цене и проверка порядка сортировки', () => {
    cy.get('#user-name').type(credentials.username);
    cy.get('#password').type(credentials.password);
    cy.get('#login-button').click();
    cy.url().should('eq', `${baseUrl}/inventory.html`);

    const verifySortOrder = (order) => {
      cy.get('.product_sort_container').select(order);
      
      const prices = [];
      cy.get('.inventory_item_price').each(($el) => {
        const price = parseFloat($el.text().replace('$', ''));
        prices.push(price);
      }).then(() => {
        const sortedPrices = [...prices];
        if (order === 'lohi') {
          sortedPrices.sort((a, b) => a - b);
        } else if (order === 'hilo') {
          sortedPrices.sort((a, b) => b - a);
        }
        expect(prices).to.deep.equal(sortedPrices);
      });
    };

    verifySortOrder('lohi');

    verifySortOrder('hilo');
  });

  it('Добавление двух товаров в корзину и оформление заказа', () => {
    cy.get('#user-name').type(credentials.username);
    cy.get('#password').type(credentials.password);
    cy.get('#login-button').click();
    cy.url().should('eq', `${baseUrl}/inventory.html`);

    cy.get('.inventory_item')
      .first()
      .within(() => {
        cy.get('button').click();
      });

    cy.get('.inventory_item')
      .eq(1)
      .within(() => {
        cy.get('button').click();
      });

    cy.get('.shopping_cart_link').click();
    cy.url().should('eq', `${baseUrl}/cart.html`);

    cy.get('.cart_item').should('have.length', 2);

    cy.get('[data-test="checkout"]').click();
    cy.url().should('eq', `${baseUrl}/checkout-step-one.html`);

    const orderInfo = {
      firstName: 'Тест',
      lastName: 'Тест',
      postalCode: '1234567890'
    };

    cy.get('[data-test="firstName"]')
      .type(orderInfo.firstName)
      .should('have.value', orderInfo.firstName);

    cy.get('[data-test="lastName"]')
      .type(orderInfo.lastName)
      .should('have.value', orderInfo.lastName);

    cy.get('[data-test="postalCode"]')
      .type(orderInfo.postalCode)
      .should('have.value', orderInfo.postalCode);

    cy.get('[data-test="continue"]').click();
    cy.url().should('eq', `${baseUrl}/checkout-step-two.html`);

    cy.get('[data-test="finish"]').click();
    cy.url().should('eq', `${baseUrl}/checkout-complete.html`);

    cy.get('[data-test="back-to-products"]').click();
    cy.url().should('eq', `${baseUrl}/inventory.html`);
  });

});
