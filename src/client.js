(function() {
  const socket = new WebSocket('ws://' + window.location.host + '/ws');
  
  socket.onopen = () => {
    console.log('Live reload connected');
  };

  socket.onmessage = (event) => {
    if (event.data === 'reload') {
      console.log('Reloading...');
      window.location.reload();
    }
  };

  socket.onclose = () => {
    console.log('Live reload disconnected. Reconnecting...');
    // Try to reload after a delay to pick up the new server
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  
  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
})();
