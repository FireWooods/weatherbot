const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '7555247832:AAH236NsNPa93fWxA9GV7UJz5oRleeDeHTQ';
const apiKey = 'ea0df5a7fbb0cbe2d37f38d8bf833888';

const bot = new TelegramBot(token, { polling: true });

function getWindDirection(degree) {
    if (degree >= 337.5 || degree < 22.5) {
        return 'северный';
    } else if (degree >= 22.5 && degree < 67.5) {
        return 'северо-восточный';
    } else if (degree >= 67.5 && degree < 112.5) {
        return 'восточный';
    } else if (degree >= 112.5 && degree < 157.5) {
        return 'юго-восточный';
    } else if (degree >= 157.5 && degree < 202.5) {
        return 'южный';
    } else if (degree >= 202.5 && degree < 247.5) {
        return 'юго-западный';
    } else if (degree >= 247.5 && degree < 292.5) {
        return 'западный';
    } else if (degree >= 292.5 && degree < 337.5) {
        return 'северо-западный';
    }
}

async function getWeather(chatId) {
    bot.on('message', async (msg) => {
        const city = msg.text;
        const url = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`;

        console.log(msg);
        console.log(messageId);

        axios
            .get(url)
            .then((response) => {
                bot.editMessageText(
                    chatId,
                    `Погода в ${city} сейчас: 
                        \nТемпература ${
                            response.data.current.temperature
                        }°C\nОщущается как ${
                        response.data.current.feelslike
                    }°C\nВетер ${getWindDirection(
                        response.data.current.wind_degree
                    )}, скорость ${
                        response.data.current.wind_speed
                    } м/с\nВлажность ${response.data.current.humidity}%`
                );
            })
            .catch((error) => {
                console.log(error);
            });
    });

    bot.sendMessage(chatId, 'Введи название города');
}

const start = () => {
    try {
        bot.setMyCommands([
            { command: '/start', description: 'Запуск бота' },
            { command: '/weather', description: 'Получить данные о погоде' },
        ]);

        bot.on('message', async (msg) => {
            const text = msg.text;
            const chatId = msg.chat.id;

            if (text === '/start') {
                return bot.sendMessage(
                    chatId,
                    'Привет, я помогу тебе узнать какая сейчас погода'
                );
            }

            if (text === '/weather') {
                return getWeather(chatId);
            }
        });
    } catch (e) {
        console.log(e);
    }
};

start();
