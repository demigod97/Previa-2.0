import React, { useState } from 'react';
import { Sidebar, TopBar } from '@/components/layout';
import { FinancialChatPanel, ChatModeToggle } from '@/components/chat';
import { useChatMode } from '@/contexts/ChatModeContext';
import { Citation } from '@/types/message';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/chakra-ui/dialog';
import { Card } from '@/components/chakra-ui/card';
import { Box } from '@chakra-ui/react';
import { formatCurrency } from '@/lib/utils';

/**
 * ChatView - AI financial assistant chat interface
 *
 * Full-page chat interface where users can ask questions about their financial data
 * and receive AI-powered insights with citations to transactions and receipts.
 * Supports toggle between CopilotKit AI and standard Financial Chat.
 */
const ChatView = () => {
  const { chatMode } = useChatMode();
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
  };

  const handleCloseCitation = () => {
    setSelectedCitation(null);
  };

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 md:ml-20 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Chat Mode Toggle */}
        <Box px={6} pt={4}>
          <ChatModeToggle />
        </Box>

        {/* Chat Panel - Conditional Rendering Based on Mode */}
        <main className="flex-1 overflow-hidden">
          {chatMode === 'copilot' ? (
            <Box h="full" px={6} pb={4}>
              <Box
                h="full"
                bg="previa.cream"
                borderRadius="lg"
                borderWidth="1px"
                borderColor="previa.sand"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                gap={4}
                p={8}
              >
                <Box fontSize="4xl">🚧</Box>
                <Box textAlign="center">
                  <Box fontSize="xl" fontWeight="medium" color="previa.charcoal" mb={2}>
                    CopilotKit AI - Coming Soon
                  </Box>
                  <Box fontSize="sm" color="previa.stone" maxW="md">
                    We're working on integrating advanced AI capabilities with CopilotKit.
                    For now, please use the Financial Chat mode which provides full AI-powered financial assistance.
                  </Box>
                </Box>
              </Box>
            </Box>
          ) : (
            <FinancialChatPanel
              onCitationClick={handleCitationClick}
            />
          )}
        </main>
      </div>

      {/* Citation Detail Dialog */}
      <Dialog open={!!selectedCitation} onOpenChange={handleCloseCitation}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-charcoal">Citation Details</DialogTitle>
          </DialogHeader>
          
          {selectedCitation && (
            <div className="space-y-4">
              <Card className="bg-cream border-sand p-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-darkStone">Source Type:</span>
                    <span className="ml-2 text-charcoal capitalize">{selectedCitation.source_type}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-darkStone">Title:</span>
                    <span className="ml-2 text-charcoal">{selectedCitation.source_title}</span>
                  </div>

                  {selectedCitation.source_type === 'transaction' && (
                    <>
                      {selectedCitation.transaction_date && (
                        <div>
                          <span className="text-sm font-medium text-darkStone">Date:</span>
                          <span className="ml-2 text-charcoal">
                            {new Date(selectedCitation.transaction_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedCitation.transaction_amount !== undefined && (
                        <div>
                          <span className="text-sm font-medium text-darkStone">Amount:</span>
                          <span className="ml-2 font-mono text-charcoal">
                            {formatCurrency(selectedCitation.transaction_amount)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {selectedCitation.source_type === 'receipt' && selectedCitation.receipt_merchant && (
                    <div>
                      <span className="text-sm font-medium text-darkStone">Merchant:</span>
                      <span className="ml-2 text-charcoal">{selectedCitation.receipt_merchant}</span>
                    </div>
                  )}

                  {selectedCitation.excerpt && (
                    <div>
                      <span className="text-sm font-medium text-darkStone">Excerpt:</span>
                      <p className="mt-1 text-sm text-charcoal bg-white p-2 rounded border border-sand">
                        {selectedCitation.excerpt}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatView;

