import React, { Component } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import Details from "./Details";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import "./styles.scss";

import "./AutoComplete.scss";
export class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
    this.state = {propertyLoading: false}
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    // this.props.getPropertyId(this.state.address)
    this.props.searchPropertyById(this.state.address);

    this.setState({ address: '' });
    this.setState({ propertyLoading: true});

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
        {this.state.propertyLoading && !this.props.currentProperty && <Loader
            type="Bars"
            color="#8bc34a"
            height={50}
            width={50}
            className="loader"
          />}
         <Details 
          currentProperty={this.props.currentProperty}
          address={this.state.address}
          currentUser={this.props.currentUser}
          currentUserLists={this.props.currentUserLists}
          addPropertyToList={this.props.addPropertyToList}
          getLists={this.props.getLists} 
        />
        
      </div>
    );
  }
}

export default AutoComplete;
