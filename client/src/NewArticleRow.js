import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ArticleRow from './ArticleRow'

class NewArticleRow extends Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.resetState = this.resetState.bind(this)
    this.getInitialState = this.getInitialState.bind(this)

    this.nullValues = {
      nullEinheit: {
        id: -1,
        name: '--Einheit--'
      },
      nullMWST: {
        id: -1,
        name: '--MWST--'
      },
      nullFirma: {
        id: -1,
        name: '--Firma--'
      }
    }

    this.state = this.getInitialState()
  }

  getInitialState() {
    const {nullEinheit, nullMWST, nullFirma} = this.nullValues
    return {
      article: {
        bezeichnung: '',
        mwst: nullMWST,
        einheit: nullEinheit,
        firma: nullFirma
      }
    }
  }

  resetState() {
    this.setState(this.getInitialState)
  }

  getChildContext() {
    const {einheiten, mwsts, firmen} = this.context
    const {nullEinheit, nullMWST, nullFirma} = this.nullValues

    return {
      einheiten: [nullEinheit, ...einheiten],
      mwsts: [nullMWST, ...mwsts],
      firmen: [nullFirma, ...firmen]
    }
  }

  isValid(article) {
    const {bezeichnung, einheit, firma, mwst} = article
    return bezeichnung &&
      einheit.id !== -1 &&
      firma.id !== -1 &&
      mwst.id !== -1
  }

  toArticle(articleData) {
    const {nextTempId} = this.props

    return {
      id: nextTempId,
      ...articleData
    }
  }

  onChange(articleData) {
    const article = this.toArticle(articleData)
    this.setState({article})

    if (this.isValid(articleData)) {
      this.onCreate(article)
      this.resetState()
    }
  }

  onCreate(article) {
    const {onCreate} = this.props

    onCreate(article)
  }

  render() {
    const {article} = this.state
    return (
      <ArticleRow
        article={article}
        onChange={this.onChange}
        key={article.id}
        order={article.id}
        showDelete={false}
      />
    )
  }
}

NewArticleRow.contextTypes = {
  firmen: PropTypes.array,
  mwsts: PropTypes.array,
  einheiten: PropTypes.array
}

NewArticleRow.childContextTypes = {
  firmen: PropTypes.array,
  mwsts: PropTypes.array,
  einheiten: PropTypes.array
}


export default NewArticleRow