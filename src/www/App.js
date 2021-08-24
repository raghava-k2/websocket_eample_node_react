import React, { useRef, useState } from 'react'
import { Button, Container, Grid, Header, TextArea } from 'semantic-ui-react';
import { io } from 'socket.io-client';

const SERVER = "/";

const room = `room-${parseInt(Math.random() * 100)}`;

function App() {

  const [scriptCode, setScriptCode] = useState('');

  const scriptTextField = useRef(null);

  const socket = io(SERVER);

  socket.emit('join', room);

  socket.on('scriptOutput', (output) => {
    console.log('script output : ', output);
    setScriptCode(output);
  });

  async function runScript() {
    const { current } = scriptTextField;
    console.log('input script : ', current.ref.current.value);
    await window.fetch(`/api/run/script`, {
      method: 'POST',
      body: JSON.stringify({ script: current.ref.current.value, room }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }).then(res => res.json());
  }

  return (
    <Container>
      <Grid>
        <Grid.Row>
          <Grid.Column width={8}>
            <Container fluid>
              <Header as='h2'>Script</Header>
              <TextArea placeholder='Write the script here...' style={{ minHeight: '90vh', width: '100%' }} ref={scriptTextField} />
              <Button primary onClick={runScript}>Run</Button>
            </Container>
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as='h2'>Output</Header>
            <TextArea placeholder='Output..' style={{ minHeight: '90vh', width: '100%' }} value={scriptCode} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default App