import React, { Component } from "react";
import { CONSTANTS } from "../../../constants/constants";
import { connect } from "react-redux"
import TextBox from "./TextBox";
import TextArea from "./TextArea";
import { DateTime } from "./DateTime";
import { Select } from "./Select";
import { Radio } from "./Radio";
import { Checkbox } from "./Checkbox";
import FormBlock from "./FormBlock";

class FormGroup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { type } = this.props
    switch (type) {
      case CONSTANTS.TEXT:
        return <TextBox props={this.props} />

      case CONSTANTS.TEXT_AREA:
        return <TextArea props={this.props} />

      case CONSTANTS.DATE_TIME:
        return <DateTime props={this.props} />

      case CONSTANTS.SELECT:
        return <Select props={this.props} />

      case CONSTANTS.RADIO:
        return <Radio props={this.props} />

      case CONSTANTS.CHECKBOX:
        return <Checkbox props={this.props} />
        
      default:
        return <FormBlock props={this.props} />
    }
  }
}

export default FormGroup;
