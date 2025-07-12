import React, { Component } from 'react'
import {ResistrationForm,OCRReader} from '../components/index.js' // Adjust the import path as necessary

export class RegistrationPage extends Component {
  render() {
    return (
      <div>
        <h1>Registration Page</h1>
        <p>Welcome to the Tedx DYPIT Portal</p>
        <p>Submit your payment details below:</p>
        <ResistrationForm />
        <OCRReader />
        <p>Note: This is a demo portal, please do not submit real payment details</p>
        <p>Thank you for your interest in Tedx DYPIT!</p>
      </div>
    )
  }
}

export default RegistrationPage