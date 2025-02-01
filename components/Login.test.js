/* import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login';

test('Login with wrong credentials', async (t) => {
  const { getByPlaceholderText, getByText } = render(<Login />);

  const emailInput = getByPlaceholderText('Enter your email*');
  const passwordInput = getByPlaceholderText('Enter your password*');

  // Enter wrong credentials
  fireEvent.changeText(emailInput, 'wrong@example.com');
  fireEvent.changeText(passwordInput, 'wrongpassword');

  // Trigger login
  fireEvent.press(getByText('LOGIN'));

  // Wait for the alert to appear
  await waitFor(() => {
    t.truthy(getByText('Login failed!'));
  });
});

test('Login with empty password field', async (t) => {
  const { getByPlaceholderText, getByText } = render(<Login />);

  const emailInput = getByPlaceholderText('Enter your email*');
  const passwordInput = getByPlaceholderText('Enter your password*');

  // Enter valid email with empty password
  fireEvent.changeText(emailInput, 'valid@example.com');
  fireEvent.changeText(passwordInput, '');

  // Trigger login
  fireEvent.press(getByText('LOGIN'));

  // Wait for the alert to appear
  await waitFor(() => {
    t.truthy(getByText('Password is required!'));
  });
}); */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from './Login'; 

describe('Login Component', () => {
  it('should show an alert for empty password', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Enter your email*'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password*'), '');
    
    fireEvent.press(getByText('LOG IN'));
    
    await waitFor(() => {
      expect(getByText('Password is required!')).toBeTruthy();
    });
  });

  it('should show an alert for empty email ', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    fireEvent.changeText(getByPlaceholderText('Enter your email*'), '');
    fireEvent.changeText(getByPlaceholderText('Enter your password*'), 'wrongpassword');

    fireEvent.press(getByText('LOG IN'));
    
    await waitFor(() => {
      expect(getByText('Email is required!')).toBeTruthy();
    });
  });


  it('should show an alert for wrong credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    fireEvent.changeText(getByPlaceholderText('Enter your email*'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Enter your password*'), 'wrongpassword');
    
    fireEvent.press(getByText('LOG IN'));
    
    await waitFor(() => {
      expect(getByText('Login failed!')).toBeTruthy();
    });
  });
});

