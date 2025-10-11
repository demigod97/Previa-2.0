/**
 * Tests for ChatMessage component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatMessage from '@/components/chat/ChatMessage';
import { EnhancedChatMessage } from '@/types/message';

describe('ChatMessage', () => {
  it('renders user message with sand background', () => {
    const message: EnhancedChatMessage = {
      id: 1,
      session_id: 'test',
      message: {
        type: 'user',
        content: 'Hello, what is my balance?'
      }
    };

    const { container } = render(<ChatMessage message={message} />);
    const messageEl = container.querySelector('.bg-sand');
    expect(messageEl).toBeTruthy();
    expect(screen.getByText('Hello, what is my balance?')).toBeTruthy();
  });

  it('renders AI message with cream background', () => {
    const message: EnhancedChatMessage = {
      id: 2,
      session_id: 'test',
      message: {
        type: 'ai',
        content: 'Your balance is $1,234.56'
      }
    };

    const { container } = render(<ChatMessage message={message} />);
    const messageEl = container.querySelector('.bg-cream');
    expect(messageEl).toBeTruthy();
    expect(screen.getByText('Your balance is $1,234.56')).toBeTruthy();
  });

  it('renders AI message with citations', () => {
    const message: EnhancedChatMessage = {
      id: 3,
      session_id: 'test',
      message: {
        type: 'ai',
        content: {
          segments: [
            { text: 'You spent $50 on groceries', citation_id: 1 }
          ],
          citations: [
            {
              citation_id: 1,
              source_id: 'txn-123',
              source_title: 'Transaction 2025-01-10',
              source_type: 'transaction',
              transaction_id: 'txn-123',
              transaction_amount: 50,
              chunk_index: 0
            }
          ]
        }
      }
    };

    const onCitationClick = vi.fn();
    render(<ChatMessage message={message} onCitationClick={onCitationClick} />);
    
    expect(screen.getByText('You spent $50 on groceries')).toBeTruthy();
    
    // Citation button should be rendered
    const citationBtn = screen.getByRole('button');
    expect(citationBtn).toBeTruthy();
  });

  it('calls onCitationClick when citation button is clicked', async () => {
    const message: EnhancedChatMessage = {
      id: 4,
      session_id: 'test',
      message: {
        type: 'ai',
        content: {
          segments: [
            { text: 'Transaction found', citation_id: 1 }
          ],
          citations: [
            {
              citation_id: 1,
              source_id: 'txn-456',
              source_title: 'Transaction 2025-01-11',
              source_type: 'transaction',
              chunk_index: 0
            }
          ]
        }
      }
    };

    const onCitationClick = vi.fn();
    render(<ChatMessage message={message} onCitationClick={onCitationClick} />);
    
    const citationBtn = screen.getByRole('button');
    citationBtn.click();
    
    expect(onCitationClick).toHaveBeenCalledWith({
      citation_id: 1,
      source_id: 'txn-456',
      source_title: 'Transaction 2025-01-11',
      source_type: 'transaction',
      chunk_index: 0
    });
  });

  it('renders timestamp', () => {
    const message: EnhancedChatMessage = {
      id: 5,
      session_id: 'test',
      message: {
        type: 'user',
        content: 'Test message'
      }
    };

    const { container } = render(<ChatMessage message={message} />);
    const timestamp = container.querySelector('.text-xs.text-stone');
    expect(timestamp).toBeTruthy();
  });
});

