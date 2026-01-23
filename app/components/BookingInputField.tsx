'use client';

interface BookingInputFieldProps {
  label: string;
  type: 'text' | 'number' | 'date' | 'currency';
  value: string | number | Date | null;
  onChange?: (value: any) => void;
  readOnly?: boolean;
  highlighted?: boolean;
  icon?: 'calendar' | 'dollar';
}

export default function BookingInputField({
  label,
  type,
  value,
  onChange,
  readOnly = false,
  highlighted = false,
  icon,
}: BookingInputFieldProps) {
  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const getDisplayValue = (): string => {
    if (value === null || value === undefined) return '';

    if (type === 'currency') {
      return formatCurrency(value as number);
    }

    if (type === 'date' && value instanceof Date) {
      return value.toISOString().split('T')[0];
    }

    return String(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange || readOnly) return;

    if (type === 'number') {
      onChange(parseInt(e.target.value) || 0);
    } else if (type === 'date') {
      onChange(new Date(e.target.value));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="relative">
      <label className="block text-slate-400 text-xs uppercase mb-1 font-medium tracking-wide">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon === 'calendar' && (
          <svg
            className="absolute left-3 w-5 h-5 text-slate-500 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        )}

        {icon === 'dollar' && !readOnly && (
          <span className="absolute left-3 text-slate-400 pointer-events-none">$</span>
        )}

        <input
          type={type === 'currency' ? 'text' : type}
          value={getDisplayValue()}
          onChange={handleChange}
          readOnly={readOnly}
          className={`
            w-full px-4 py-3 bg-slate-800 border rounded-lg transition-all
            ${icon === 'calendar' ? 'pl-10' : ''}
            ${icon === 'dollar' && !readOnly ? 'pl-7' : ''}
            ${readOnly
              ? 'border-slate-700 text-slate-300 cursor-not-allowed'
              : 'border-slate-600 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50'
            }
            ${highlighted
              ? 'border-amber-500 text-amber-400 font-bold text-lg bg-slate-800/80'
              : ''
            }
          `}
        />
      </div>
    </div>
  );
}
