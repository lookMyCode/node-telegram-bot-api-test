const TelegramBot = require('node-telegram-bot-api');

const token = '5674475713:AAEBXC60Jtk1c02NhPqXZnex4q3jkiABfiE';
const bot = new TelegramBot(token, {polling: true});

const users = [];

const typeOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: 'Kryzys mediowy', 
          callback_data: JSON.stringify({
            type: 'type',
            value: 'Kryzys mediowy'
          })
        },
      ],
      [
        {
          text: 'Wejście służb', 
          callback_data: JSON.stringify({
            type: 'type',
            value: 'Wejście służb'
          })
        },
      ],
    ]
  })
}

const validityOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        {
          text: 'Nie mocno poważne', 
          callback_data: JSON.stringify({
            type: 'validity',
            value: 'Nie mocno poważne'
          })
        },
      ],
      [
        {
          text: 'Poważne', 
          callback_data: JSON.stringify({
            type: 'validity',
            value: 'Poważne'
          })
        },
      ],
    ]
  })
}

bot.on('message', (msg) => {
  console.log(msg)
  const chatId = msg.chat.id;
  let user = users.find(x => x.id === chatId);
  console.log(user)
  if (!user) {
    user = {id: chatId}
    users.push(user);
  }

  if (!user?.type) {
    bot.sendMessage(chatId, 'Co się wydarzyło?', typeOptions);
  }
  console.log(user)
  if (user.type && user.validity) {
    user.address = msg.text;
    const resp = `
Typ: ${user.type}
Poważność: ${user.validity}
Adres: ${user.address}
    `;

    bot.sendMessage(chatId, resp);
  }
});

bot.on('callback_query', msg => {
  const fromId = msg.from.id;
  const user = users.find(x => x.id === fromId);
  if (!user) return;

  const data = JSON.parse(msg.data);
  if (data.type === 'type') {
    user.type = data.value;
    bot.sendMessage(fromId, 'Jak poważne?', validityOptions);
  }

  if (data.type === 'validity') {
    user.validity = data.value;
    bot.sendMessage(fromId, 'Podaj adres miejsca zdarzenia');
  }
});