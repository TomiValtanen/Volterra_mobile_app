import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Register from './Register';

describe('Register Component', () => {
  it('should display error messages for empty email field', async () => {
    const { getByPlaceholderText, getByText } = render(<Register />);

    const nameInput = getByPlaceholderText('Name*');
    const phoneInput = getByPlaceholderText('Phone*');
    const emailInput = getByPlaceholderText('Email*');
    const passwordInput = getByPlaceholderText('Password*');
    const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
    const registerButton = getByText('REGISTER');

    
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(phoneInput, '1234567890');
    fireEvent.changeText(emailInput, '');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.changeText(repeatPasswordInput, 'password');

  
    fireEvent.press(registerButton);

    
    await waitFor(() => {
      
      expect(getByText('Email is required!')).toBeTruthy();
    });
    });

    it('should display error messages for empty password field', async () => {
      const { getByPlaceholderText, getByText } = render(<Register />);
  
      const nameInput = getByPlaceholderText('Name*');
      const phoneInput = getByPlaceholderText('Phone*');
      const emailInput = getByPlaceholderText('Email*');
      const passwordInput = getByPlaceholderText('Password*');
      const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
      const registerButton = getByText('REGISTER');
  
      
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '1234567890');
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, '');
      fireEvent.changeText(repeatPasswordInput, 'password');
  
    
      fireEvent.press(registerButton);
  
      
      await waitFor(() => {
        
        expect(getByText('Password is required!')).toBeTruthy();
    });
    });

    it('should display error messages for confirm password field', async () => {
      const { getByPlaceholderText, getByText } = render(<Register />);
    
      const nameInput = getByPlaceholderText('Name*');
      const phoneInput = getByPlaceholderText('Phone*');
      const emailInput = getByPlaceholderText('Email*');
      const passwordInput = getByPlaceholderText('Password*');
      const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
      const registerButton = getByText('REGISTER');
    
        
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '1234567890');
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.changeText(repeatPasswordInput, '');
    
      
      fireEvent.press(registerButton);
    
        
      await waitFor(() => {
          
        expect(getByText('Confirm password is required!')).toBeTruthy();
      });
    });

    it('should display error messages for confirm password field', async () => {
      const { getByPlaceholderText, getByText } = render(<Register />);
    
      const nameInput = getByPlaceholderText('Name*');
      const phoneInput = getByPlaceholderText('Phone*');
      const emailInput = getByPlaceholderText('Email*');
      const passwordInput = getByPlaceholderText('Password*');
      const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
      const registerButton = getByText('REGISTER');
    
        
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '1234567890');
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.changeText(repeatPasswordInput, 'pwd');
    
      
      fireEvent.press(registerButton);
    
        
      await waitFor(() => {
          
        expect(getByText('Password do not match!')).toBeTruthy();
      });
    });

    it('should display error messages for name field', async () => {
      const { getByPlaceholderText, getByText } = render(<Register />);
    
      const nameInput = getByPlaceholderText('Name*');
      const phoneInput = getByPlaceholderText('Phone*');
      const emailInput = getByPlaceholderText('Email*');
      const passwordInput = getByPlaceholderText('Password*');
      const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
      const registerButton = getByText('REGISTER');
    
        
      fireEvent.changeText(nameInput, '');
      fireEvent.changeText(phoneInput, '1234567890');
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.changeText(repeatPasswordInput, 'password');
    
      
      fireEvent.press(registerButton);
    
        
      await waitFor(() => {
          
        expect(getByText('Name is required!')).toBeTruthy();
      });
    });

    it('should display error messages for phone number field', async () => {
      const { getByPlaceholderText, getByText } = render(<Register />);
    
      const nameInput = getByPlaceholderText('Name*');
      const phoneInput = getByPlaceholderText('Phone*');
      const emailInput = getByPlaceholderText('Email*');
      const passwordInput = getByPlaceholderText('Password*');
      const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
      const registerButton = getByText('REGISTER');
    
        
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '');
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.changeText(repeatPasswordInput, 'password');
    
      
      fireEvent.press(registerButton);
    
        
      await waitFor(() => {
          
        expect(getByText('Phone number is required!')).toBeTruthy();
      });
    });

    it('should display error messages for car picker field', async () => {
      const { getByPlaceholderText, getByText, getByLabelText } = render(<Register />);
    
      const nameInput = getByPlaceholderText('Name*');
      const phoneInput = getByPlaceholderText('Phone*');
      const emailInput = getByPlaceholderText('Email*');
      const passwordInput = getByPlaceholderText('Password*');
      const repeatPasswordInput = getByPlaceholderText('Repeat Password*');
      const registerButton = getByText('REGISTER');
    
        
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.changeText(phoneInput, '123456789');
      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'password');
      fireEvent.changeText(repeatPasswordInput, 'password');
            
      fireEvent.press(registerButton);
      
      await waitFor(() => {
          
        expect(getByText('Choose your car model!')).toBeTruthy();
      });
    });
  });