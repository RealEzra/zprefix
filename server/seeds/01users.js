const bcrypt = require('bcrypt');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {first_name: 'Ezra', last_name: 'Dulaney', username: 'ezra', password: bcrypt.hashSync("password!", 10) }
  ]);
};
