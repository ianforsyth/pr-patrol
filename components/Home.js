import React from 'react'
import axios from 'axios'
import queryString from 'query-string'
import cookie from 'react-cookies'

class Home extends React.Component {
  constructor(props) {
    super(props)
  }


  componentWillMount() {
    let params = queryString.parse(this.props.location.search)
    if(params.code) {
      this.retrieveAuthToken(params.code)
    }
  }

  retrieveAuthToken(code) {
    console.log(code)
    axios.post(`${process.env.API_URL}/user`, {
      code: code,
    }).then((response) => {
      console.log(response)
    }).catch((response) => {
      console.log(response)
    })
  }

  render() {
    return (
      <div>
        <h1>Hello World</h1>
        <a href='https://github.com/login/oauth/authorize?client_id=267ab42d303e50fe6eca&scope=write:repo'>Login with github</a>
      </div>
    )
  }
}

export default Home
