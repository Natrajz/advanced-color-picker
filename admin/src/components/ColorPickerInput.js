import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TextInput } from '@strapi/design-system/TextInput';
import { Stack } from '@strapi/design-system/Stack';
import { Button } from '@strapi/design-system/Button';
import { Textarea } from '@strapi/design-system';
import { auth } from '@strapi/helper-plugin'


export default function ColorPickerInput({
  name,
  error,
  description,
  onChange,
  value,
  intlLabel,
  attribute,
}) {
  const { formatMessage } = useIntl();
  const [prompt, setPrompt] = useState('');
  const [err, setErr] = useState(''); 

  return (
    <Stack spacing={1}>
      <TextInput
        placeholder="Please write a prompt for content to generate"
        label="Prompt"
        name="Prompt"
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
    </Stack>
  )
}