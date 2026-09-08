// // shared/ui/toast.ts
import toast from 'react-hot-toast'

const baseStyle = {
  borderRadius: '12px',
  padding: '12px 16px',
  fontSize: '14px',
  backdropFilter: 'blur(6px)',
}

export const Toast = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        ...baseStyle,
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        color: '#6ee7b7',
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        ...baseStyle,
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#fca5a5',
      },
    }),

  info: (message: string) =>
    toast(message, {
      style: {
        ...baseStyle,
        background: 'rgba(34, 211, 238, 0.1)',
        border: '1px solid rgba(34, 211, 238, 0.4)',
        color: '#67e8f9',
      },
    }),
}


