const {makeExecutableSchema} = require('graphql-tools')
const query = require('./query')

// language=GraphQL Schema
const typeDefs = `
    type Query {
        articles: [Article]!,
        mwst: [MWST]!,
        einheiten: [Einheit]!,
        firmen: [Firma]!
    }

    type Mutation {
        changeArticle(id: Int, input: ArticleInput): Article
        addArticle(input: ArticleInput): Article
        deleteArticle(id: Int): Int
    }

    input ArticleInput {
        bezeichnung: String,
        mwst: Int,
        einheit: Int,
        firma: Int
    }

    type Article {
        id: Int!,
        bezeichnung: String,
        mwst: MWST,
        einheit: Einheit,
        firma: Firma
    }

    type MWST {
        id: ID,
        name: String,
        satz: Float
    }

    type Einheit {
        id: ID,
        name: String,
        zeichen: String
    }

    type Firma {
        id: ID,
        name: String
    }
`

const resolvers = {
  Query: {
    articles: async () => await Article.all(),
    mwst: async () => await MWST.all(),
    einheiten: async () => await Einheit.all(),
    firmen: async () => await Firma.all()
  },
  Mutation: {
    changeArticle: async (_, data) => {
      const {id, input} = data
      const article = await Article.forId(id)
      await article.updateWithInput(input)
      article.save()
      return article
    },
    addArticle: async (_, data) => {
      const {input} = data
      return await Article.add(input)
    },
    deleteArticle: async (_, data) => {
      const {id} = data
      await Article.delete(id)
      return id
    }
  }
}

class Article {
  constructor(id, bezeichnung, mwst, firma, einheit) {
    this.id = id
    this.bezeichnung = bezeichnung
    this.mwst = mwst
    this.firma = firma
    this.einheit = einheit
  }

  async updateWithInput(input) {
    const {bezeichnung, mwst, firma, einheit} = input
    if (bezeichnung !== undefined) this.bezeichnung = bezeichnung
    if (mwst !== undefined) this.mwst = await MWST.forId(mwst)
    if (firma !== undefined) this.firma = await Firma.forId(firma)
    if (einheit !== undefined) this.einheit = await Einheit.forId(einheit)
  }

  static async add(input) {
    const {bezeichnung, mwst, firma, einheit} = input
    return await query(`
      INSERT INTO artikel 
        (bezeichnung, fk_mwst, fk_firma, fk_einheit) 
        VALUES (?, ?, ?, ?)
    `, [
      bezeichnung,
      mwst,
      firma,
      einheit
    ])
      .then(result => result.insertId)
      .then(Article.forId)
  }

  static async delete(id) {
    return await query(`
      DELETE FROM artikel
      WHERE pk_artikelnummer = ?
    `, id)
  }

  async save() {
    query(`
      UPDATE artikel
      SET bezeichnung = ?,
        fk_mwst = ?,
        fk_firma = ?,
        fk_einheit = ?
      WHERE pk_artikelnummer = ?
    `, [
      this.bezeichnung,
      this.mwst.id,
      this.firma.id,
      this.einheit.id,
      this.id
    ])
  }

  static fromQLResult(result) {
    const {pk_mwst_id, mwst_name, mwst_satz} = result
    const mwst = new MWST(pk_mwst_id, mwst_name, mwst_satz)

    const {pk_firmennummer, firmenname} = result
    const firma = new Firma(pk_firmennummer, firmenname)

    const {pk_einheit_id, einheits_name, zeichen} = result
    const einheit = new Einheit(pk_einheit_id, einheits_name, zeichen)

    const {pk_artikelnummer, bezeichnung} = result
    return new Article(pk_artikelnummer, bezeichnung, mwst, firma, einheit)
  }

  static async forId(id) {
    return query(`
      SELECT *
      FROM artikel
      INNER JOIN mwst m ON artikel.fk_mwst = m.pk_mwst_id
      INNER JOIN firma f ON artikel.fk_firma = f.pk_firmennummer
      INNER JOIN einheit e ON artikel.fk_einheit = e.pk_einheit_id
      WHERE pk_artikelnummer = ?
    `, id).then(results => results
      .map(Article.fromQLResult)[0]
    )
  }

  static async all() {
    return query(`
      SELECT *
      FROM artikel
      INNER JOIN mwst m ON artikel.fk_mwst = m.pk_mwst_id
      INNER JOIN firma f ON artikel.fk_firma = f.pk_firmennummer
      INNER JOIN einheit e ON artikel.fk_einheit = e.pk_einheit_id
    `).then(results => results
      .map(result => {
        const {pk_mwst_id, mwst_name, mwst_satz} = result
        const mwst = new MWST(pk_mwst_id, mwst_name, mwst_satz)

        const {pk_firmennummer, firmenname} = result
        const firma = new Firma(pk_firmennummer, firmenname)

        const {pk_einheit_id, einheits_name, zeichen} = result
        const einheit = new Einheit(pk_einheit_id, einheits_name, zeichen)

        const {pk_artikelnummer, bezeichnung} = result
        return new Article(pk_artikelnummer, bezeichnung, mwst, firma, einheit)
      })
    )
  }
}

class MWST {
  constructor(id, name, satz) {
    this.id = id
    this.name = name
    this.satz = satz
  }

  static async forId(id) {
    return query(`
      SELECT *
      FROM mwst
      WHERE pk_mwst_id = ?
    `, id).then(results => results
      .map(({pk_mwst_id, mwst_name, mwst_satz}) =>
        new MWST(pk_mwst_id, mwst_name, mwst_satz)
      )[0]
    )
  }

  static async all() {
    return query(`
      SELECT *
      FROM mwst
    `).then(results => results
      .map(({pk_mwst_id, mwst_name, mwst_satz}) =>
        new MWST(pk_mwst_id, mwst_name, mwst_satz)
      )
    )
  }
}

class Firma {
  constructor(id, name) {
    this.id = id
    this.name = name
  }

  static async all() {
    return query(`
      SELECT *
      FROM firma
    `).then(results => results
      .map(({pk_firmennummer, firmenname}) =>
        new Firma(pk_firmennummer, firmenname))
    )
  }

  static async forId(id) {
    return query(`
      SELECT *
      FROM firma
      WHERE pk_firmennummer = ?
    `, id).then(results => results
      .map(({pk_firmennummer, firmenname}) =>
        new Firma(pk_firmennummer, firmenname))[0]
    )
  }
}

class Einheit {
  constructor(id, name, zeichen) {
    this.id = id
    this.name = name
    this.zeichen = zeichen
  }

  static async all() {
    return query(`
      SELECT *
      FROM einheit
    `).then(results => results
      .map(({pk_einheit_id, einheits_name, zeichen}) =>
        new Einheit(pk_einheit_id, einheits_name, zeichen))
    )
  }

  static async forId(id) {
    return query(`
      SELECT *
      FROM einheit
      WHERE pk_einheit_id = ?
    `, id).then(results => results
      .map(({pk_einheit_id, einheits_name, zeichen}) =>
        new Einheit(pk_einheit_id, einheits_name, zeichen))[0]
    )
  }
}

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers
})