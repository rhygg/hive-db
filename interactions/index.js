const { Postgres } = require('../postgres/main')
const {Database} = require('../mongo/index')
module.exports=({
  Postgres,
  sqlite: require('../sqlite/src/index'),
  Mongo: Database
})
