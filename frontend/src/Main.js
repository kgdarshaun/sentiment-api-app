import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      sentiment: '',
      loading: false,
      empty: true
    };
  }

  handleInputChange = (event) => {
    if(event.target.value.length === 0){
      this.setState({ empty: true })
    } else {
      this.setState({ empty: false })
    }
    this.setState({ input: event.target.value });
  }

  handleClearClick = () => {
    this.setState({ input: ''})
    this.setState({ sentiment: '' })
    this.setState({ empty: true })
  }

  handleSentimentClick = () => {
    this.setState({ loading: true })
    if(this.state.input.length === 0) {
      
    }
    axios.post('http://localhost:8080/sentiment', {
      text: this.state.input
    })
    .then(response => {
      this.setState({ sentiment: response.data.sentiment })
    })
    .catch(error => {
      console.error(error);
    });
    this.setState({ loading: false })
  }

  render() {
    return (
        <Container component="main" maxWidth="xs">
          <br/>
          <br/>
          <Typography component="h4" variant="h5">
            SENTIMENT
          </Typography>
          <br/>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card sx={{ minWidth: 275 }}>
          <CardContent>
        {/* <input type="text" value={this.state.input} onChange={this.handleInputChange} /> */}
        <TextField
              margin="normal"
              required
              fullWidth
              id="text"
              label="Text"
              name="text"
              autoFocus
              value={this.state.input} 
              onChange={this.handleInputChange}
            />
            <LoadingButton
              fullWidth
              loading={this.state.loading}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.handleSentimentClick}
              disabled={this.state.empty}
            >
              compute
            </LoadingButton>
            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
              onClick={this.handleClearClick}
              disabled={this.state.empty}
            >
              clear
            </Button>
        {/* <button onClick={this.handleSentimentClick}>get sentiment</button>
        <button onClick={this.handleClearClick}>clear</button> */}
        <div id='label'>{this.state.sentiment}</div>
        </CardContent>
        </Card>
        </Box>
        </Container>
    );
  }
}

export default Main;
