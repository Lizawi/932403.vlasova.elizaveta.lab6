// Находим на странице кнопку и блок для результата (по их id)
const button = document.getElementById('generate');
const result = document.getElementById('result');

// Когда нажимают на кнопку — выполняем эту функцию
button.addEventListener('click', async () => {
  // Берём числа, которые ввёл пользователь
  const words = document.getElementById('words').value;
  const paragraphs = document.getElementById('paragraphs').value;

  try {
    // Отправляем запрос на наш API с query-параметрами
    const response = await fetch(`/api/lorem?words=${words}&paragraphs=${paragraphs}`);
    // Превращаем ответ из JSON в объект
    const data = await response.json();

    // Если сервер ответил ошибкой (400) — показываем её
    if (!response.ok) {
      result.textContent = 'Ошибка: ' + data.error;
      return;
    }

    // Всё хорошо — показываем текст
    result.textContent = data.text;
  } catch (err) {
    // Сервер недоступен (например, нет интернета)
    result.textContent = 'Не удалось связаться с сервером';
  }
});