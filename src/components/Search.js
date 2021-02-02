import React, { useState } from 'react';
import Details from './Details';

const Search = (props) => {
  const [formFields, setFormFields] = useState({
    searchTerm: '',
  });

  const onInputChange = (event) => {
    setFormFields({searchTerm: event.target.value});
    };

  const onFormSubmit = (event) => {
    event.preventDefault();

    props.searchPropertyByAddress(formFields.searchTerm);

    setFormFields({
      searchTerm: '',
    });
  };

  return (
    <div>
      <form onSubmit={onFormSubmit} ><div>
        <h1>SEARCH BY ADDRESS</h1>
        <label htmlFor="searchTerm"></label></div>
        <input className='search-bar'
          name="searchTerm"
          id="searchTerm"
          onChange={onInputChange}
          value={formFields.searchTerm}
          placeholder="Enter Address"
        />
      <input 
        type="submit"
        name="Submit"
      />
      <Details currentProperty={props.currentProperty} />

    </form>
     </div>
  )
}

export default Search;