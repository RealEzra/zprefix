/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id');
        table.string('first_name').notNullable();
        table.string("last_name").notNullable();
        table.string("username").notNullable();
        table.string("password").notNullable();
        table.string('session_id');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('users');
};
