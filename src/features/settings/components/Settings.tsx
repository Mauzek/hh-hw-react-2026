'use client';

import { useSettings } from '@/features/settings/hooks/useSettings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './Settings.module.scss';

export const Settings = () => {
  const { form, errors, isSaved, handleChange, handleSave, handleReset } =
    useSettings();

  return (
    <div className={styles.settings}>
      <h2 className={styles.settings__title}>Настройки</h2>

      <div className={styles.settings__fields}>
        <Input
          label="Ваш логин"
          id="login"
          value={form.login}
          onChange={(e) => handleChange('login', e.target.value)}
          placeholder="github-username"
          error={errors.login}
          autoComplete="off"
          spellCheck={false}
        />

        <Input
          label="Репозиторий"
          id="repo"
          value={form.repo}
          onChange={(e) => handleChange('repo', e.target.value)}
          placeholder="owner/repo"
          error={errors.repo}
          autoComplete="off"
          spellCheck={false}
        />

        <Input
          label="Blacklist"
          id="blacklist"
          value={form.blacklist}
          onChange={(e) => handleChange('blacklist', e.target.value)}
          placeholder="user1, user2, user3"
          hint="Логины через запятую"
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.settings__actions}>
        <Button variant="primary" onClick={handleSave}>
          {isSaved ? '✓ Сохранено' : 'Сохранить'}
        </Button>
        <Button variant="ghost" onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </div>
  );
};
