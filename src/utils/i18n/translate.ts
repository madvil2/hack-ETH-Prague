import i18n from "./index";

/**
 * Функция для получения перевода без использования хука
 * Можно использовать в любом файле
 * @param key ключ перевода (например 'common.welcome')
 * @param options объект с параметрами для интерполяции
 * @returns переведенная строка
 */
export const t = (key: string, options?: Record<string, unknown>): string => {
  return i18n.t(key, options);
};

/**
 * Функция для смены языка
 * @param lang код языка ('en' или 'uk')
 */
export const changeLanguage = (lang: "en" | "uk"): void => {
  i18n.changeLanguage(lang);
};

/**
 * Получить текущий язык
 * @returns код текущего языка
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

export default { t, changeLanguage, getCurrentLanguage };
