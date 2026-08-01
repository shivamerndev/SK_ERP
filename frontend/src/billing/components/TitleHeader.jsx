import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const TitleHeader = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 screen-only">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{t("billingTitle")}</h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("billingSubtitle")}
        </p>
      </div>
    </div>
  );
};

export default TitleHeader;
