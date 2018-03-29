import React, {Component} from 'react'
import classNames from 'classnames'

class TableRow extends Component {
  constructor() {
    super()

    this.state = {
      hover: false
    }

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
  }

  mouseEnter() {
    this.setState({hover: true})
  }

  mouseLeave() {
    this.setState({hover: false})
  }

  render() {
    const {showDelete, onDelete} = this.props
    const {hover} = this.state

    return (
      <tr className={'ArticleRow'}
          onMouseEnter={this.mouseEnter}
          onMouseLeave={this.mouseLeave}
      >
        {this.props.children}

        <svg className={classNames('hoverOverlay', {'visible': hover && showDelete})} viewBox={'0 0 100 100'}
             onClick={onDelete}>
          <line x1='0' y1='0' x2='100' y2='100'/>
          <line x1='0' y1='100' x2='100' y2='0'/>
        </svg>
      </tr>
    )
  }
}

export default TableRow
