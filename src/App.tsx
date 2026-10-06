import { useState } from 'react';
import type { FormEvent } from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography } from '@mui/material';
import { AskNowWidget } from 'asknow-react';
import type { AskNowApiConfig } from 'asknow-react';

export default function App() {
  const [component, setComponent] = useState<'input' | 'chatbot'>('input');
  const [settings, setSettings] = useState<AskNowApiConfig>(() => ({
    endpoint: '/asknow-api', accessToken: '', userId: '',
  }));
  const [config, setConfig] = useState<AskNowApiConfig | null>(null);

  function connect(event: FormEvent) {
    event.preventDefault();
    setConfig({ ...settings });
  }

  return (
    <main>
      <p className="eyebrow">AskNow React · API example</p>
      <h1>Choose how you ask.</h1>
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>API settings</Typography>
        <Box component="form" onSubmit={connect} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <TextField label="API endpoint" required value={settings.endpoint} onChange={e => setSettings({ ...settings, endpoint: e.target.value })} />
          <TextField label="Access token" type="password" required autoComplete="off" value={settings.accessToken} onChange={e => setSettings({ ...settings, accessToken: e.target.value })} />
          <TextField label="User ID" required value={settings.userId} onChange={e => setSettings({ ...settings, userId: e.target.value })} />
          <Button type="submit" variant="contained">Apply API settings</Button>
        </Box>
        {config && <Alert severity="success" sx={{ mt: 2 }}>Settings applied. Type a question to load suggestions and search.</Alert>}
      </Paper>
      <FormControl sx={{ minWidth: 240, mb: 4 }} size="small">
        <InputLabel id="component-label">Choose a component</InputLabel>
        <Select labelId="component-label" label="Choose a component" value={component} onChange={event => setComponent(event.target.value as 'input' | 'chatbot')}>
          <MenuItem value="input">AskNow input bar (Figma)</MenuItem>
          <MenuItem value="chatbot">Floating chatbot</MenuItem>
        </Select>
      </FormControl>
      {!config && <Alert severity="info">Enter your endpoint, access token, and user ID, then apply the settings.</Alert>}
      {config && <AskNowWidget {...config} variant={component} />}

    </main>
  );
}
