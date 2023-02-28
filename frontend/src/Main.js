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
import CircularProgress from '@mui/material/CircularProgress';

const sentiment_endpoint = 'http://localhost:8081/sentiment';
const subjectivity_endpoint = 'http://localhost:8082/subjectivity';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      sentiment: '',
      subjectivity: 0.00,
      color: 'primary',
      loading: false,
      empty: true,
    };
  }

  handleInputChange = (event) => {
    if(event.target.value.length === 0){
      this.setState({ empty: true })
      this.setState({ input: ''})
      this.setState({ sentiment: '' })
      this.setState({ subjectivity: 0.00 })
      this.setState({ color: 'primary' })
    } else {
      this.setState({ empty: false })
    }
    this.setState({ input: event.target.value });
  }

  handleClearClick = () => {
    this.setState({ input: ''})
    this.setState({ sentiment: '' })
    this.setState({ subjectivity: 0.00 })
    this.setState({ color: 'primary' })
    this.setState({ empty: true })
  }

  handleSentimentClick = () => {
    this.setState({ loading: true })
    let input_value = this.state.input
    axios.post(sentiment_endpoint, {
      text: input_value
    })
    .then(response => {
      let sentiment_score = response.data.sentiment_score
      if(sentiment_score === 0){
        this.setState({ sentiment: 'NEUTRAL' })
        this.setState({ color: 'success' })
      } else if(sentiment_score > 0){
        this.setState({ sentiment: 'POSITIVE' })
        this.setState({ color: 'success' })
      } else {
        this.setState({ sentiment: 'NEGATIVE' })
        this.setState({ color: 'error' })
      }
    })
    .catch(error => {
      console.error(error);
    });
    axios.post(subjectivity_endpoint, {
      text: input_value
    })
    .then(response => {
      console.log(response.data.subjectivity)
      this.setState({ subjectivity: response.data.subjectivity })
    })
    .catch(error => {
      console.error(error);
    });
    this.setState({ loading: false })
  }

  render() {
    return (
        <Container component="main" maxWidth="xs">
          <Card 
            sx={{ 
              minWidth: 275,
              marginTop: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <CardContent>
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                id="outlined-multiline-flexible"
                label="Text"
                autoFocus
                value={this.state.input} 
                onChange={this.handleInputChange}
              />
              <LoadingButton
                fullWidth
                loading={this.state.loading}
                variant="contained"
                sx={{ marginTop: 3, marginBottom: 2 }}
                onClick={this.handleSentimentClick}
                disabled={this.state.empty}
              >
                compute
              </LoadingButton>
              <Button
                fullWidth
                variant="outlined"
                sx={{ marginTop: 2, marginBottom: 2 }}
                onClick={this.handleClearClick}
                disabled={this.state.empty}
              >
                clear
              </Button>
              <Button 
                fullWidth 
                variant="text" 
                color={this.state.color}
                onClick={() => {navigator.clipboard.writeText(this.state.sentiment)}}
              >
                sentiment : {this.state.sentiment}
              </Button>
              <Button 
                fullWidth 
                variant="text"
                onClick={() => {navigator.clipboard.writeText(this.state.subjectivity)}}
              >
                subjectivity :
                <Box sx={{ flexGrow: 0.1 }} />    
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={this.state.subjectivity} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="caption"
                    component="div"
                    color="primary"
                  >{`${Math.round(this.state.subjectivity)}%`}</Typography>
                </Box>
              </Box>
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }
}

export default Main;
