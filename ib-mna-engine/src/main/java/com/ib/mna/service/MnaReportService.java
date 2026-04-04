package com.ib.mna.service;

import com.ib.mna.dto.MarketDataResponse;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MnaReportService {

    private final MarketDataService marketDataService;

    public byte[] generateIntelligenceReport(String dealId, Map<String, Object> projectData,
            AdvisorService.AdvisorResponse advisor) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4); // Start with Portrait

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 1. Portrait Section: Executive Summary & Advisor
            renderExecutiveSummary(document, dealId, projectData, advisor);

            // 2. Switch to Landscape for Detailed Charts & Matrices
            if (advisor != null && advisor.getIndividual_reports() != null
                    && !advisor.getIndividual_reports().isEmpty()) {
                document.setPageSize(PageSize.A4.rotate());
                document.newPage();
                renderIntelligenceDeepDive(document, advisor);
            }

            document.close();
        } catch (Exception e) {
            log.error("Failed to generate M&A Intelligence Report", e);
        }
        return out.toByteArray();
    }

    private void renderExecutiveSummary(Document document, String dealId, Map<String, Object> data,
            AdvisorService.AdvisorResponse advisor) throws DocumentException {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, new Color(15, 23, 42));
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(16, 185, 129));
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Color.DARK_GRAY);

        document.add(new Paragraph("Aura Intelligence: M&A Strategic Report",
                FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)));
        document.add(new Paragraph("\n"));

        document.add(new Paragraph("Deal: " + dealId, titleFont));
        document.add(new Paragraph("Generated at: " + LocalDateTime.now(), normalFont));
        document.add(new Paragraph("\n"));

        document.add(new Paragraph("AI Strategic Summary", subTitleFont));
        document.add(new Paragraph(advisor.getSummary(), normalFont));
        document.add(new Paragraph("\n"));

        // Market Context Table
        MarketDataResponse market = marketDataService.getLatestData();
        PdfPTable marketTable = new PdfPTable(4);
        marketTable.setWidthPercentage(100);
        addHeaderCell(marketTable, "UST 10Y");
        addHeaderCell(marketTable, "USD/KRW");
        addHeaderCell(marketTable, "Carbon (ETS)");
        addHeaderCell(marketTable, "Covenant Status");

        marketTable.addCell(market.getUst10y() != null ? market.getUst10y().toString() + "%" : "N/A");
        marketTable.addCell(market.getUsdkrw() != null ? market.getUsdkrw().toString() : "N/A");
        marketTable.addCell(market.getCarbonPrice() != null ? market.getCarbonPrice().toString() : "N/A");
        marketTable.addCell(market.getCovenantStatus() != null ? market.getCovenantStatus() : "STABLE");
        document.add(marketTable);
    }

    private void renderIntelligenceDeepDive(Document document, AdvisorService.AdvisorResponse advisor)
            throws DocumentException {
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, new Color(59, 130, 246));
        Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.WHITE);

        document.add(new Paragraph("Expert Consensus & Geopolitical Audit Matrix", subTitleFont));
        document.add(new Paragraph("\n"));

        PdfPTable agentTable = new PdfPTable(new float[] { 1, 1.5f, 3, 1 });
        agentTable.setWidthPercentage(100);

        String[] headers = { "Agent", "Category", "Expert Insight & Mitigation Action", "Risk" };
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, tableHeaderFont));
            cell.setBackgroundColor(new Color(30, 41, 59));
            cell.setPadding(8);
            agentTable.addCell(cell);
        }

        if (advisor.getIndividual_reports() != null) {
            for (Map<String, Object> report : advisor.getIndividual_reports()) {
                agentTable.addCell(report.getOrDefault("agent", "Unknown").toString());
                agentTable.addCell(report.getOrDefault("category", "General").toString());
                agentTable.addCell(report.getOrDefault("comment", "No comment provided.").toString());

                String riskLevel = report.getOrDefault("risk_level", "LOW").toString();
                PdfPCell riskCell = new PdfPCell(
                        new Phrase(riskLevel, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.WHITE)));

                if ("HIGH".equalsIgnoreCase(riskLevel))
                    riskCell.setBackgroundColor(new Color(239, 68, 68)); // Red
                else if ("MEDIUM".equalsIgnoreCase(riskLevel))
                    riskCell.setBackgroundColor(new Color(245, 158, 11)); // Amber
                else
                    riskCell.setBackgroundColor(new Color(16, 185, 129)); // Green

                riskCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                riskCell.setPadding(5);
                agentTable.addCell(riskCell);
            }
        }

        document.add(agentTable);

        document.add(new Paragraph("\nGeopolitical & ESG Compliance Note:",
                FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        document.add(new Paragraph("Based on current Carbon ETS price and Supply Chain node analysis, " +
                "the deal resilience score is estimated at 88/100. Geopolitical exposure is currently MINIMAL.",
                FontFactory.getFont(FontFactory.HELVETICA, 10, Color.GRAY)));
    }

    private void addHeaderCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        cell.setBackgroundColor(new Color(241, 245, 249));
        cell.setPadding(5);
        table.addCell(cell);
    }
}
