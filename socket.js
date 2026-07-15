let colorReading = {};
let socketConnected = false;
let bars = [];

// Connect to WebSocket server
const protocol = 'wss:';
const url = 'micro-api.awdokku.site/'
const ws = new WebSocket(`${protocol}//${url}`);
ws.onopen = () => {
  console.log('Connected to server');

  // Join the eight-px stream
  const joinMsg = {
    type: 'join',
    stream: 'shades-of-blue'
  };
  ws.send(JSON.stringify(joinMsg));
  console.log('Requesting to join shades of blue stream...');
};

ws.onclose = () => {
  console.log('Disconnected from server');
  socketConnected = false;
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onmessage = (event) => {
  // console.log('Message from server:', event.data);

  try {
    const data = JSON.parse(event.data);

    console.log(data);

    // Handle successful join confirmation
    if (data.type === 'joined') {
      socketConnected = true;
      console.log('Successfully joined stream:', data.stream);
    }

    // Handle incoming sensor data
    if (data.type === 'data' && data.values && data.device_id === DEVICE_ID) {
      colorReading = data.values;
      allReadings.unshift({ values: data.values, timestamp: new Date().toISOString() });
      if (allReadings.length > MAX) allReadings.pop();
      bars = getVisibleBars(allReadings, visibleDays);
    }
  } catch (error) {
    console.error('Error parsing message:', error);
  }
};


