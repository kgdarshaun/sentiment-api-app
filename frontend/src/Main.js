import React from 'react';
import axios from 'axios';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      sentiment: ''
    };
  }

  handleInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  handleButtonClick = () => {
    axios.post('https://sentiment-backend-yyaheowsja-uw.a.run.app/sentiment', {
      text: this.state.input
    })
    .then(response => {
      this.setState({ sentiment: response.data.sentiment })
    })
    .catch(error => {
      console.error(error);
    });
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.input} onChange={this.handleInputChange} />
        <button onClick={this.handleButtonClick}>get sentiment</button>
        <button onClick={()=> this.setState({input:''})}>clear</button>
        <div>{this.state.sentiment}</div>
      </div>
    );
  }
}

export default Main;
