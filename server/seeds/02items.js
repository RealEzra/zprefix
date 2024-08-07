/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('item').del()
  await knex('item').insert([
    {user_id: 1, item_name: 'Flipper Zero', description: "Flipper Zero is a portable multi-tool for pentesters and geeks in a toy-like body. It loves hacking digital stuff, such as radio protocols, access control systems, hardware, and more. It's fully open-source and customizable, so you can extend it in whatever way you like.", quantity: 5},
    {user_id: 1, item_name: 'Stem Projector', description: "Much like its predecessor, the new Stem Projector comes in a unique synthetic flesh-like housing with an array of vibey-looking lights arranged around the top of the device. If you've seen David Cronenberg's eXistenZ or Crimes of the Future, then it will look alarmingly familiar.", quantity: 1},
    {user_id: 2, item_name: 'Stem Projector', description: "Much like its predecessor, the new Stem Projector comes in a unique synthetic flesh-like housing with an array of vibey-looking lights arranged around the top of the device. If you've seen David Cronenberg's eXistenZ or Crimes of the Future, then it will look alarmingly familiar.", quantity: 1}
  ]);
};
