(function() {
  const socket = new WebSocket('ws://' + window.location.host + '/ws');
  
  // 1. Inject Styles
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      background: #e0e0e0 !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      padding: 60px 0 !important;
      min-height: 100vh !important;
      margin: 0 !important;
      overflow-y: auto !important;
    }

    #resume-paper {
      background-color: white !important;
      background-image: linear-gradient(to bottom, 
        transparent 296.8mm, 
        rgba(0,0,0,0.06) 296.8mm, 
        rgba(0,0,0,0.06) 297mm, 
        transparent 297mm
      ) !important;
      background-size: 100% 297mm !important;
      width: 210mm !important;
      min-height: 297mm !important;
      padding: 1.5cm !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
      box-sizing: border-box !important;
      position: relative !important;
      margin-bottom: 40px !important;
    }

    #dev-status-bar {
      position: fixed;
      top: 15px;
      left: 50%;
      transform: translateX(-50%);
      background: #222;
      color: #eee;
      padding: 8px 18px;
      border-radius: 30px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.3s ease;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ffc107;
      box-shadow: 0 0 8px #ffc107;
    }

    .status-dot.connected { 
      background: #4caf50; 
      box-shadow: 0 0 8px #4caf50;
    }

    .status-dot.disconnected { 
      background: #f44336; 
      box-shadow: 0 0 8px #f44336;
    }
    
    .update-time { 
      opacity: 0.6; 
      font-size: 11px; 
      border-left: 1px solid rgba(255,255,255,0.2);
      padding-left: 12px;
    }

    /* Print optimization: hide dev tools when printing from browser */
    @media print {
      #dev-status-bar { display: none !important; }
      body { background: white !important; padding: 0 !important; }
      #resume-paper { box-shadow: none !important; margin: 0 !important; }
    }
  `;
  document.head.appendChild(style);

  // 2. Create Status Bar
  const statusBar = document.createElement('div');
  statusBar.id = 'dev-status-bar';
  statusBar.innerHTML = `
    <span class="status-dot"></span>
    <span class="status-text">Connecting...</span>
    <span class="update-time"></span>
  `;
  document.body.appendChild(statusBar);

  // 3. Wrap Content in Paper
  const paper = document.createElement('div');
  paper.id = 'resume-paper';
  
  // Move all body children except statusBar and the script itself into paper
  const children = Array.from(document.body.childNodes);
  children.forEach(child => {
    if (child !== statusBar && child.tagName !== 'SCRIPT') {
      paper.appendChild(child);
    }
  });
  document.body.insertBefore(paper, statusBar);

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const setUpdateDisplay = (time) => {
    const timeEl = statusBar.querySelector('.update-time');
    if (timeEl) timeEl.textContent = `Last update: ${time}`;
  };

  socket.onopen = () => {
    statusBar.querySelector('.status-dot').classList.add('connected');
    statusBar.querySelector('.status-text').textContent = 'Live Reload Active';
    
    // Check for persisted update time
    const lastUpdate = sessionStorage.getItem('last-resume-update');
    if (lastUpdate) {
      setUpdateDisplay(lastUpdate);
    } else {
      const now = getFormattedTime();
      setUpdateDisplay(now);
      sessionStorage.setItem('last-resume-update', now);
    }
  };

  socket.onmessage = (event) => {
    if (event.data === 'reload') {
      // Record the reload time before refreshing
      sessionStorage.setItem('last-resume-update', getFormattedTime());
      window.location.reload();
    }
  };

  socket.onclose = () => {
    const dot = statusBar.querySelector('.status-dot');
    dot.classList.remove('connected');
    dot.classList.add('disconnected');
    statusBar.querySelector('.status-text').textContent = 'Disconnected';
    
    // Auto-reconnect/reload after a short delay
    setTimeout(() => window.location.reload(), 1000);
  };

  socket.onerror = (err) => {
    console.error('Live reload error:', err);
  };
})();
