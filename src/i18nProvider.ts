import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import type { TranslationMessages } from 'react-admin';

/**
 * Start from official messages so all required keys exist,
 * then override/extend only what you need.
 */
const en: TranslationMessages = {
  ...englishMessages,
  ra: {
    ...englishMessages.ra,

    action: {
      ...englishMessages.ra.action,
      sort: 'Sort',
      expand: 'Expand',
      bulk_actions: '',
    },

    sort: {
      sort_by: 'Sort by %{field}',
      ASC: 'ascending',
      DESC: 'descending',
    },

    navigation: {
      ...englishMessages.ra.navigation,
      page_rows_per_page: 'Rows per page:',
    },
  },
};

/**
 * i18n provider – typed and returns our single-locale bundle.
 * Using a function keeps the signature react-admin expects.
 */
export const i18nProvider = polyglotI18nProvider(() => en, 'en');
