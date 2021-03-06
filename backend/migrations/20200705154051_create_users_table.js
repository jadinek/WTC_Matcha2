exports.up = function (knex) {
    return knex.schema
      .createTable('users', function (table) {
        table.string('email').unique()
        table.increments('id').notNullable().primary()
        table.string('username')
        table.string('password')
        table.string('first_name')
        table.string('last_name')
        table.string('role').defaultTo('user')
        table.boolean('confirmed').defaultTo(0)
      })
  }
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users')
  }