import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TextField from './TextField'
import DropDownList from './DropDownList'
import Barcode from 'react-barcode'
import TableRow from './TableRow'

class ArticleRow extends Component {

  constructor() {
    super()

    this.valueChanged = this.valueChanged.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  valueChanged(data) {
    const {article, onChange} = this.props
    const {field, value} = data

    let newArticle = Object.assign({}, article)
    newArticle[field] = value

    onChange(newArticle)
  }

  onDelete() {
    const {article, onDelete} = this.props
    onDelete(article)
  }

  render() {
    const {
      article: {
        id,
        bezeichnung,
        mwst,
        einheit,
        firma
      },
      showDelete
    } = this.props

    const {
      mwsts,
      einheiten,
      firmen
    } = this.context

    let barcode
    console.log(id)
    if (id >= 0)
      barcode = <Barcode value={id}
                         displayValue={false}
                         height={40}
                         background={'#0000'}
      />

    return (
      <TableRow className={'ArticleRow'}
                onDelete={this.onDelete}
                showDelete={showDelete}
      >
        <TextField
          field={'bezeichnung'}
          value={bezeichnung}
          placeholder={'Artikelname'}
          onChange={this.valueChanged}/>
        <DropDownList
          field={'mwst'}
          options={mwsts}
          createContent={option => option.name}
          selected={mwst.id}
          onChange={this.valueChanged}
        />
        <DropDownList
          field={'einheit'}
          options={einheiten}
          createContent={option => option.name}
          selected={einheit.id}
          onChange={this.valueChanged}
        />
        <DropDownList
          field={'firma'}
          options={firmen}
          createContent={option => option.name}
          selected={firma.id}
          onChange={this.valueChanged}
        />
        <td className={'Barcode'}>
          {barcode}
        </td>
      </TableRow>
    )
  }
}

ArticleRow.defaultProps = {
  showDelete: true
}

ArticleRow.contextTypes = {
  firmen: PropTypes.array,
  mwsts: PropTypes.array,
  einheiten: PropTypes.array
}

export default ArticleRow