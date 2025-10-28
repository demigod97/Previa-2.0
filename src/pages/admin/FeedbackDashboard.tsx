/**
 * Admin Feedback Dashboard
 * Story: 8.1 Public Feedback Portal - Task 8
 *
 * Admin-only page for managing public feedback submissions.
 * Features AG-Grid table, filters, status updates, and screenshot viewer.
 */

import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridReadyEvent } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useUserRole } from '@/hooks/useUserRole'
import { ArrowLeft, Eye, Edit } from 'lucide-react'

interface FeedbackRow {
  id: string
  feedback_type: string
  title: string
  status: string
  severity?: string
  priority?: string
  user_email?: string
  screenshot_url?: string
  created_at: string
  description: string
  admin_notes?: string
}

/**
 * Admin Feedback Dashboard - Protected admin page
 *
 * Features:
 * - AG-Grid table with all feedback submissions
 * - Filterable columns (type, status, priority, date)
 * - Status update modal with admin notes
 * - Screenshot lightbox viewer
 * - Row actions (view details, update status)
 * - Real-time data refresh
 */
export default function FeedbackDashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const queryClient = useQueryClient()
  const { isAdministrator, isLoading: roleLoading } = useUserRole()

  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackRow | null>(null)
  const { isOpen: isStatusModalOpen, onOpen: onStatusModalOpen, onClose: onStatusModalClose } = useDisclosure()
  const { isOpen: isScreenshotModalOpen, onOpen: onScreenshotModalOpen, onClose: onScreenshotModalClose } = useDisclosure()
  const [newStatus, setNewStatus] = useState<string>('')
  const [adminNotes, setAdminNotes] = useState<string>('')

  // Fetch feedback submissions
  const { data: feedbackData, isLoading: dataLoading } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('public_feedback')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FeedbackRow[]
    },
    enabled: isAdministrator(),
  })

  // Update feedback status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { data, error } = await supabase
        .from('public_feedback')
        .update({
          status,
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] })
      toast({
        title: 'Status updated',
        description: 'Feedback status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onStatusModalClose()
    },
    onError: (error: any) => {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update feedback status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  // Handle status update
  const handleStatusUpdate = () => {
    if (!selectedFeedback || !newStatus) return

    updateStatusMutation.mutate({
      id: selectedFeedback.id,
      status: newStatus,
      notes: adminNotes,
    })
  }

  // Open status update modal
  const openStatusModal = useCallback((feedback: FeedbackRow) => {
    setSelectedFeedback(feedback)
    setNewStatus(feedback.status)
    setAdminNotes(feedback.admin_notes || '')
    onStatusModalOpen()
  }, [onStatusModalOpen])

  // Open screenshot modal
  const openScreenshotModal = useCallback((feedback: FeedbackRow) => {
    setSelectedFeedback(feedback)
    onScreenshotModalOpen()
  }, [onScreenshotModalOpen])

  // AG-Grid column definitions
  const columnDefs = useMemo<ColDef<FeedbackRow>[]>(() => [
    {
      headerName: 'Type',
      field: 'feedback_type',
      width: 130,
      cellRenderer: (params: any) => {
        const typeColors: Record<string, string> = {
          bug: 'red',
          error: 'red',
          feature: 'purple',
          improvement: 'blue',
          other: 'gray',
        }
        return (
          <Badge colorScheme={typeColors[params.value] || 'gray'}>
            {params.value}
          </Badge>
        )
      },
      filter: 'agSetColumnFilter',
    },
    {
      headerName: 'Title',
      field: 'title',
      flex: 2,
      minWidth: 250,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 140,
      cellRenderer: (params: any) => {
        const statusColors: Record<string, string> = {
          new: 'blue',
          acknowledged: 'yellow',
          in_progress: 'orange',
          resolved: 'green',
          wont_fix: 'gray',
        }
        return (
          <Badge colorScheme={statusColors[params.value] || 'gray'}>
            {params.value.replace('_', ' ')}
          </Badge>
        )
      },
      filter: 'agSetColumnFilter',
    },
    {
      headerName: 'Priority',
      field: 'priority',
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value) return <Text color="gray.500">-</Text>
        const priorityColors: Record<string, string> = {
          low: 'gray',
          medium: 'blue',
          high: 'orange',
          urgent: 'red',
        }
        return (
          <Badge colorScheme={priorityColors[params.value] || 'gray'}>
            {params.value}
          </Badge>
        )
      },
      filter: 'agSetColumnFilter',
    },
    {
      headerName: 'Severity',
      field: 'severity',
      width: 120,
      cellRenderer: (params: any) => {
        if (!params.value) return <Text color="gray.500">-</Text>
        const severityColors: Record<string, string> = {
          low: 'green',
          medium: 'yellow',
          high: 'orange',
          critical: 'red',
        }
        return (
          <Badge colorScheme={severityColors[params.value] || 'gray'}>
            {params.value}
          </Badge>
        )
      },
      filter: 'agSetColumnFilter',
    },
    {
      headerName: 'Email',
      field: 'user_email',
      width: 200,
      filter: 'agTextColumnFilter',
      cellRenderer: (params: any) => (
        params.value ? <Text fontSize="sm">{params.value}</Text> : <Text color="gray.500">-</Text>
      ),
    },
    {
      headerName: 'Date',
      field: 'created_at',
      width: 130,
      valueFormatter: (params: any) => {
        return new Date(params.value).toLocaleDateString()
      },
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Actions',
      width: 180,
      pinned: 'right',
      cellRenderer: (params: any) => (
        <HStack spacing={2} py={2}>
          <Button
            size="sm"
            leftIcon={<Edit size={14} />}
            onClick={() => openStatusModal(params.data)}
            variant="outline"
            colorScheme="purple"
          >
            Update
          </Button>
          {params.data.screenshot_url && (
            <Button
              size="sm"
              leftIcon={<Eye size={14} />}
              onClick={() => openScreenshotModal(params.data)}
              variant="ghost"
              colorScheme="blue"
            >
              View
            </Button>
          )}
        </HStack>
      ),
    },
  ], [openStatusModal, openScreenshotModal])

  // Default column properties
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    filter: true,
  }), [])

  // Handle grid ready
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit()
  }, [])

  // Check admin access
  if (roleLoading) {
    return (
      <DashboardLayout>
        <VStack minH="60vh" justify="center">
          <Spinner size="xl" color="purple.500" />
          <Text>Loading...</Text>
        </VStack>
      </DashboardLayout>
    )
  }

  if (!isAdministrator()) {
    return (
      <DashboardLayout>
        <VStack minH="60vh" justify="center" textAlign="center" spacing={4}>
          <Heading size="lg" color="red.500">Access Denied</Heading>
          <Text color="gray.600">You don't have permission to access this page.</Text>
          <Button onClick={() => navigate('/dashboard')} leftIcon={<ArrowLeft size={18} />}>
            Back to Dashboard
          </Button>
        </VStack>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <VStack align="stretch" spacing={6} p={6}>
        {/* Header */}
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="lg" color="previa.charcoal">Feedback Management</Heading>
            <Text color="previa.stone">Manage public feedback submissions</Text>
          </VStack>
          <Button
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/dashboard')}
            variant="ghost"
          >
            Back to Dashboard
          </Button>
        </HStack>

        {/* Stats Summary */}
        {feedbackData && (
          <HStack spacing={4} flexWrap="wrap">
            <Box bg="blue.50" p={4} borderRadius="md" minW="150px">
              <Text fontSize="sm" color="blue.700" fontWeight="medium">Total</Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">{feedbackData.length}</Text>
            </Box>
            <Box bg="yellow.50" p={4} borderRadius="md" minW="150px">
              <Text fontSize="sm" color="yellow.700" fontWeight="medium">New</Text>
              <Text fontSize="2xl" fontWeight="bold" color="yellow.600">
                {feedbackData.filter(f => f.status === 'new').length}
              </Text>
            </Box>
            <Box bg="orange.50" p={4} borderRadius="md" minW="150px">
              <Text fontSize="sm" color="orange.700" fontWeight="medium">In Progress</Text>
              <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                {feedbackData.filter(f => f.status === 'in_progress').length}
              </Text>
            </Box>
            <Box bg="green.50" p={4} borderRadius="md" minW="150px">
              <Text fontSize="sm" color="green.700" fontWeight="medium">Resolved</Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {feedbackData.filter(f => f.status === 'resolved').length}
              </Text>
            </Box>
          </HStack>
        )}

        {/* AG-Grid Table */}
        <Box className="ag-theme-quartz" height="600px" bg="white" borderRadius="md" overflow="hidden" boxShadow="sm">
          {dataLoading ? (
            <VStack justify="center" h="full">
              <Spinner size="xl" color="purple.500" />
              <Text>Loading feedback...</Text>
            </VStack>
          ) : (
            <AgGridReact
              rowData={feedbackData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              pagination={true}
              paginationPageSize={20}
              animateRows={true}
              rowHeight={60}
            />
          )}
        </Box>

        {/* Status Update Modal */}
        <Modal isOpen={isStatusModalOpen} onClose={onStatusModalClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Feedback Status</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="semibold" mb={1}>Title:</Text>
                  <Text color="gray.600">{selectedFeedback?.title}</Text>
                </Box>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="wont_fix">Won't Fix</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Admin Notes</FormLabel>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this feedback..."
                    rows={4}
                  />
                </FormControl>

                <HStack justify="flex-end" spacing={3}>
                  <Button onClick={onStatusModalClose} variant="ghost">Cancel</Button>
                  <Button
                    colorScheme="purple"
                    onClick={handleStatusUpdate}
                    isLoading={updateStatusMutation.isPending}
                  >
                    Update Status
                  </Button>
                </HStack>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Screenshot Lightbox Modal */}
        <Modal isOpen={isScreenshotModalOpen} onClose={onScreenshotModalClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Screenshot</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedFeedback?.screenshot_url && (
                <Image
                  src={selectedFeedback.screenshot_url}
                  alt="Feedback screenshot"
                  maxH="70vh"
                  mx="auto"
                  borderRadius="md"
                  objectFit="contain"
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </DashboardLayout>
  )
}
