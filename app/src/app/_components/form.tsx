'use client';

import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import { Button } from '~/components/ui/button';
import { api } from '~/trpc/react';

export const Form = () => {
  const themeData = useTheme();
  const [value, setValue] = useState('');
  const utils = api.useUtils();
  const mutation = api.message.create.useMutation({
    async onSuccess() {
      await utils.message.invalidate();
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClick = async () => {
    if (value) {
      mutation.mutate({ text: value });
      setValue('');
    }
  };
  const handleToggleTheme = () => {
    if (themeData.theme === 'light') {
      themeData.setTheme('dark');
    } else {
      themeData.setTheme('light');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark">
      <input
        type="text"
        value={value}
        disabled={mutation.isPending}
        onChange={handleChange}
        className="border border-primary-light dark:border-primary-dark"
      />
      <button
        onClick={handleClick}
        disabled={mutation.isPending}
        className="bg-accent-light dark:bg-accent-dark"
      >
        Send!
      </button>
      {mutation.isSuccess && <span className="text-green-600">Sent...</span>}
      <Button variant="destructive" onClick={handleToggleTheme}>
        Toggle theme
      </Button>
    </div>
  );
};
