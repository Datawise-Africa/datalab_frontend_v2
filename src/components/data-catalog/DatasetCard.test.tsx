import { render, screen, fireEvent } from '@/test/test-utils';
import DatasetCard from './DatasetCard';
import type { IDataset } from '@/lib/types/data-set';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('DatasetCard Component', () => {
  // Create a mock dataset
  const mockDataset: IDataset = {
    id: 0,
    category: {
      id: 0,
      title: 'Test Category',
    },
    title: '',
    description: '',
    dataset_region: '',
    license: '',
    metadata_file: null,
    datasheet_file: null,
    doi_citation: null,
    download_count: 0,
    is_premium: false,
    is_private: false,
    data_file_types: '',
    price: null,
    authors: [],
    intended_audience: {
      company: false,
      non_profit: true,
      government: false,
      academic: false,
      public: false,
      students: false,
    },
    // accepted_term: { id: 0, term: '' },
    // restricted_term: { id: 0, term: '' },
    terms_and_conditions: {
      id: 0,
      title: 'Terms and Conditions',
      description: 'These are the terms and conditions.',
    },
    created_at: '',
    updated_at: '',
    tags: [],
    size_bytes: '',
    covered_regions: [],
    keywords: [],
    data_files: [],
    review_count: 0,
    average_review: 0,
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

  describe('DatasetCard Component', () => {
    // Create a mock dataset
    let mockDataset: IDataset;

    // Mock handler functions
    const handleSingleDataModal = vi.fn();
    const handleDownloadDataClick = vi.fn();

    beforeEach(() => {
      // Reset mocks
      vi.resetAllMocks();

      // Reset mock dataset before each test
      mockDataset = {
        id: 0,
        category: {
          id: 0,
          title: 'Test Category',
        },
        title: 'Test Dataset',
        description:
          'This is a test description that should be truncated if it is too long',
        dataset_region: '',
        license: '',
        metadata_file: null,
        datasheet_file: null,
        doi_citation: null,
        download_count: 10,
        is_premium: false,
        is_private: false,
        data_file_types: '',
        price: 0,
        authors: [
          {
            id: 1,
            title: 'Author 1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
          },
          {
            id: 2,
            title: 'Author 2',
            first_name: 'Jane',
            last_name: 'Smith',
            email: 'jane.smith@example.com',
          },
          {
            id: 3,
            title: 'Author 3',
            first_name: 'Bob',
            last_name: 'Johnson',
            email: 'bob.johnson@example.com',
          },
        ],
        intended_audience: {
          company: false,
          non_profit: true,
          students: false,
          public: false,
        },
        // accepted_term: { id: 0, term: '' },
        // restricted_term: { id: 0, term: '' },
        terms_and_conditions: {
          id: 0,
          title: 'Terms and Conditions',
          description: 'These are the terms and conditions.',
        },
        created_at: '2023-01-01',
        updated_at: '',
        tags: ['tag1', 'tag2'],
        size_bytes: '10MB',
        covered_regions: [],
        keywords: [],
        data_files: [],
        review_count: 0,
        average_review: 0,
      };
    });

    it('displays Free for non-premium datasets', () => {
      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('displays price for premium datasets', () => {
      mockDataset.is_premium = true;
      mockDataset.price = 19.99;

      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      expect(screen.getByText('$19.99')).toBeInTheDocument();
    });

    it('truncates long description text', () => {
      mockDataset.description =
        'This is a very long description that should be truncated when displayed in the card view to ensure proper layout';

      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      const displayedText = screen.getByText(/This is a very long description/);
      expect(displayedText.textContent).toContain('...');
      expect(displayedText.textContent?.split(' ').length).toBeLessThanOrEqual(
        11,
      ); // 10 words + ...
    });

    it('renders dataset tags correctly', () => {
      mockDataset.tags = ['AI', 'Machine Learning', 'Data Science'];

      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      expect(screen.getByText('AI')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
      expect(screen.getByText('Data Science')).toBeInTheDocument();
    });

    it('renders dataset author information correctly', () => {
      mockDataset.authors = [];

      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('displays "No ratings yet" when review_count is 0', () => {
      mockDataset.review_count = 0;

      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      expect(screen.getByText('No ratings yet')).toBeInTheDocument();
    });

    it('renders stars correctly based on average review', () => {
      mockDataset.review_count = 10;
      mockDataset.average_review = 4;

      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      // This is a simple test to check if stars are rendered
      // A more detailed test would check which stars are filled vs unfilled
      const stars = screen
        .getAllByRole('img', { hidden: true })
        .filter((icon) => icon.getAttribute('data-icon') === 'star');
      expect(stars.length).toBe(5);
    });

    it('shows dropdown menu when clicking the menu button', async () => {
      render(
        <DatasetCard
          dataset={mockDataset}
          handleSingleDataModal={handleSingleDataModal}
          handleDownloadDataClick={handleDownloadDataClick}
        />,
      );

      const menuButton = screen.getByRole('button', { name: '' });
      await fireEvent.click(menuButton);

      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });
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
