import React from 'react';

function WebhooksDataTable({ onLogout }: { onLogout: () => Promise<void> }) {
  return (
    <main aria-label="Дані вебхуків">
      <button type="button" onClick={onLogout}>Вийти</button>
      <p>Тут буде таблиця з даними вебхуків.</p>
    </main>
  );
}

export default WebhooksDataTable;
