/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('item', table => {
        table.increments('id');
        table.integer("user_id")
        table.foreign('user_id').references('users.id');
        table.string('item_name').notNullable();
        table.string('description', 1000).notNullable();
        table.integer('quantity').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists('item');
};
