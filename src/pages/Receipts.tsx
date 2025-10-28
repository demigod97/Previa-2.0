/**
 * Receipts Library Page
 * Browse, search, filter, and manage all receipts
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Flex,
  Grid,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Icon,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  Stack,
  Divider,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import {
  Search,
  Filter,
  Grid as GridIcon,
  List,
  SortAsc,
  SortDesc,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  Calendar,
  DollarSign,
  MoreVertical,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout';
import { ReceiptService } from '@/services/receiptService';
import { StatusBadge } from '@/components/receipt/StatusBadge';
import { ConfidenceIndicator } from '@/components/receipt/ConfidenceIndicator';
import {
  inferCategory,
  getCategoryColor,
  getCategoryIcon,
  getAllCategories,
  type ExpenseCategory,
} from '@/utils/categoryInference';
import type { MockReceipt } from '@/test/fixtures/receipt-mock-data';

type ViewMode = 'grid' | 'list';
type SortField = 'date' | 'amount' | 'confidence';
type SortOrder = 'asc' | 'desc';

interface Filters {
  status: string[];
  categories: string[];
  dateRange: [number, number]; // days ago
  amountRange: [number, number]; // cents
}

/**
 * Receipts Library Page
 */
export function Receipts() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen: isFilterOpen, onOpen: onFilterOpen, onClose: onFilterClose } = useDisclosure();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<Filters>({
    status: [],
    categories: [],
    dateRange: [0, 90], // Last 90 days
    amountRange: [0, 100000], // $0 to $1000
  });

  // Fetch all receipts
  const {
    data: receipts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['all-receipts'],
    queryFn: () => ReceiptService.fetchReceipts(),
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['receipt-stats'],
    queryFn: () => ReceiptService.getReceiptStats(),
  });

  // Filter, search, and sort receipts
  const filteredReceipts = receipts
    ?.filter((receipt) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesMerchant = receipt.merchant?.toLowerCase().includes(query);
        const matchesCategory = receipt.category?.toLowerCase().includes(query);
        if (!matchesMerchant && !matchesCategory) return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(receipt.processing_status)) {
        return false;
      }

      // Category filter
      const category = receipt.category || inferCategory(receipt.merchant);
      if (filters.categories.length > 0 && !filters.categories.includes(category)) {
        return false;
      }

      // Date range filter
      if (receipt.receipt_date) {
        const receiptDate = new Date(receipt.receipt_date);
        const now = new Date();
        const daysAgo = Math.floor((now.getTime() - receiptDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysAgo < filters.dateRange[0] || daysAgo > filters.dateRange[1]) {
          return false;
        }
      }

      // Amount range filter
      if (receipt.amount) {
        if (receipt.amount < filters.amountRange[0] || receipt.amount > filters.amountRange[1]) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'date':
          const dateA = new Date(a.receipt_date || a.created_at).getTime();
          const dateB = new Date(b.receipt_date || b.created_at).getTime();
          comparison = dateA - dateB;
          break;
        case 'amount':
          comparison = (a.amount || 0) - (b.amount || 0);
          break;
        case 'confidence':
          comparison = (a.confidence_score || 0) - (b.confidence_score || 0);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Calculate total amount
  const totalAmount = filteredReceipts?.reduce((sum, r) => sum + (r.amount || 0), 0) || 0;

  return (
    <DashboardLayout>
      <Container maxW="container.xl" py={8}>
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Heading size="lg">Receipts Library</Heading>
          <Text color="gray.600">
            {filteredReceipts?.length || 0} receipt{filteredReceipts?.length !== 1 ? 's' : ''}
            {totalAmount > 0 && ` · Total: $${(totalAmount / 100).toFixed(2)}`}
          </Text>
        </Box>

        <Flex gap={2}>
          <Button leftIcon={<Icon as={Upload} />} colorScheme="purple" onClick={() => navigate('/upload')}>
            Upload Receipt
          </Button>
          <IconButton
            icon={<Icon as={RefreshCw} />}
            aria-label="Refresh"
            onClick={() => refetch()}
            variant="outline"
          />
        </Flex>
      </Flex>

      {/* Stats Bar */}
      {stats && (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4} mb={6}>
          <Card>
            <CardBody py={3}>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Total
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {stats.total}
                </Text>
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardBody py={3}>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Completed
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {stats.completed}
                </Text>
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardBody py={3}>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Processing
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {stats.processing + stats.pending}
                </Text>
              </Flex>
            </CardBody>
          </Card>

          <Card>
            <CardBody py={3}>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.600">
                  Failed
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {stats.failed}
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </Grid>
      )}

      {/* Toolbar */}
      <Flex gap={4} mb={6} direction={{ base: 'column', md: 'row' }} wrap="wrap">
        {/* Search */}
        <InputGroup maxW={{ base: '100%', md: '400px' }}>
          <InputLeftElement>
            <Icon as={Search} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search receipts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>

        {/* Sort */}
        <Select maxW={{ base: '100%', md: '200px' }} value={sortField} onChange={(e) => setSortField(e.target.value as SortField)}>
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="confidence">Sort by Confidence</option>
        </Select>

        <IconButton
          icon={<Icon as={sortOrder === 'asc' ? SortAsc : SortDesc} />}
          aria-label="Sort order"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          variant="outline"
        />

        {/* Filters */}
        <Button leftIcon={<Icon as={Filter} />} onClick={onFilterOpen} variant="outline">
          Filters
          {(filters.status.length > 0 || filters.categories.length > 0) && (
            <Badge ml={2} colorScheme="purple">
              {filters.status.length + filters.categories.length}
            </Badge>
          )}
        </Button>

        <Flex gap={2} ml="auto">
          <IconButton
            icon={<Icon as={GridIcon} />}
            aria-label="Grid view"
            onClick={() => setViewMode('grid')}
            variant={viewMode === 'grid' ? 'solid' : 'outline'}
            colorScheme={viewMode === 'grid' ? 'purple' : 'gray'}
          />
          <IconButton
            icon={<Icon as={List} />}
            aria-label="List view"
            onClick={() => setViewMode('list')}
            variant={viewMode === 'list' ? 'solid' : 'outline'}
            colorScheme={viewMode === 'list' ? 'purple' : 'gray'}
          />
        </Flex>
      </Flex>

      {/* Error State */}
      {error && (
        <Alert status="error" mb={6}>
          <AlertIcon />
          <AlertTitle>Failed to load receipts</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Flex justify="center" align="center" minH="400px">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      )}

      {/* Empty State */}
      {!isLoading && filteredReceipts?.length === 0 && (
        <Card>
          <CardBody py={16}>
            <Flex direction="column" align="center" gap={4}>
              <Icon as={Upload} boxSize={16} color="gray.300" />
              <Heading size="md" color="gray.600">
                No receipts found
              </Heading>
              <Text color="gray.500" textAlign="center">
                {searchQuery || filters.status.length > 0 || filters.categories.length > 0
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first receipt to get started'}
              </Text>
              {!searchQuery && filters.status.length === 0 && filters.categories.length === 0 && (
                <Button colorScheme="purple" leftIcon={<Icon as={Upload} />} onClick={() => navigate('/upload')}>
                  Upload Receipt
                </Button>
              )}
            </Flex>
          </CardBody>
        </Card>
      )}

      {/* Receipts Grid/List */}
      {!isLoading && filteredReceipts && filteredReceipts.length > 0 && (
        <>
          {viewMode === 'grid' ? (
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
              {filteredReceipts.map((receipt) => (
                <ReceiptGridCard key={receipt.id} receipt={receipt} onViewDetails={(id) => navigate(`/receipts/${id}`)} />
              ))}
            </Grid>
          ) : (
            <Stack spacing={4}>
              {filteredReceipts.map((receipt) => (
                <ReceiptListCard key={receipt.id} receipt={receipt} onViewDetails={(id) => navigate(`/receipts/${id}`)} />
              ))}
            </Stack>
          )}
        </>
      )}

      {/* Filters Drawer */}
      <FiltersDrawer
        isOpen={isFilterOpen}
        onClose={onFilterClose}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Filter Drawer Component (defined below) */}
    </Container>
    </DashboardLayout>
  );
}

export default Receipts;

/**
 * ReceiptGridCard Component (Helper component for grid view)
 */
interface ReceiptCardProps {
  receipt: MockReceipt;
  onViewDetails: (id: string) => void;
}

function ReceiptGridCard({ receipt, onViewDetails }: ReceiptCardProps) {
  const category = receipt.category || inferCategory(receipt.merchant);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);

  return (
    <Card
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => receipt.processing_status === 'completed' && onViewDetails(receipt.id)}
    >
      <CardBody>
        <Flex direction="column" gap={3}>
          <Flex justify="space-between" align="start">
            <Flex gap={2} align="center" flex={1}>
              <Text fontSize="2xl">{categoryIcon}</Text>
              <Box flex={1} minW={0}>
                <Text fontWeight="bold" noOfLines={1}>
                  {receipt.merchant || 'Unknown'}
                </Text>
                <Badge colorScheme={categoryColor} fontSize="xs">
                  {category}
                </Badge>
              </Box>
            </Flex>
          </Flex>

          <StatusBadge status={receipt.processing_status} size="sm" />

          {receipt.processing_status === 'completed' && (
            <Flex justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" color="purple.600">
                ${((receipt.amount || 0) / 100).toFixed(2)}
              </Text>
              {receipt.confidence_score && (
                <ConfidenceIndicator score={receipt.confidence_score} size="sm" variant="icon" />
              )}
            </Flex>
          )}

          <Text fontSize="sm" color="gray.600">
            {receipt.receipt_date || new Date(receipt.created_at).toLocaleDateString('en-AU')}
          </Text>
        </Flex>
      </CardBody>
    </Card>
  );
}

/**
 * ReceiptListCard Component
 */
function ReceiptListCard({ receipt, onViewDetails }: ReceiptCardProps) {
  const category = receipt.category || inferCategory(receipt.merchant);
  const categoryColor = getCategoryColor(category);
  const categoryIcon = getCategoryIcon(category);

  return (
    <Card
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => receipt.processing_status === 'completed' && onViewDetails(receipt.id)}
    >
      <CardBody>
        <Flex justify="space-between" align="center" gap={4}>
          <Flex gap={3} align="center" flex={1} minW={0}>
            <Text fontSize="2xl">{categoryIcon}</Text>
            <Box flex={1} minW={0}>
              <Text fontWeight="bold" noOfLines={1}>
                {receipt.merchant || 'Unknown Merchant'}
              </Text>
              <Flex gap={2} align="center">
                <Badge colorScheme={categoryColor} fontSize="xs">
                  {category}
                </Badge>
                <Text fontSize="xs" color="gray.600">
                  {receipt.receipt_date || new Date(receipt.created_at).toLocaleDateString('en-AU')}
                </Text>
              </Flex>
            </Box>
          </Flex>

          <Flex gap={4} align="center">
            <StatusBadge status={receipt.processing_status} size="sm" />

            {receipt.processing_status === 'completed' && (
              <>
                <Text fontSize="lg" fontWeight="bold" color="purple.600" minW="100px" textAlign="right">
                  ${((receipt.amount || 0) / 100).toFixed(2)}
                </Text>
                {receipt.confidence_score && (
                  <ConfidenceIndicator score={receipt.confidence_score} size="sm" variant="icon" />
                )}
              </>
            )}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
}

/**
 * FiltersDrawer Component
 */
interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

function FiltersDrawer({ isOpen, onClose, filters, onFiltersChange }: FiltersDrawerProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      status: [],
      categories: [],
      dateRange: [0, 90],
      amountRange: [0, 100000],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filter Receipts</DrawerHeader>

        <DrawerBody>
          <Stack spacing={6}>
            {/* Status Filter */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Status
              </Text>
              <CheckboxGroup value={localFilters.status} onChange={(value) => setLocalFilters({ ...localFilters, status: value as string[] })}>
                <Stack spacing={2}>
                  <Checkbox value="pending">Pending</Checkbox>
                  <Checkbox value="processing">Processing</Checkbox>
                  <Checkbox value="completed">Completed</Checkbox>
                  <Checkbox value="failed">Failed</Checkbox>
                </Stack>
              </CheckboxGroup>
            </Box>

            <Divider />

            {/* Category Filter */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Categories
              </Text>
              <CheckboxGroup
                value={localFilters.categories}
                onChange={(value) => setLocalFilters({ ...localFilters, categories: value as string[] })}
              >
                <Stack spacing={2} maxH="300px" overflowY="auto">
                  {getAllCategories().map((category) => (
                    <Checkbox key={category} value={category}>
                      <Flex gap={2} align="center">
                        <Text>{getCategoryIcon(category)}</Text>
                        <Text fontSize="sm">{category}</Text>
                      </Flex>
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            </Box>

            <Divider />

            {/* Actions */}
            <Flex gap={2}>
              <Button flex={1} onClick={handleReset} variant="outline">
                Reset
              </Button>
              <Button flex={1} colorScheme="purple" onClick={handleApply}>
                Apply Filters
              </Button>
            </Flex>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
