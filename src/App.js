import './App.css';
import React, { Component } from 'react'

class App extends Component {

  state = {
    books: [],
    image: 'default.png',
    loading: 'loading.gif',
    query: '',
    limit: 10,
    offset: 0,
    minChars: 3,
    searching: false
  }

  getBooksInfo() {
    const { query } = this.state;
    fetch(process.env.REACT_APP_BOOKS_ENDPOINT, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      mode: 'cors',
      body: JSON.stringify({
        query
      })
     })
    .then(res => res.json())
    .then((data) => {
      this.setState({ 
        books: data,
        searching: false
      })
    })
    .catch(console.log);
  }

  getLIst() {
    const { books, offset, limit } = this.state;
    // Show only the books obtained by our internal pagination
    const booksToShow = books.slice(offset, offset + limit);
    const list = booksToShow.map((book, index) => {
      const authors = book.authors ? book.authors.join(', ') : '';
      return (
        <li key={index}>
          <strong>{book.title}</strong>. Authors: {authors}
        </li>
      )
    })
    return list;
  }

  onSearchChange = e => {
    const that = this;
    that.setState({
      query: e.target.value,
      searching: true
    }, () => {
      if (that.state.query.length > this.state.minChars) {
        that.getBooksInfo(that.state.query);
      }
    });
  };

  renderResults() {
    const list = this.getLIst();
    return (
      <React.Fragment>
        <div className="book-list" style={{ fontSize: '12px', marginTop: '14px' }}>
          <ul style={{ padding: 0, textAlign: 'left' }}>
            {list}
          </ul>
        </div>
      </React.Fragment>
    )
  }
  // This is my artificial pagination
  renderPagination() {
    const { limit, books } = this.state;
    const totalPages = Math.ceil(books.length / limit);
    const list = [];
    for (let i = 0; i < totalPages; i++) {
      list.push(
        <li key={i}>
          <span
            onClick={() => this.setState({ offset: i * limit })} 
            style={{ paddingLeft: '12px', cursor: 'pointer'}}
          >
            {i + 1}
          </span>
        </li>
      )
    }
    return (
      <ul className="pagination">
        {list}
      </ul>
    )
  }

  render() {
    let finalImg = '';
    let finalLoading = '';
    const { books, image, query, minChars, loading, searching } = this.state;
    if (image === 'default.png') {
      finalImg = `img/${image}`;
      finalLoading = `img/${loading}`;
    }
    const minCharsText = `Title (more than 3 characters)`;
    return (
      <div className="App">
        <header className="App-header">
          <img src={finalImg} className="App-logo" alt="logo" style={{ width: '110px', height: 'auto' }} />
          <h6>
            Google Books Search
          </h6>
          <input
            name="query_box"
            type="text"
            placeholder={minCharsText}
            style={{ fontSize: '16px', borderRadius: '5px', width: '250px'}}
            onChange={(e) => this.onSearchChange(e)}
            value={query}
          />
          {
            searching ?
            <img src={finalLoading} alt="loading" style={{ width: '90px', height: 'auto', opacity: 0.7, marginTop: '12px' }} />
            :
            ''
          }
          { (books.length > 0) ?
          this.renderResults()
          :
          <small>
            No results
          </small>
          }
          { (books.length > 10) ? this.renderPagination() : '' }
        </header>
        
      </div>
    );
  }
}


export default App;
