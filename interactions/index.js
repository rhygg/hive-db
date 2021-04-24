const { Postgres } = require('../postgres/main')

module.exports=({
  Postgres,
  sqlite: require('../sqlite/src/index'),
  mongo: require('../mongo/index')
})

