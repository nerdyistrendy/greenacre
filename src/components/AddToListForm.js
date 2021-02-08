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
        {/* {props.getLists.map(function(list, index) {
          return <Field key ={index} label={list.list_name} id={list.id} name={list.list_name} value={list.list_name} type="radio" />
        })} */}
      </fieldset>
      <input type="submit" />
    </form>
  );
}

export default AddToListForm;
