// Delete Confirmation Dialog component
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Spinner,
} from '@chakra-ui/react';
import { useRef } from 'react';

export interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export const DeleteConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = 'Delete Mock Data?',
  description = 'Are you sure you want to delete all mock data? This action cannot be undone and will remove all mock transactions, receipts, and bank accounts.',
}: DeleteConfirmationDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog
      isOpen={open}
      leastDestructiveRef={cancelRef}
      onClose={handleClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>{description}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirm}
              ml={3}
              isLoading={isLoading}
              loadingText="Deleting..."
              disabled={isLoading}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};
