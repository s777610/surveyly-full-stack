// SurveyField contains logic to render a single label and input
import React from "react";

// get props from reduxForm
// { input } => automatically looks onto the props object pulls off the input property and assigns it to a variable called input.
export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: "5px" }} />
      <div className="red-text" style={{ marginBottom: "20px" }}>
        {touched && error}
      </div>
    </div>
  );
};
