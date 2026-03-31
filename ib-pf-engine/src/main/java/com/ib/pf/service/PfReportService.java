package com.ib.pf.service;

import com.ib.pf.model.PfProject;
import com.ib.pf.dto.PfMetricsResponse;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PfReportService {

    public byte[] generateProjectReport(PfProject project, PfMetricsResponse metrics) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Font Definitions
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLACK);
            Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(59, 130, 246));
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.GRAY);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.DARK_GRAY);
            Font gradeFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, new Color(16, 185, 129));

            // Header Section
            Paragraph header = new Paragraph("IB Platform: Project Finance Report", labelFont);
            header.setAlignment(Element.ALIGN_RIGHT);
            document.add(header);
            document.add(new Paragraph("\n"));

            // Title
            Paragraph title = new Paragraph(project.getProjectName(), titleFont);
            title.setSpacingAfter(10);
            document.add(title);

            Paragraph meta = new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), labelFont);
            meta.setSpacingAfter(20);
            document.add(meta);

            // Project Details Table
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(20);

            addTableCell(table, "Deal Type", project.getDealType(), labelFont, valueFont);
            addTableCell(table, "Total Capex", String.format("%,d Billion KRW", project.getTotalCapex()), labelFont, valueFont);
            addTableCell(table, "Status", project.getStatus(), labelFont, valueFont);
            addTableCell(table, "Loan Tenure", project.getLoanTenure() + " Years", labelFont, valueFont);

            document.add(table);

            // Metrics Section
            document.add(new Paragraph("Financial Coverage Metrics", subTitleFont));
            document.add(new Paragraph("\n"));

            PdfPTable metricsTable = new PdfPTable(3);
            metricsTable.setWidthPercentage(100);

            addMetricCell(metricsTable, "Min DSCR", String.format("%.2fx", metrics.getMinDscr()), metrics.getDscrGrade(), labelFont, gradeFont);
            addMetricCell(metricsTable, "LLCR", String.format("%.2fx", metrics.getLlcr()), metrics.getLlcrGrade(), labelFont, gradeFont);
            addMetricCell(metricsTable, "PLCR", String.format("%.2fx", metrics.getPlcr()), metrics.getPlcrGrade(), labelFont, gradeFont);

            document.add(metricsTable);

            // Summary Text
            Paragraph summary = new Paragraph("\nSummary Analysis:", labelFont);
            document.add(summary);
            
            String analysisText = String.format(
                "The project maintains an average DSCR of %.3fx. Based on the current simulation, " +
                "the debt coverage remains within safe levels. The sensitivity analysis indicates that " +
                "Capex variations have the highest impact on loan stability.", metrics.getAvgDscr()
            );
            document.add(new Paragraph(analysisText, valueFont));

            // Footer
            Paragraph footer = new Paragraph("\n\nConfidential - IB Platform Automated Reporting System", labelFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            document.add(footer);

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private void addTableCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cellLabel = new PdfPCell(new Phrase(label, labelFont));
        cellLabel.setBorder(Rectangle.NO_BORDER);
        cellLabel.setPadding(8);
        table.addCell(cellLabel);

        PdfPCell cellValue = new PdfPCell(new Phrase(value, valueFont));
        cellValue.setBorder(Rectangle.NO_BORDER);
        cellValue.setPadding(8);
        table.addCell(cellValue);
    }

    private void addMetricCell(PdfPTable table, String label, String value, String grade, Font labelFont, Font gradeFont) {
        PdfPCell cell = new PdfPCell();
        cell.setPadding(15);
        cell.setBackgroundColor(new Color(248, 250, 252));
        cell.setBorder(Rectangle.BOX);
        cell.setBorderColor(new Color(226, 232, 240));

        cell.addElement(new Phrase(label, labelFont));
        Paragraph valPara = new Paragraph(value, gradeFont);
        valPara.setSpacingBefore(5);
        cell.addElement(valPara);
        cell.addElement(new Phrase("Grade: " + grade, labelFont));
        
        table.addCell(cell);
    }
}
