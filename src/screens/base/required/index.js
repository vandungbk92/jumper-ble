import React from 'react';
import { RkText } from 'react-native-ui-kitten'

export default function Required(props) {
  if (props.required)
    return (
      <RkText rkType="danger">{" *"}</RkText>
    )
  return (
    <RkText >{""}</RkText>

  )
}

