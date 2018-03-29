import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {graphql, compose} from 'react-apollo'
import gql from 'graphql-tag'
import articleUtil from './articleUtil'

import ArticleList from './ArticleList'

class App extends Component {

  getChildContext() {
    const {einheiten, mwst, firmen} = this.props.data
    return {
      einheiten,
      mwsts: mwst,
      firmen
    }
  }

  render() {
    const {loading, articles} = this.props.data
    return (
      <div className={'App'}>
        <div className={'header'}>
          <div className="title">Artikelverwaltung</div>
        </div>
        <div className={'content'}>
          <div className="box">
            <ArticleList
              loading={loading}
              articles={articles}
              onArticleModified={this.props.updateArticle}
              onArticleAdded={this.props.addArticle}
              onArticleDeleted={this.props.deleteArticle}
            />
          </div>
        </div>
      </div>
    )
  }
}

App.childContextTypes = {
  firmen: PropTypes.array,
  mwsts: PropTypes.array,
  einheiten: PropTypes.array
}

App.fragments = {
  article: gql`
      fragment AllFromEinheit on Einheit {
          id
          name
          zeichen
      }

      fragment AllFromFirma on Firma {
          id
          name
      }

      fragment AllFromMWST on MWST {
          id
          name
          satz
      }
      fragment AllFromArticle on Article {
          id
          bezeichnung
          mwst { ...AllFromMWST}
          firma { ...AllFromFirma}
          einheit { ...AllFromEinheit}
      }
  `
}

export default compose(
  graphql(gql`
      query fetchAll{
          articles { ...AllFromArticle}
          einheiten { ...AllFromEinheit}
          mwst { ...AllFromMWST}
          firmen { ...AllFromFirma}
      }
      ${App.fragments.article}
  `),
  graphql(gql`
      mutation updateArticle($id: Int, $input: ArticleInput) {
          changeArticle(id: $id, input: $input) {
              ...AllFromArticle
          }
      }
      ${App.fragments.article}
  `, {
    props: ({ownProps, mutate}) => ({
      updateArticle(article) {
        const {id} = article
        const input = articleUtil.articleToInput(article)
        return mutate({
          variables: {
            id,
            input
          },
          optimisticResponse: {
            changeArticle: {
              id,
              bezeichnung: input.bezeichnung,
              mwst: {
                id: input.mwst,
                name: article.mwst.name,
                satz: 0.2,
                __typename: 'MWST'
              },
              firma: {
                id: input.firma,
                name: article.firma.name,
                __typename: 'Firma'
              },
              einheit: {
                id: input.einheit,
                name: article.einheit.name,
                zeichen: article.einheit.zeichen,
                __typename: 'Einheit'
              },
              __typename: 'Article'
            },
            __typename: 'Mutation'
          }
        })
      }
    }),
    options: {
      updateQueries: {
        fetchAll: (prev, {mutationResult}) => {
          const updatedArticle = mutationResult.data.changeArticle
          console.log(updatedArticle)
          const articles = prev.articles.map(article => {
            if (article.id !== updatedArticle.id)
              return article

            return updatedArticle
          })
          const newState = {...prev, articles}
          return newState
        }
      }
    }
  }),
  graphql(gql`
      mutation addArticle($input: ArticleInput) {
          addArticle(input: $input) {
              ...AllFromArticle
          }
      }
      ${App.fragments.article}
  `, {
    props: ({ownProps, mutate}) => ({
      addArticle(article) {
        const input = articleUtil.articleToInput(article)
        return mutate({
          variables: {
            input
          },
          optimisticResponse: {
            addArticle: {
              id: article.id,
              bezeichnung: input.bezeichnung,
              mwst: {
                id: input.mwst,
                name: article.mwst.name,
                satz: 0.2,
                __typename: 'MWST'
              },
              firma: {
                id: input.firma,
                name: article.firma.name,
                __typename: 'Firma'
              },
              einheit: {
                id: input.einheit,
                name: article.einheit.name,
                zeichen: article.einheit.zeichen,
                __typename: 'Einheit'
              },
              __typename: 'Article'
            },
            __typename: 'Mutation'
          }
        })
      }
    }),
    options: {
      updateQueries: {
        fetchAll: (prev, {mutationResult}) => {
          const newArticle = mutationResult.data.addArticle
          const articles = [...prev.articles, newArticle]
          return {...prev, articles}
        }
      }
    }
  }),
  graphql(gql`
      mutation deleteArticle($id: Int) {
          id: deleteArticle(id: $id)
      }
  `, {
    props: ({ownProps, mutate}) => ({
      deleteArticle(article) {
        const {id} = article
        return mutate({
          variables: {
            id
          },
          optimisticResponse: {
            id,
            __typename: 'Mutation'
          }
        })
      }
    }),
    options: {
      updateQueries: {
        fetchAll: (prev, {mutationResult}) => {
          const {id} = mutationResult.data
          const articles = prev.articles
            .filter(article => article.id !== id)
          return {...prev, articles}
        }
      }
    }
  })
)(App)