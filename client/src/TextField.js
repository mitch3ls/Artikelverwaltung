import React from 'react'

class TextField extends React.Component {

  constructor() {
    super()

    this.state = {
      value: '',
      focused: false
    }

    this.onFocus = this.onFocus.bind(this)
    this.onBlur = this.onBlur.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onFocus(ev) {
    const value = ev.target.value
    this.setState({
      value,
      focused: true
    })
  }

  onChange(ev) {
    const value = ev.target.value
    this.setState({
      value
    })
  }

  onBlur() {
    const {onChange, field} = this.props
    const {value} = this.state

    onChange({
      value,
      field
    })

    this.setState({
      focused: false
    })
  }

  render() {
    const {focused, value} = this.state

    const displayValue = focused ? value : this.props.value

    return (
      <td className={"TextField"}>
        <input type="text" placeholder={this.props.placeholder} onFocus={this.onFocus} onBlur={this.onBlur} onChange={this.onChange} value={displayValue}/>
      </td>
    )
  }
}

export default TextField