const articleToInput = article => {
  return {
    bezeichnung: article.bezeichnung,
    mwst: article.mwst.id,
    einheit: article.einheit.id,
    firma: article.firma.id
  }
}

export default {
  articleToInput
}