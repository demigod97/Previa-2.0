/**
 * Tests for ChatInput component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '@/components/chat/ChatInput';

describe('ChatInput', () => {
  it('renders textarea and send button', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    expect(screen.getByPlaceholderText('Ask about your finances...')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('updates message value when typing', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    const textarea = screen.getByPlaceholderText('Ask about your finances...') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'What is my balance?' } });
    
    expect(textarea.value).toBe('What is my balance?');
  });

  it('calls onSendMessage when send button is clicked with message', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    const textarea = screen.getByPlaceholderText('Ask about your finances...') as HTMLTextAreaElement;
    const sendBtn = screen.getByRole('button');
    
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(sendBtn);
    
    expect(onSendMessage).toHaveBeenCalledWith('Test message');
  });

  it('clears message after sending', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    const textarea = screen.getByPlaceholderText('Ask about your finances...') as HTMLTextAreaElement;
    const sendBtn = screen.getByRole('button');
    
    fireEvent.change(textarea, { target: { value: 'Test message' } });
    fireEvent.click(sendBtn);
    
    expect(textarea.value).toBe('');
  });

  it('does not send empty message', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} />);
    
    const sendBtn = screen.getByRole('button');
    fireEvent.click(sendBtn);
    
    expect(onSendMessage).not.toHaveBeenCalled();
  });

  it('disables input and button when loading', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} isLoading={true} />);
    
    const textarea = screen.getByPlaceholderText('Ask about your finances...') as HTMLTextAreaElement;
    const sendBtn = screen.getByRole('button');
    
    expect(textarea.disabled).toBe(true);
    expect(sendBtn.disabled).toBe(true);
  });

  it('renders example questions when provided', () => {
    const onSendMessage = vi.fn();
    const exampleQuestions = [
      'What did I spend on groceries?',
      'Show my income last month'
    ];
    
    render(<ChatInput onSendMessage={onSendMessage} exampleQuestions={exampleQuestions} />);
    
    expect(screen.getByText('What did I spend on groceries?')).toBeTruthy();
    expect(screen.getByText('Show my income last month')).toBeTruthy();
  });

  it('sends example question when clicked', () => {
    const onSendMessage = vi.fn();
    const exampleQuestions = ['What is my balance?'];
    
    render(<ChatInput onSendMessage={onSendMessage} exampleQuestions={exampleQuestions} />);
    
    const questionBtn = screen.getByText('What is my balance?');
    fireEvent.click(questionBtn);
    
    expect(onSendMessage).toHaveBeenCalledWith('What is my balance?');
  });

  it('uses custom placeholder when provided', () => {
    const onSendMessage = vi.fn();
    render(<ChatInput onSendMessage={onSendMessage} placeholder="Type here..." />);
    
    expect(screen.getByPlaceholderText('Type here...')).toBeTruthy();
  });
});

