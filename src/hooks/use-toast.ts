// Chakra UI toast wrapper - maintains compatibility with shadcn useToast API
import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react';

type ToastVariant = 'default' | 'destructive' | 'success';
type ToastStatus = 'info' | 'warning' | 'success' | 'error' | 'loading';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  status?: ToastStatus;
  duration?: number;
  isClosable?: boolean;
}

// Map shadcn variants to Chakra UI status
const variantToStatus = (variant?: ToastVariant): ToastStatus => {
  switch (variant) {
    case 'destructive':
      return 'error';
    case 'success':
      return 'success';
    case 'default':
    default:
      return 'info';
  }
};

export function useToast() {
  const chakraToast = useChakraToast();

  const toast = ({ title, description, variant, status, duration = 5000, isClosable = true }: ToastProps) => {
    const toastStatus = status || variantToStatus(variant);

    return chakraToast({
      title,
      description,
      status: toastStatus,
      duration,
      isClosable,
      position: 'bottom-right',
    });
  };

  return {
    toast,
    toasts: [],
    dismiss: (toastId?: string) => {
      if (toastId) {
        chakraToast.close(toastId);
      } else {
        chakraToast.closeAll();
      }
    },
  };
}

// Export standalone toast function for convenience
export const toast = ({ title, description, variant, status, duration = 5000, isClosable = true }: ToastProps) => {
  // This is a simplified version for standalone usage
  // In practice, you should use useToast() hook within components
  console.warn('Using standalone toast function. Consider using useToast() hook instead.');
};
