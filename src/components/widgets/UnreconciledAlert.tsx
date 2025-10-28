import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/chakra-ui/card";
import { Button } from "@chakra-ui/react";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import type { Transaction } from "@/types/financial";

interface UnreconciledAlertProps {
  transactions: Transaction[];
}

export function UnreconciledAlert({ transactions }: UnreconciledAlertProps) {
  const navigate = useNavigate();

  const unreconciledCount = useMemo(() => {
    return transactions.filter((tx) => tx.status === "unreconciled").length;
  }, [transactions]);

  const unreconciledAmount = useMemo(() => {
    return transactions
      .filter((tx) => tx.status === "unreconciled")
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, [transactions]);

  if (unreconciledCount === 0) {
    return (
      <Card
        borderColor="previa.sand"
        role="status"
        aria-live="polite"
        aria-label="All transactions reconciled"
      >
        <CardHeader>
          <CardTitle color="previa.charcoal" fontWeight="semibold">
            <Flex align="center" gap={2}>
              <Flex
                w={8}
                h={8}
                borderRadius="full"
                bg="green.100"
                align="center"
                justify="center"
                aria-hidden="true"
              >
                <Icon as={Check} w={5} h={5} color="green.600" />
              </Flex>
              All Reconciled
            </Flex>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text color="previa.stone" fontSize="sm">
            Great job! All your transactions are reconciled.
          </Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      borderColor="amber.200"
      role="alert"
      aria-live="polite"
      aria-label={`Warning: ${unreconciledCount} unreconciled items`}
    >
      <CardHeader>
        <CardTitle color="previa.charcoal" fontWeight="semibold">
          <Flex align="center" gap={2}>
            <Flex
              w={8}
              h={8}
              borderRadius="full"
              bg="amber.100"
              align="center"
              justify="center"
              aria-hidden="true"
            >
              <Icon as={AlertTriangle} w={5} h={5} color="amber.600" />
            </Flex>
            Unreconciled Items
          </Flex>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Box mb={4}>
          <Text fontSize="sm" color="previa.stone" mb={1}>Items Pending Review</Text>
          <Text fontSize="3xl" fontWeight="bold" color="previa.charcoal" aria-live="polite">
            {unreconciledCount}
          </Text>
          <Text fontSize="sm" color="previa.stone" mt={1}>
            Total Amount:{" "}
            <Text as="span" fontFamily="mono" fontWeight="semibold" color="previa.charcoal">
              ${unreconciledAmount.toFixed(2)}
            </Text>
          </Text>
        </Box>
        <Button
          onClick={() => navigate("/reconciliation")}
          aria-label={`Review ${unreconciledCount} unreconciled items`}
          w="full"
          bg="amber.500"
          color="white"
          rightIcon={<Icon as={ArrowRight} />}
          _hover={{ bg: "amber.600" }}
          _focus={{
            outline: "none",
            ring: 2,
            ringColor: "previa.sand",
            ringOffsetWidth: 2,
          }}
        >
          Review Now
        </Button>
      </CardContent>
    </Card>
  );
}
