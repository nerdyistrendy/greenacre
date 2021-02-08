import React from "react";
import { render } from "react-dom";
import { useForm } from "react-cool-form";

import "./AddToListForm.css";
import "./styles.scss";

const Field = ({ label, id, ...rest }) => (
  <>
    <input id={id} {...rest} />
    <label htmlFor={id}>{label}</label>
  </>
);

const AddToListForm = (props) => {
  const { form } = useForm({
    defaultValues: { fruit: "🍎" },
    onSubmit: (values) => alert(JSON.stringify(values, undefined, 2)),
  });

  return (
    <form ref={form}>
      <fieldset ref={form} >
        <legend>Add to List</legend>
        {props.currentUserLists.map(function (list, index) {
            return (
              <Field
                key={index}
                label={list}
                id={list}
                name={list}
                value={list}
                type="radio"
              />
            );
          })}
      </fieldset>
      <input type="submit" />
    </form>
  );
};

export default AddToListForm;
