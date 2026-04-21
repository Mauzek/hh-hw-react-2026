import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettings, resetSettings } from '@/store/slices/settingsSlice';
import { selectSettings } from '@/store/selectors';

interface SettingsForm {
  login: string;
  repo: string;
  blacklist: string;
}

interface SettingsErrors {
  login?: string;
  repo?: string;
}

interface UseSettingsReturn {
  form: SettingsForm;
  errors: SettingsErrors;
  isSaved: boolean;
  handleChange: (field: keyof SettingsForm, value: string) => void;
  handleSave: () => void;
  handleReset: () => void;
}

export const useSettings = (): UseSettingsReturn => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const [form, setForm] = useState<SettingsForm>(() => ({
    login: settings.login,
    repo: settings.repo,
    blacklist: settings.blacklist.join(', '),
  }));

  const [errors, setErrors] = useState<SettingsErrors>({});
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = useCallback(
    (field: keyof SettingsForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setIsSaved(false);
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const next: SettingsErrors = {};

    if (!form.login.trim()) {
      next.login = 'Логин обязателен';
    }

    if (!form.repo.trim()) {
      next.repo = 'Репозиторий обязателен';
    } else if (!/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(form.repo.trim())) {
      next.repo = 'Формат: owner/repo';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form]);

  const handleSave = useCallback(() => {
    if (!validate()) {
      return;
    }

    dispatch(
      updateSettings({
        login: form.login.trim(),
        repo: form.repo.trim(),
        blacklist: form.blacklist
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    );

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  }, [dispatch, validate, form]);

  const handleReset = useCallback(() => {
    dispatch(resetSettings());

    setForm({ login: '', repo: '', blacklist: '' });
    setErrors({});
    setIsSaved(false);
  }, [dispatch]);

  return {
    form,
    errors,
    isSaved,
    handleChange,
    handleSave,
    handleReset,
  };
};
