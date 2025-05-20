import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/test-utils';
import DatasetCard from './DatasetCard';

describe('DatasetCard Component', () => {
  // Create a mock dataset
  const mockDataset = {
    id: '1',
    title: 'Test Dataset',
    profiteer: 'non_profit',
    rating: 4,
    downloads: 100,
    views: 200,
    description: 'This is a test dataset description',
    source: 'Test Source',
    date: '2023-01-01',
    verified: true,
    category: 'Health',
    tags: ['health', 'covid', 'data'],
  };

  // Mock handler functions
  const handleSingleDataModal = vi.fn();
  const handleDownloadDataClick = vi.fn();

  it('renders dataset card with correct information', () => {
    render(
      <DatasetCard
        dataset={mockDataset}
        handleSingleDataModal={handleSingleDataModal}
        handleDownloadDataClick={handleDownloadDataClick}
      />,
    );

    // Check if title is rendered
    expect(screen.getByText('Test Dataset')).toBeInTheDocument();

    // Check if rating is displayed
    expect(screen.getAllByTestId('star-icon')).toHaveLength(5); // 4 filled + 1 unfilled

    // Check if downloads and views are displayed
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();

    // Check if verified badge is displayed
    const verifiedBadge = screen.getByTestId('verified-badge');
    expect(verifiedBadge).toBeInTheDocument();
  });

  it('calls handleSingleDataModal when View button is clicked', async () => {
    render(
      <DatasetCard
        dataset={mockDataset}
        handleSingleDataModal={handleSingleDataModal}
        handleDownloadDataClick={handleDownloadDataClick}
      />,
    );

    // Find and click the View button
    const viewButton = screen.getByText('View');
    await fireEvent.click(viewButton);

    // Check if the handler was called with the dataset
    expect(handleSingleDataModal).toHaveBeenCalledWith(mockDataset);
  });

  it('calls handleDownloadDataClick when Download button is clicked', async () => {
    render(
      <DatasetCard
        dataset={mockDataset}
        handleSingleDataModal={handleSingleDataModal}
        handleDownloadDataClick={handleDownloadDataClick}
      />,
    );

    // Find and click the Download button
    const downloadButton = screen.getByText('Download');
    await fireEvent.click(downloadButton);

    // Check if the handler was called with the dataset
    expect(handleDownloadDataClick).toHaveBeenCalledWith(mockDataset);
  });

  it('displays correct icon based on profiteer type', () => {
    render(
      <DatasetCard
        dataset={mockDataset}
        handleSingleDataModal={handleSingleDataModal}
        handleDownloadDataClick={handleDownloadDataClick}
      />,
    );

    // Check if the non-profit icon is rendered
    const profiteerIcon =
      screen.getByAltText('profiteer icon') ||
      screen.getByTestId('profiteer-icon');
    expect(profiteerIcon).toBeInTheDocument();
    expect(profiteerIcon).toHaveAttribute(
      'src',
      expect.stringContaining('non-profit-icon'),
    );
  });
});
