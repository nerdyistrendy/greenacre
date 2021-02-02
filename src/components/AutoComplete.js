import React, { Component } from 'react'
import PlacesAutocomplete from 'react-places-autocomplete';

import './AutoComplete.css'; 
export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }
 
  handleChange = address => {
    this.setState({ address });
  };
 
  render() {
    return (
      <div className="canvas">
      <PlacesAutocomplete
      value={this.state.address}
      onChange={this.handleChange}
      onSelect={this.handleSelect}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: 'Enter Address',
              className: 'location-search-input',
            })}
          />
          <div className="autocomplete-dropdown-container">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, i) => {
              
              // inline style for demonstration purpose
              const style = suggestion.active
                ? { backgroundColor: '#42a5f5', cursor: 'pointer' }
                : { backgroundColor: '#ffffff', cursor: 'pointer' };
              return (
                <div key={i} className="input-suggestion"
                  {...getSuggestionItemProps(suggestion, {
                    
                    style,
                  })}
                >
                <i className="material-icons"> </i> <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
      </div>
    );
  };
}

export default AutoComplete