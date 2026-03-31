import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';
import type { Toast } from 'react-hot-toast';

interface CustomToastProps {
  toast: Toast;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  onDismiss: () => void;
}

const config = {
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-l-blue-500',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-700',
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-l-green-500',
    iconColor: 'text-green-500',
    titleColor: 'text-green-700',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-l-red-500',
    iconColor: 'text-red-500',
    titleColor: 'text-red-700',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-l-yellow-500',
    iconColor: 'text-yellow-500',
    titleColor: 'text-yellow-700',
  },
};

export function CustomToast({
  toast: t,
  title,
  message,
  type,
  onDismiss,
}: CustomToastProps) {
  const { icon: Icon, bg, border, iconColor, titleColor } = config[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border-l-4 ${border} ${bg} px-4 py-3 shadow-sm min-w-72 max-w-sm ${
        t.visible ? 'animate-enter' : 'animate-leave'
      }`}
    >
      <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${titleColor}`}>{title}</p>
        {message && <p className="text-xs text-gray-600 mt-0.5">{message}</p>}
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
