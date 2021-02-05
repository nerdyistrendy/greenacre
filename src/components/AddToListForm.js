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
    onSubmit: (values) => alert(JSON.stringify(values, undefined, 2))
  });

  return (
    <form ref={form}>
      <fieldset>
        <legend>Fruit</legend>
        <Field label="🍎" id="apple" name="fruit" value="🍎" type="radio" />
        <Field label="🍋" id="lemon" name="fruit" value="🍋" type="radio" />
        <Field label="🥝" id="kiwi" name="fruit" value="🥝" type="radio" />
      </fieldset>
      <input type="submit" />
    </form>
  );
}

export default AddToListForm;
