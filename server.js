const express = require('express');
const path = require('path'); // встроенный модуль для путей к файлам

const app = express();
const PORT = 3000;

// Маршрут "/" — главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут "/about" — страница "О себе"
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Раздаём все остальные файлы из папки public (css, js, картинки)
app.use(express.static(path.join(__dirname, 'public')));




// ===== API: генератор Lorem Ipsum =====

// Слова, из которых собираем текст
const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
  'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore',
  'et', 'dolore', 'magna', 'aliqua', 'enim', 'minim', 'veniam', 'quis'
];

// Проверяет один параметр.
// Нет параметра -> вернёт значение по умолчанию.
// Не целое число или вне диапазона -> вернёт null (значит ошибка).
function parseParam(value, defaultValue, min, max) {
  if (value === undefined) {
    return defaultValue;
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < min || number > max) {
    return null;
  }
  return number;
}

// Собирает один абзац из count слов.
// Первые два слова всегда "lorem ipsum", остальные случайные.
function makeParagraph(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    if (i < 2) {
      result.push(WORDS[i]);
    } else {
      const randomIndex = Math.floor(Math.random() * WORDS.length);
      result.push(WORDS[randomIndex]);
    }
  }
  const text = result.join(' ');
  // Первая буква заглавная, в конце точка
  return text[0].toUpperCase() + text.slice(1) + '.';
}

// Маршрут /api/lorem
app.get('/api/lorem', (req, res) => {
  const words = parseParam(req.query.words, 20, 1, 1000);
  const paragraphs = parseParam(req.query.paragraphs, 1, 1, 10);

  // Если хотя бы один параметр плохой -> ошибка 400
  if (words === null || paragraphs === null) {
    return res.status(400).json({
      error: 'Invalid parameters: words must be 1-1000, paragraphs must be 1-10'
    });
  }

  // Собираем нужное количество абзацев
  const list = [];
  for (let p = 0; p < paragraphs; p++) {
    list.push(makeParagraph(words));
  }

  // Отправляем ответ в формате JSON
  res.json({
    words: words,
    paragraphs: paragraphs,
    text: list.join('\n\n')
  });
});



app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});