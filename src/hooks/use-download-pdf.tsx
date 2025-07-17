import React from 'react';
import type { ReportsResponseData } from './use-dataset-creator-report';
import type { IDataset } from '@/lib/types/data-set';
import type { DatasetCreatorReportFilters } from '@/store/dataset-creator-report-filters';
type ReportPreviewSheetProps = {
  reportsData: ReportsResponseData;
  selectedDatasets: IDataset[];
  filters: DatasetCreatorReportFilters;
};
export default function useDownloadReportsPdf() {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const generateReportAndDownloadPDF = async ({
    reportsData,
    selectedDatasets,
    filters,
  }: ReportPreviewSheetProps) => {
    if (!reportsData || !selectedDatasets || !filters) {
      console.error('Missing required data for PDF generation');
      return;
    }
    setIsDownloading(true);

    try {
      // Use jsPDF as an alternative to react-pdf
      const { jsPDF } = await import('jspdf');

      // Create new PDF document
      const doc = new jsPDF();

      // Set font
      doc.setFont('helvetica');

      // Title
      doc.setFontSize(24);
      doc.setTextColor(0, 0, 0);
      doc.text('Dataset Creator Report', 20, 30);

      // Subtitle
      doc.setFontSize(12);
      doc.setTextColor(107, 114, 128);
      doc.text(
        'A comprehensive summary of your dataset performance and analytics.',
        20,
        45,
      );

      // Draw line
      doc.setDrawColor(229, 231, 235);
      doc.line(20, 55, 190, 55);

      // Metrics Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Key Metrics', 20, 75);

      // Metrics data
      const metricsEntries = Object.entries(reportsData);
      const colors = [
        [37, 99, 235], // blue
        [22, 163, 74], // green
        [234, 88, 12], // orange
        [147, 51, 234], // purple
      ];

      let yPos = 90;
      metricsEntries.forEach(([key, value], index) => {
        const color = colors[index] || [0, 0, 0];
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFontSize(20);
        doc.text(String(value), 20 + index * 45, yPos);

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.text(
          key.charAt(0).toUpperCase() + key.slice(1),
          20 + index * 45,
          yPos + 10,
        );
      });

      // Draw line
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos + 20, 190, yPos + 20);

      // Datasets Section
      yPos += 40;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`Datasets Included (${selectedDatasets.length})`, 20, yPos);

      yPos += 15;
      selectedDatasets.forEach((dataset) => {
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${dataset.title} - ${dataset.category.title}`, 25, yPos);
        yPos += 10;
      });

      // Draw line
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos + 5, 190, yPos + 5);

      // Filters Section
      yPos += 25;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Applied Filters', 20, yPos);

      yPos += 15;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Date Range:', 25, yPos);
      doc.setTextColor(55, 65, 81);
      doc.text(filters.date_range, 70, yPos);

      yPos += 10;
      doc.setTextColor(0, 0, 0);
      doc.text('Metrics:', 25, yPos);
      doc.setTextColor(55, 65, 81);
      doc.text(filters.metrics.join(', '), 70, yPos);

      // Draw line
      doc.setDrawColor(229, 231, 235);
      doc.line(20, yPos + 10, 190, yPos + 10);

      // Summary Section
      yPos += 30;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 20, yPos);

      yPos += 15;
      doc.setFontSize(12);
      doc.setTextColor(55, 65, 81);
      const summaryText = `This report covers ${selectedDatasets.length} datasets over the period of ${filters.date_range.toLowerCase()}. The data shows strong engagement with ${reportsData.views} total views and ${reportsData.downloads} downloads.`;

      // Split long text into multiple lines
      const splitText = doc.splitTextToSize(summaryText, 170);
      doc.text(splitText, 20, yPos);

      // Save the PDF
      const fileName = `dataset-report-${new Date().getTime()}.pdf`;
      doc.save(fileName);

      console.log('PDF generated and downloaded successfully');
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message || error}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, setIsDownloading, generateReportAndDownloadPDF };
}
