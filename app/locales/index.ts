import { translations as enTranslations } from './en/translations';
import { translations as idTranslations } from './id/translations';

export const translations = {
  en: enTranslations,
  id: idTranslations,
};

export type Language = 'en' | 'id';

export type TranslationKey = keyof typeof enTranslations;

export type Translation = typeof enTranslations;

export type Translations = {
  [key in Language]: typeof enTranslations;
};