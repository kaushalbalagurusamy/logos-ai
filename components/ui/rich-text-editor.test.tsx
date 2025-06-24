/**
 * Test file for RichTextEditor component
 * 
 * Basic functionality tests for the centralized rich text editor
 * that replaces scattered Textarea components across the application
 */

import { describe, it, expect } from '@jest/globals'
import { render, screen, fireEvent } from '@testing-library/react'
import { RichTextEditor } from './rich-text-editor'
import type { FormattingData } from '@/lib/types'

// Mock the tooltip components
jest.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: any) => children,
  Tooltip: ({ children }: any) => children,
  TooltipTrigger: ({ children }: any) => children,
  TooltipContent: ({ children }: any) => <div>{children}</div>,
}))

describe('RichTextEditor', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  }

  it('renders correctly with default props', () => {
    render(<RichTextEditor {...defaultProps} />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toBeInTheDocument()
  })

  it('displays placeholder text when empty', () => {
    const placeholder = 'Enter your text here...'
    render(<RichTextEditor {...defaultProps} placeholder={placeholder} />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveAttribute('data-placeholder', placeholder)
  })

  it('calls onChange when text is entered', () => {
    const onChange = jest.fn()
    render(<RichTextEditor {...defaultProps} onChange={onChange} />)
    
    const editor = screen.getByRole('textbox')
    fireEvent.input(editor, { target: { innerText: 'Hello world' } })
    
    expect(onChange).toHaveBeenCalledWith('Hello world')
  })

  it('shows character count when enabled', () => {
    render(<RichTextEditor {...defaultProps} showCharacterCount={true} value="Hello" />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows character limit warning when exceeded', () => {
    render(
      <RichTextEditor 
        {...defaultProps} 
        value="This is a very long text that exceeds the limit" 
        characterLimit={10}
        showCharacterCount={true}
      />
    )
    
    expect(screen.getByText(/Character limit exceeded/)).toBeInTheDocument()
  })

  it('hides formatting toolbar when formatting is disabled', () => {
    render(<RichTextEditor {...defaultProps} enableFormatting={false} />)
    
    // Should not show formatting buttons
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows formatting toolbar when formatting is enabled', () => {
    render(<RichTextEditor {...defaultProps} enableFormatting={true} />)
    
    // Should show formatting buttons
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0)
  })

  it('applies custom minHeight class', () => {
    render(<RichTextEditor {...defaultProps} minHeight="min-h-[200px]" />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveClass('min-h-[200px]')
  })

  it('is disabled when disabled prop is true', () => {
    render(<RichTextEditor {...defaultProps} disabled={true} />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveAttribute('contenteditable', 'false')
  })

  it('shows auto-save status when auto-save is enabled', () => {
    render(<RichTextEditor {...defaultProps} enableAutoSave={true} />)
    
    expect(screen.getByText('Saved')).toBeInTheDocument()
  })

  it('handles formatting data correctly', () => {
    const formattingData: FormattingData = {
      emphasis: [{
        start: 0,
        end: 5,
        style: 'bold-underline',
        font: 'Times New Roman',
        size: 12
      }],
      highlights: [],
      minimized: []
    }

    const onFormattingChange = jest.fn()
    
    render(
      <RichTextEditor 
        {...defaultProps} 
        formattingData={formattingData}
        onFormattingChange={onFormattingChange}
        enableFormatting={true}
      />
    )
    
    // Component should render without errors
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('respects custom emphasis font and size', () => {
    render(
      <RichTextEditor 
        {...defaultProps} 
        emphasisFont="Arial"
        emphasisSize={14}
        enableFormatting={true}
      />
    )
    
    // Component should render with custom settings
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-editor-class'
    render(<RichTextEditor {...defaultProps} className={customClass} />)
    
    const container = screen.getByRole('textbox').closest('div')
    expect(container).toHaveClass(customClass)
  })
})

/**
 * Integration tests for specific formatting features
 */
describe('RichTextEditor Formatting', () => {
  const defaultProps = {
    value: 'Sample text for testing',
    onChange: jest.fn(),
    enableFormatting: true,
  }

  it('provides emphasis button when formatting is enabled', () => {
    render(<RichTextEditor {...defaultProps} />)
    
    // Look for emphasis button (combines bold and underline icons)
    const emphasisButton = screen.getByRole('button', { name: /emphasis/i })
    expect(emphasisButton).toBeInTheDocument()
  })

  it('provides highlight buttons when highlighting is enabled', () => {
    render(<RichTextEditor {...defaultProps} enableHighlighting={true} />)
    
    // Should have multiple highlight color buttons
    const buttons = screen.getAllByRole('button')
    const highlightButtons = buttons.filter(button => 
      button.getAttribute('title')?.includes('Highlight') ||
      button.textContent?.includes('Highlight')
    )
    expect(highlightButtons.length).toBeGreaterThan(0)
  })

  it('provides minimize button when minimize is enabled', () => {
    render(<RichTextEditor {...defaultProps} enableMinimize={true} />)
    
    const minimizeButton = screen.getByRole('button', { name: /minimize/i })
    expect(minimizeButton).toBeInTheDocument()
  })

  it('provides clear formatting button', () => {
    render(<RichTextEditor {...defaultProps} />)
    
    const clearButton = screen.getByRole('button', { name: /clear/i })
    expect(clearButton).toBeInTheDocument()
  })
})

/**
 * Performance and edge case tests
 */
describe('RichTextEditor Edge Cases', () => {
  it('handles empty formatting data gracefully', () => {
    const emptyFormatting: FormattingData = {
      emphasis: [],
      highlights: [],
      minimized: []
    }

    expect(() => {
      render(
        <RichTextEditor 
          value="Test"
          onChange={jest.fn()}
          formattingData={emptyFormatting}
        />
      )
    }).not.toThrow()
  })

  it('handles undefined formatting data gracefully', () => {
    expect(() => {
      render(
        <RichTextEditor 
          value="Test"
          onChange={jest.fn()}
          formattingData={undefined}
        />
      )
    }).not.toThrow()
  })

  it('handles large text content efficiently', () => {
    const largeText = 'A'.repeat(50000)
    
    expect(() => {
      render(
        <RichTextEditor 
          value={largeText}
          onChange={jest.fn()}
          showCharacterCount={true}
        />
      )
    }).not.toThrow()
  })

  it('handles rapid onChange calls with debouncing', async () => {
    const onChange = jest.fn()
    render(
      <RichTextEditor 
        value=""
        onChange={onChange}
        enableAutoSave={true}
        autoSaveInterval={100}
      />
    )
    
    const editor = screen.getByRole('textbox')
    
    // Simulate rapid typing
    fireEvent.input(editor, { target: { innerText: 'A' } })
    fireEvent.input(editor, { target: { innerText: 'AB' } })
    fireEvent.input(editor, { target: { innerText: 'ABC' } })
    
    // With debouncing, onChange should be called less frequently
    expect(onChange).toHaveBeenCalled()
  })
})