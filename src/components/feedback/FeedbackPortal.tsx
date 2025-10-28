/**
 * FeedbackPortal Component
 * Story: 8.1 Public Feedback Portal
 *
 * Main modal controller for public feedback submissions.
 * Displays wizard interface for bug reports, feature requests, and general feedback.
 */

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react'
import { FeedbackWizard } from './FeedbackWizard'
import previaLogo from '/previa-logo.svg' // Adjust path as needed

interface FeedbackPortalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback when modal should close */
  onClose: () => void
}

/**
 * FeedbackPortal - Main modal for public feedback submissions
 *
 * Features:
 * - Responsive modal (full screen on mobile, 3xl on desktop)
 * - Previa branding with logo
 * - Wizard-based multi-step form
 * - Keyboard navigation (Esc to close)
 *
 * @example
 * ```tsx
 * const { isOpen, onOpen, onClose } = useDisclosure()
 *
 * <Button onClick={onOpen}>Report Feedback</Button>
 * <FeedbackPortal isOpen={isOpen} onClose={onClose} />
 * ```
 */
export const FeedbackPortal: React.FC<FeedbackPortalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: '3xl' }}
      isCentered
      closeOnOverlayClick={false} // Prevent accidental closes during form filling
      scrollBehavior="inside"
    >
      <ModalOverlay backdropFilter="blur(4px)" />

      <ModalContent bg="previa.cream" borderRadius={{ base: 0, md: 'xl' }} maxH="90vh">
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Image
              src={previaLogo}
              alt="Previa Logo"
              h={8}
              objectFit="contain"
            />
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="semibold"
              color="previa.charcoal"
            >
              Help Us Improve Previa
            </Text>
          </Flex>
        </ModalHeader>

        <ModalCloseButton color="previa.charcoal" />

        <ModalBody pb={6}>
          <FeedbackWizard onComplete={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
