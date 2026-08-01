import { useLanguage } from '../context/LanguageContext';
import {
  Languages,
  CheckCircle2,
  Sparkles,
  Store,
  ShieldCheck,
  Scale,
  MessageSquare,
  Eye,
  Check
} from 'lucide-react';

const Setting = () => {
  const {
    language,
    setLanguage,
    scriptMode,
    setScriptMode,
    weightUnit,
    setWeightUnit,
    whatsappAlerts,
    setWhatsappAlerts,
    t
  } = useLanguage();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1c1008] via-[#2a190c] to-[#140b04] p-6 sm:p-8 border border-[#593d1f]/60 shadow-lg">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-gradient-to-br from-[#d4af37]/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f5d061] text-xs font-semibold uppercase tracking-wider">
            <Store className="w-3.5 h-3.5" />
            <span>{t("suruchiJewellers")} • {t("systemPreference")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fff5d6] via-[#f7d479] to-[#d4af37] tracking-tight">
            {t("settingsTitle")}
          </h1>
          <p className="text-sm text-[#b8a088] max-w-2xl leading-relaxed">
            {t("settingsSubtitle")}
          </p>
        </div>
      </div>

      {/* Language & Script Preference Card */}
      <div className="bg-[#fffdfa] rounded-2xl p-6 border border-[#e8decb] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#f0e6d5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5cf6e] to-[#b8860b] text-[#1a0f07] flex items-center justify-center shadow-md">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#2c1d11]">
                {t("languageSectionTitle")}
              </h2>
              <p className="text-xs text-[#786452]">
                {t("languageSectionSubtitle")}
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7]">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t("systemActive")}
          </span>
        </div>

        {/* Language Cards Choice */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#786452] block">
            {t("selectLanguage")}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hindi Card */}
            <div
              onClick={() => setLanguage('hi')}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                language === 'hi'
                  ? 'bg-gradient-to-br from-[#fffdf5] via-[#fef9eb] to-[#faf1d9] border-[#d4af37] shadow-[0_4px_20px_rgba(212,175,55,0.25)] ring-2 ring-[#d4af37]/30'
                  : 'bg-[#faf6f0]/50 border-[#e8decb] hover:border-[#c79928] hover:bg-[#fffdfa]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center font-bold text-[#b8860b] text-base">
                    क
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1c130b] text-base">
                      {t("hindi")}
                    </h3>
                    <span className="text-xs text-[#786452]">
                      {t("hindiDesc")}
                    </span>
                  </div>
                </div>
                {language === 'hi' && (
                  <CheckCircle2 className="w-5 h-5 text-[#b8860b]" />
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#e8decb]/60 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#855e24] bg-[#fdf5e6] px-2.5 py-0.5 rounded-full border border-[#f0d89c]">
                  ✨ {t("recommendedBadge")}
                </span>
              </div>
            </div>

            {/* English Card */}
            <div
              onClick={() => setLanguage('en')}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                language === 'en'
                  ? 'bg-gradient-to-br from-[#fffdf5] via-[#fef9eb] to-[#faf1d9] border-[#d4af37] shadow-[0_4px_20px_rgba(212,175,55,0.25)] ring-2 ring-[#d4af37]/30'
                  : 'bg-[#faf6f0]/50 border-[#e8decb] hover:border-[#c79928] hover:bg-[#fffdfa]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-base">
                    En
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1c130b] text-base">
                      {t("english")}
                    </h3>
                    <span className="text-xs text-[#786452]">
                      {t("englishDesc")}
                    </span>
                  </div>
                </div>
                {language === 'en' && (
                  <CheckCircle2 className="w-5 h-5 text-[#b8860b]" />
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#e8decb]/60 flex items-center justify-between text-xs text-[#786452]">
                <span>{t("standardTerms")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Script Mode Options (Only visible when Hindi selected) */}
        {language === 'hi' && (
          <div className="pt-4 border-t border-[#f0e6d5] space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#786452] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{t("scriptModeTitle")}</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setScriptMode('devanagari')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  scriptMode === 'devanagari'
                    ? 'bg-[#1c1008] text-[#f5d061] border-[#d4af37] font-semibold'
                    : 'bg-[#faf6f0] text-[#4a3625] border-[#e8decb] hover:bg-[#f3ebe0]'
                }`}
              >
                <span className="text-sm">{t("devanagariScript")}</span>
                {scriptMode === 'devanagari' && <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />}
              </button>

              <button
                type="button"
                onClick={() => setScriptMode('hinglish')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  scriptMode === 'hinglish'
                    ? 'bg-[#1c1008] text-[#f5d061] border-[#d4af37] font-semibold'
                    : 'bg-[#faf6f0] text-[#4a3625] border-[#e8decb] hover:bg-[#f3ebe0]'
                }`}
              >
                <span className="text-sm">{t("hinglishScript")}</span>
                {scriptMode === 'hinglish' && <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Jewellery Units & Business Options Card */}
      <div className="bg-[#fffdfa] rounded-2xl p-6 border border-[#e8decb] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#f0e6d5] pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5cf6e] to-[#b8860b] text-[#1a0f07] flex items-center justify-center shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2c1d11]">
              {t("unitSectionTitle")}
            </h2>
            <p className="text-xs text-[#786452]">
              {t("unitSectionSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#786452] block">
              {t("weightUnit")}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setWeightUnit('gram')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  weightUnit === 'gram'
                    ? 'bg-[#1c1008] text-[#f5d061] border-[#d4af37]'
                    : 'bg-[#faf6f0] text-[#4a3625] border-[#e8decb] hover:bg-[#f3ebe0]'
                }`}
              >
                {t("gramUnit")}
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('tola')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  weightUnit === 'tola'
                    ? 'bg-[#1c1008] text-[#f5d061] border-[#d4af37]'
                    : 'bg-[#faf6f0] text-[#4a3625] border-[#e8decb] hover:bg-[#f3ebe0]'
                }`}
              >
                {t("tolaUnit")}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#786452] block">
              {t("rateDisplay")}
            </label>
            <div className="flex gap-2">
              <span className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#fdf5e6] text-[#855e24] border border-[#f0d89c] text-center">
                {t("ratePer10g")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt & WhatsApp Notification Settings */}
      <div className="bg-[#fffdfa] rounded-2xl p-6 border border-[#e8decb] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#f0e6d5] pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5cf6e] to-[#b8860b] text-[#1a0f07] flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2c1d11]">
              {t("billSectionTitle")}
            </h2>
            <p className="text-xs text-[#786452]">
              {t("billSectionSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#786452] block">
              {t("receiptLanguage")}
            </label>
            <div className="p-3 bg-[#faf6f0] border border-[#e8decb] rounded-xl flex items-center justify-between text-xs font-bold text-[#2c1d11]">
              <span>{t("bilingualReceipt")}</span>
              <Check className="w-4 h-4 text-[#b8860b]" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#786452] block">
              {t("whatsappNotifications")}
            </label>
            <button
              type="button"
              onClick={() => setWhatsappAlerts(!whatsappAlerts)}
              className={`w-full p-3 border rounded-xl text-left transition-all cursor-pointer flex items-center justify-between text-xs font-semibold ${
                whatsappAlerts
                  ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#1b5e20]'
                  : 'bg-[#faf6f0] border-[#e8decb] text-[#786452]'
              }`}
            >
              <span>{t("whatsappDesc")}</span>
              {whatsappAlerts && <CheckCircle2 className="w-4 h-4 text-[#2e7d32]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Live Interface Preview */}
      <div className="bg-[#fffdfa] rounded-2xl p-6 border border-[#e8decb] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#f0e6d5] pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5cf6e] to-[#b8860b] text-[#1a0f07] flex items-center justify-center shadow-md">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#2c1d11]">
              {t("previewTitle")}
            </h2>
            <p className="text-xs text-[#786452]">
              {t("previewSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf6f0] to-[#f5ebd9] border border-[#e8decb]">
            <span className="text-xs text-[#786452] font-semibold">{t("goldRateLabel")}</span>
            <p className="text-lg font-extrabold text-[#2c1d11] mt-1">{t("sampleGoldVal")}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf6f0] to-[#f5ebd9] border border-[#e8decb]">
            <span className="text-xs text-[#786452] font-semibold">{t("todaySalesLabel")}</span>
            <p className="text-lg font-extrabold text-[#2c1d11] mt-1">{t("sampleSalesVal")}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf6f0] to-[#f5ebd9] border border-[#e8decb]">
            <span className="text-xs text-[#786452] font-semibold">{t("udhaarBalanceLabel")}</span>
            <p className="text-lg font-extrabold text-[#8b0000] mt-1">{t("sampleUdhaarVal")}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf6f0] to-[#f5ebd9] border border-[#e8decb]">
            <span className="text-xs text-[#786452] font-semibold">{t("karigarBalanceLabel")}</span>
            <p className="text-lg font-extrabold text-[#1b5e20] mt-1">{t("sampleKarigarVal")}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf6f0] to-[#f5ebd9] border border-[#e8decb]">
            <span className="text-xs text-[#786452] font-semibold">{t("customerJamaLabel")}</span>
            <p className="text-lg font-extrabold text-[#b8860b] mt-1">{t("sampleJamaVal")}</p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf6f0] to-[#f5ebd9] border border-[#e8decb]">
            <span className="text-xs text-[#786452] font-semibold">{t("silverRateLabel")}</span>
            <p className="text-lg font-extrabold text-[#2c1d11] mt-1">{t("sampleSilverVal")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;