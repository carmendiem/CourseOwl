describe('Login Page', () => {
    it('should display error message if email is empty', () => {
      cy.visit('http://localhost:3000/login'); // change URL to your app's login page
  
      cy.get('button').contains('Login').click(); // click on the login button
      cy.contains('Email cannot be empty').should('be.visible'); // check if the error is visible
    });
  
    it('should display error message if password is empty', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[name="email"]').type('test@example.com'); // fill in email
      cy.get('button').contains('Login').click();
      cy.contains('Password cannot be empty').should('be.visible');
    });

    it('should display error message with incorrect password', () => {
        cy.visit('http://localhost:3000/login');
    
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('Password!');
        cy.get('button').contains('Login').click();
        cy.contains('Invalid email or password. Please try again.').should('be.visible');
    });

    it('should display error message with incorrect email', () => {
        cy.visit('http://localhost:3000/login');
    
        cy.get('input[name="email"]').type('test3333@example.com');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('button').contains('Login').click();
        cy.contains('Invalid email or password. Please try again.').should('be.visible');
    });

    it('should deny access to homepage without login', () => {
        cy.visit('http://localhost:3000/home');
    
        cy.url().should('include', '/login');
    });
  
    it('should log in with correct credentials', () => {
      cy.visit('http://localhost:3000/login');
  
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('Password123!');
      cy.get('button').contains('Login').click();
  
      // After successful login, redirect to homepage
      cy.url().should('include', '/home'); // assuming user is redirected to /home
    });
  });
  