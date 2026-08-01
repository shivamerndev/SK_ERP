import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('app_language') || 'hi'; // Default to Hindi for local jewellery shop
  });

  const [scriptMode, setScriptMode] = useState(() => {
    return localStorage.getItem('app_script_mode') || 'devanagari'; // 'devanagari' or 'hinglish'
  });

  const [weightUnit, setWeightUnit] = useState(() => {
    return localStorage.getItem('app_weight_unit') || 'gram'; // 'gram' or 'tola'
  });

  const [whatsappAlerts, setWhatsappAlerts] = useState(() => {
    return localStorage.getItem('app_whatsapp_alerts') !== 'false';
  });

  const [receiptLanguage, setReceiptLanguage] = useState(() => {
    return localStorage.getItem('app_receipt_language') || 'bilingual';
  });

  // Effect to keep localStorage updated
  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('app_script_mode', scriptMode);
  }, [scriptMode]);

  useEffect(() => {
    localStorage.setItem('app_weight_unit', weightUnit);
  }, [weightUnit]);

  useEffect(() => {
    localStorage.setItem('app_whatsapp_alerts', whatsappAlerts.toString());
  }, [whatsappAlerts]);

  useEffect(() => {
    localStorage.setItem('app_receipt_language', receiptLanguage);
  }, [receiptLanguage]);

  // Translation lookup function
  const t = (key) => {
    let dict = translations.en;
    if (language === 'hi') {
      dict = scriptMode === 'hinglish' ? translations.hi_hinglish : translations.hi;
    }
    return dict[key] || translations.en[key] || key;
  };

  const value = {
    language,
    setLanguage,
    scriptMode,
    setScriptMode,
    weightUnit,
    setWeightUnit,
    whatsappAlerts,
    setWhatsappAlerts,
    receiptLanguage,
    setReceiptLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
