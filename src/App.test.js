import { render, shallow, fireEvent } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom/extend-expect'
import nock from 'nock';

// Simple test to check if the App component work correctly
describe('Simple test for Gbooks serach page', () => {
  
  it('Test for input', () => {
    const setSearch = jest.fn((value) => {})
    const { queryByPlaceholderText } = render(<App onSearchChange={setSearch}/>)
    const searchInput = queryByPlaceholderText('Title (more than 3 characters)')
    fireEvent.change(searchInput, { target: { value: 'Cooking' } })
    expect(searchInput.value).toBe('Cooking')
  });

  it('Test for endpoint', async () => {
    var options = {
      headers: {
          'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: 'Harry Potter'
      })
    };
    nock(process.env.REACT_APP_BOOKS_ENDPOINT, options)
    .post('/gbooks', { id: '123' })
    .reply(200, { status: 'OK' });
  });
});