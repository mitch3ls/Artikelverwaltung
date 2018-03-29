import React, {Component} from 'react'

class DropDownList extends Component {

  constructor() {
    super()

    this.onChange = this.onChange.bind(this)
  }

  onChange(ev) {
    const {options, field, onChange} = this.props
    const id = ev.target.value
    const value = options.find(option => option.id === id)
    onChange({
      value,
      field
    })
  }

    render() {
    const {options, createContent, selected} = this.props
    return (
      <td className={"DropDownList"}>
           <select value={selected} onChange={this.onChange}>
             {options.map(option =>
               <option key={option.id} value={option.id}>{createContent(option)}</option>)}
           </select>
      </td>
    )
  }
}

export default DropDownList