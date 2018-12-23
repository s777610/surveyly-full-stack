import _ from "lodash";
import React, { Component } from "react";

import { reduxForm, Field } from "redux-form";
import { Link } from "react-router-dom";
import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmail";
import formFields from "./formFields";

// SurveyForm shows a form for a user to add input
class SurveyForm extends Component {
  renderFields() {
    return _.map(formFields, ({ label, name }) => {
      return (
        <Field
          key={name}
          component={SurveyField}
          type="text"
          label={label}
          name={name}
        />
      );
    });
  }
  render() {
    return (
      // as soon as we start typing on our keyboard reduxForm is
      // going to take the value and store it inside to redux store
      // under a key of surveyTitle
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

// values is obj from form
function validate(values) {
  const errors = {};
  errors.recipients = validateEmails(values.recipients || "");
  _.each(formFields, ({ name }) => {
    if (!values[name]) {
      // if that form is blank
      errors[name] = "You must provide a value";
    }
  });
  // reduxForm automatically matches up errors to the different fields you're rendering.
  return errors; // errors is obj
}

// reduxForm allows SurveyForm to communicate with the redux store
// by add some props, such as handleSubmit()
export default reduxForm({
  validate,
  form: "surveyForm",
  destroyOnUnmount: false // allow us to keep form value when unmount
})(SurveyForm);
