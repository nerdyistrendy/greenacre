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
    defaultValues: { list: "favorite" },
    onSubmit: (values) => props.addPropertyToList(props.currentUser, values.list, props.currentProperty)
    

    // onSubmit: (values) =>
    // props.addPropertyToList(props.currentUser, values, props.currentProperty),
    // (values) => console.log("onSubmit: ", values),
    // props.addPropertyToList(props.currentUser, values.list, props.currentProperty)
    // onSubmit: (e) => alert(e.key),
    // onSubmit: (values) => console.log(JSON.stringify(values)),
  });
  

  return (
    <form ref={form}>
      <fieldset>
        <legend>Add to List</legend>
        {props.currentUserLists.map(function (list, index) {
          return (
            <Field
              key={index}
              label={list}
              id={list}
              name="list"
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
