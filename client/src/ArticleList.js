import React from 'react'
import ArticleRow from './ArticleRow'
import NewArticleRow from './NewArticleRow'

const ArticleList = ({
                       loading,
                       articles,
                       onArticleModified,
                       onArticleAdded,
                       onArticleDeleted
                     }) => {

  if (loading) return (
    <div className="ArticleList">
      Loading...
    </div>
  )

  return (
    <table className="ArticleList">
      <tbody>
        {articles.map(article =>
          <ArticleRow article={article}
                      onChange={onArticleModified}
                      onDelete={onArticleDeleted}
                      key={article.id}
                      order={article.id}
          />
        )}
        <NewArticleRow
          onCreate={onArticleAdded}
          nextTempId={-articles.length - 1}
        />
      </tbody>
    </table>
  )
}

export default ArticleList