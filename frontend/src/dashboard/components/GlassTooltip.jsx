import { currencyFormatter } from "../../utils/currencyFormatter.js";



const GlassTooltip = ({ active, payload, label, isCurrency = true }) => {


    const decimalFormatter = (value) => new Intl.NumberFormat("en-US").format(value);


    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3.5 rounded-xl shadow-xl flex flex-col gap-1 text-left text-xs font-semibold text-white">
                <p className="text-slate-300 font-medium">{label}</p>
                {payload.map((item, idx) => (
                    <p key={idx} className="flex items-center gap-2" style={{ color: item.stroke || item.fill }}>
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.stroke || item.fill }} />
                        <span>
                            {item.name}: {isCurrency ? currencyFormatter(item.value) : decimalFormatter(item.value)}
                        </span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default GlassTooltip;