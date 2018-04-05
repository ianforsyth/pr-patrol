import React from 'react'
import Pete from 'pete.svg'

class LandingPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className='home'>
        <h1 className='title'>PR Patrol</h1>
        <h2 className='subtitle'>Monitor code that matters to you</h2>
        <div className='logo'>
          <img className='logo-img' src={Pete}></img>
          <div className='logo-shadow'></div>
        </div>
        <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_APP_CLIENT_ID}`}>
          <button className='button button--shine -size-lg'>
            <span className="fab fa-github buttonIcon"></span>
            <span>Sign In With Github</span>
          </button>
        </a>
        <div className='steps'>
          <div className='steps-bg'></div>
          <h3 className='steps-title'>Here's how it works</h3>
          <div className='step'>
            <h4 className='step-title'>1. Install the GitHub App</h4>
            <div className='fas fa-cloud-download-alt step-icon'></div>
            <p className='step-description'>
              Head over to the
              <a className='link' href='https://github.com/apps/pr-patrol' target='_blank'> GitHub marketplace </a>
              and install the PR Patrol app
            </p>
          </div>
          <div className='step'>
            <h4 className='step-title'>2. Set up patrols</h4>
            <div className='fas fa-tasks step-icon'></div>
            <p className='step-description'>Choose the repos you want to patrol and the files you want alerts for</p>
          </div>
          <div className='step'>
            <h4 className='step-title'>3. Get alerts</h4>
            <div className='fas fa-bullhorn step-icon'></div>
            <p className='step-description'>
              <span>We send a </span>
              <a href='https://slack.com/apps/A9NJ21CK0-pr-patrol' className='link'>Slack</a>
              <span> or email when a PR opens and your files are in the diff</span>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default LandingPage
