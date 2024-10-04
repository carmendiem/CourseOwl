describe('Signup Page', () => {
    it('should display error message if name is empty', () => {
      cy.visit('http://localhost:3000/signup'); // change URL to your app's signup page
  
      cy.get('button').contains('SignUp').click();
      cy.contains('Name cannot be empty').should('be.visible');
    });
  
    it('should display error message if email is empty', () => {
      cy.visit('http://localhost:3000/signup');
  
      cy.get('input[name="name"]').type('John Doe');
      cy.get('button').contains('SignUp').click();
      cy.contains('Email cannot be empty').should('be.visible');
    });

    it('should deny access to homepage without signup', () => {
        cy.visit('http://localhost:3000/home');
    
        cy.url().should('include', '/login');
    });

    it('should display error message if password is missing uppercase', () => {
        cy.visit('http://localhost:3000/signup');
    
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        cy.get('input[name="password"]').type('password1!'); // No uppercase, no special character, etc.
        cy.get('button').contains('SignUp').click();
    
        // Expect error message regarding password security standards
        cy.contains('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.').should('be.visible');
    });

    it('should display error message if password is missing number', () => {
        cy.visit('http://localhost:3000/signup');
    
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        cy.get('input[name="password"]').type('Password!'); // No uppercase, no special character, etc.
        cy.get('button').contains('SignUp').click();
    
        // Expect error message regarding password security standards
        cy.contains('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.').should('be.visible');
    });

    it('should display error message if password is missing special character', () => {
        cy.visit('http://localhost:3000/signup');
    
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        cy.get('input[name="password"]').type('Password1'); // No uppercase, no special character, etc.
        cy.get('button').contains('SignUp').click();
    
        // Expect error message regarding password security standards
        cy.contains('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.').should('be.visible');
    });

    it('should display error message if password length not sufficient', () => {
        cy.visit('http://localhost:3000/signup');
    
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        cy.get('input[name="password"]').type('Pp1!'); // No uppercase, no special character, etc.
        cy.get('button').contains('SignUp').click();
    
        // Expect error message regarding password security standards
        cy.contains('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.').should('be.visible');
    });

    it('should display error message if password is empty', () => {
        cy.visit('http://localhost:3000/signup');
    
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        // Leave password empty
        cy.get('button').contains('SignUp').click();
    
        // Expect error message regarding empty password
        cy.contains('Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.').should('be.visible');
    });
  
    it('should display error if email already exists', () => {
        cy.visit('http://localhost:3000/signup');
      
        // Fill out the signup form
        cy.get('input[name="name"]').type('Test');
        cy.get('input[name="email"]').type('test@example.com');
        cy.get('input[name="password"]').type('Password123!');
      
        // Submit the signup form
        cy.get('button').contains('SignUp').click();
      
        // Check if the user is still on the signup page by verifying the URL
        cy.url().should('not.include', '/home');
        
        // Optionally, you can check if the URL still includes '/signup' to make sure they didn't leave the signup page
        cy.url().should('include', '/signup');
    });

    it('should create account with correct details', () => {
        cy.visit('http://localhost:3000/signup');
    
        cy.get('input[name="name"]').type('John Doe');
        cy.get('input[name="email"]').type('john@example.com');
        cy.get('input[name="password"]').type('Password123!');
        cy.get('button').contains('SignUp').click();
    
        // After successful signup, redirect to homepage
        cy.url().should('include', '/home'); // assuming user is redirected to /home
      });
    
  });
  