import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Flex } from "@radix-ui/themes";

type Language = {
  code: string;
  flag: string;
};

const languages: Language[] = [
  { code: "en", flag: "🇬🇧" },
  { code: "uk", flag: "🇺🇦" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);

  i18n.on("languageChanged", (lng: string) => {
    setCurrentLang(lng);
  });

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  return (
    <Flex gap="2" align="center">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLang.startsWith(lang.code) ? "solid" : "outline"}
          size="2"
          onClick={() => changeLanguage(lang.code)}
          aria-label={`Switch to ${lang.code.toUpperCase()}`}
        >
          {lang.flag}
        </Button>
      ))}
    </Flex>
  );
};

export default LanguageSwitcher;
