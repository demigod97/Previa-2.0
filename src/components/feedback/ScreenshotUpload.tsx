/**
 * ScreenshotUpload Component
 * Story: 8.1 Public Feedback Portal - Task 4
 *
 * File upload with drag-drop and validation.
 */

import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
  Image,
  useToast,
} from '@chakra-ui/react'
import { Upload, X, FileImage } from 'lucide-react'
import { useRef, useState } from 'react'

interface ScreenshotUploadProps {
  value?: File
  onChange: (file: File | undefined) => void
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
const ACCEPTED_EXTENSIONS = '.png,.jpg,.jpeg,.pdf'

/**
 * ScreenshotUpload - Drag-drop file upload with validation
 *
 * Features:
 * - Drag-and-drop zone
 * - File picker button
 * - File size validation (max 5MB)
 * - File type validation (PNG, JPG, PDF)
 * - Image preview for uploaded files
 * - Remove file functionality
 *
 * @example
 * ```tsx
 * <ScreenshotUpload
 *   value={screenshot}
 *   onChange={(file) => setScreenshot(file)}
 * />
 * ```
 */
export const ScreenshotUpload: React.FC<ScreenshotUploadProps> = ({ value, onChange }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [preview, setPreview] = useState<string>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PNG, JPG, or PDF file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: `File must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return false
    }

    return true
  }

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onChange(file)

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(undefined)
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleRemove = () => {
    onChange(undefined)
    setPreview(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleBrowse = () => {
    fileInputRef.current?.click()
  }

  // Display uploaded file
  if (value) {
    return (
      <Box
        bg="white"
        border="2px solid"
        borderColor="green.500"
        borderRadius="lg"
        p={4}
      >
        <HStack justify="space-between" align="start">
          <HStack spacing={3} flex="1">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                boxSize="80px"
                objectFit="cover"
                borderRadius="md"
              />
            ) : (
              <Box
                boxSize="80px"
                bg="gray.100"
                borderRadius="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FileImage} boxSize={8} color="gray.500" />
              </Box>
            )}

            <VStack align="start" spacing={0} flex="1">
              <Text fontSize="sm" fontWeight="medium" color="previa.charcoal">
                {value.name}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {(value.size / 1024).toFixed(1)} KB
              </Text>
            </VStack>
          </HStack>

          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            leftIcon={<X size={16} />}
            onClick={handleRemove}
          >
            Remove
          </Button>
        </HStack>
      </Box>
    )
  }

  // Display upload zone
  return (
    <Box
      bg={isDragOver ? 'purple.50' : 'white'}
      border="2px dashed"
      borderColor={isDragOver ? 'purple.500' : 'previa.sand'}
      borderRadius="lg"
      p={8}
      textAlign="center"
      transition="all 0.2s"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      cursor="pointer"
      onClick={handleBrowse}
      _hover={{
        borderColor: 'previa.darkStone',
        bg: 'gray.50',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <VStack spacing={3}>
        <Box
          p={3}
          bg={isDragOver ? 'purple.100' : 'gray.100'}
          borderRadius="full"
          transition="all 0.2s"
        >
          <Icon as={Upload} boxSize={8} color={isDragOver ? 'purple.600' : 'gray.600'} />
        </Box>

        <VStack spacing={1}>
          <Text fontSize="md" fontWeight="medium" color="previa.charcoal">
            Drag & drop your file here
          </Text>
          <Text fontSize="sm" color="previa.stone">
            or click to browse
          </Text>
        </VStack>

        <Text fontSize="xs" color="gray.500">
          PNG, JPG, or PDF (max 5MB)
        </Text>
      </VStack>
    </Box>
  )
}
