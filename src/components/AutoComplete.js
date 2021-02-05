import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import Details from "./Details";
import "./styles.scss";

import "./AutoComplete.scss";
export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    // this.props.getPropertyId(this.state.address)
    this.props.searchPropertyById(this.state.address);

    // this.setState({ address: '' });
  };

  render() {
    return (
      <div>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <form onSubmit={this.onFormSubmit}>
              <input
                {...getInputProps({
                  placeholder: "Enter Address",
                  className: "location-search-input",
                })}
              />
              <input type="submit" name="Submit" />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion, i) => {
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#42a5f5", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      key={i}
                      className="input-suggestion"
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                    >
                      <i className="material-icons"> </i>{" "}
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
              {/* <Search currentProperty={this.props.currentProperty} /> */}
            </form>
          )}
        </PlacesAutocomplete>
        <Details 
          currentProperty={this.props.currentProperty}
          address={this.state.address}
        />
      </div>
    );
  }
}

export default AutoComplete;
