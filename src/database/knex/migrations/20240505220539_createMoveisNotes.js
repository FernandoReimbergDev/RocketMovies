exports.up = function(knex) {
    return knex.schema.createTable('movie_notes', function(table) {
      table.increments('id').primary();
      table.string('title'); 
      table.string('description'); 
      table.integer('rating'); 
      table.integer('user_id').unsigned().references('id').inTable('users');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now()); 
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('movie_notes'); 
  };