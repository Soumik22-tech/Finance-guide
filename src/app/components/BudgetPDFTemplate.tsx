"use client";

import React from "react";
import { BudgetResult } from "@/app/types/budget";

interface Props {
  result: BudgetResult;
  summaryText?: string;
  roadmap?: { title: string; body: string }[];
  goal?: string;
}

// Category tooltip descriptions (same as main result cards)
const categoryDescriptions: Record<string, string> = {
  "Rent": "Monthly rent for your home",
  "EMI": "Monthly loan repayment amount",
  "Maintenance": "Home upkeep and repairs",
  "Utilities": "Electricity, water, gas bills",
  "Transportation": "Travel and commute costs",
  "Food & Groceries": "All food and household items",
  "Internet & Subscriptions": "Internet, OTT, and apps",
  "Insurance": "Health and life insurance",
  "Emergency Fund": "Savings for unexpected events",
  "Miscellaneous": "Other daily expenses",
  "Child Expenses": "School fees, child needs",
  "Savings & Investment": "Future wealth building",
};

export default function BudgetPDFTemplate({ result, summaryText, roadmap, goal }: Props) {
  const today = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const breakdownEntries = Object.entries(result.breakdown).filter(
    ([key]) => key !== "TOTAL"
  );

  return (
    <div
      id="pdf-export-template"
      style={{
        width: "794px", // A4 width at 96dpi
        backgroundColor: "#f8f9fc",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        padding: "0",
        position: "absolute",
        left: "-9999px",
        top: "0",
      }}
    >
      {/* HEADER — matches navbar */}
      <div
        style={{
          backgroundColor: "#0a192f",
          padding: "32px 40px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ color: "#64ffda", fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}>
            Finance Guide
          </div>
          <div style={{ color: "#8892b0", fontSize: "12px" }}>
            Smart Budget Allocator
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ color: "#ccd6f6", fontSize: "13px" }}>Generated on</div>
          <div style={{ color: "#8892b0", fontSize: "12px" }}>{today}</div>
        </div>
      </div>

      {/* HERO BAND */}
      <div
        style={{
          backgroundColor: "#112240",
          padding: "24px 40px",
          borderBottom: "3px solid #64ffda",
        }}
      >
        <h1 style={{ color: "#e6f1ff", fontSize: "26px", fontWeight: "700", margin: "0 0 6px" }}>
          {result.name}&apos;s Monthly Budget
        </h1>
        <p style={{ color: "#8892b0", fontSize: "13px", margin: "0" }}>
          Personalized for {result.city} &nbsp;·&nbsp; Monthly Income: ₹{result.salary.toLocaleString()}
        </p>
      </div>

      {/* BODY */}
      <div style={{ padding: "32px 40px" }}>

        {/* AI SUMMARY BOX — only if available */}
        {summaryText && (
          <div
            style={{
              backgroundColor: "#E1F5EE",
              borderLeft: "4px solid #64ffda",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                backgroundColor: "#64ffda",
                color: "#0a192f",
                fontSize: "10px",
                fontWeight: "700",
                padding: "3px 8px",
                borderRadius: "4px",
                display: "inline-block",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              AI Summary
            </div>
            <p style={{ color: "#1d3557", fontSize: "13px", lineHeight: "1.7", margin: "0" }}>
              {summaryText}
            </p>
          </div>
        )}

        {/* SECTION TITLE */}
        <h2
          style={{
            color: "#0a192f",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "16px",
            paddingBottom: "8px",
            borderBottom: "1px solid #dfe6f3",
          }}
        >
          Budget Breakdown
        </h2>

        {/* BUDGET CARDS GRID — 3 columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px",
            marginBottom: "28px",
          }}
        >
          {breakdownEntries.map(([key, value]) => {
            const percent = ((value / result.salary) * 100).toFixed(1);
            return (
              <div
                key={key}
                style={{
                  backgroundColor: "#f1f6ff",
                  borderRadius: "10px",
                  padding: "16px",
                  border: "1px solid #dfe6f3",
                }}
              >
                <div style={{ color: "#1d3557", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
                  {key}
                </div>
                <div style={{ color: "#00449e", fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>
                  ₹{value.toLocaleString()}
                </div>
                <div style={{ color: "#6c757d", fontSize: "10px" }}>
                  {percent}% of income
                </div>
                {categoryDescriptions[key] && (
                  <div style={{ color: "#8892b0", fontSize: "9px", marginTop: "4px" }}>
                    {categoryDescriptions[key]}
                  </div>
                )}
              </div>
            );
          })}

          {/* TOTAL CARD */}
          <div
            style={{
              backgroundColor: "#0a192f",
              borderRadius: "10px",
              padding: "16px",
              border: "1px solid #0a192f",
            }}
          >
            <div style={{ color: "#8892b0", fontSize: "12px", fontWeight: "600", marginBottom: "8px" }}>
              TOTAL
            </div>
            <div style={{ color: "#64ffda", fontSize: "20px", fontWeight: "700", marginBottom: "4px" }}>
              ₹{result.salary.toLocaleString()}
            </div>
            <div style={{ color: "#8892b0", fontSize: "10px" }}>
              100% allocated
            </div>
          </div>
        </div>

        {/* POVERTY ESCAPE ROADMAP — only if available */}
        {roadmap && roadmap.length > 0 && (
          <>
            <h2
              style={{
                color: "#0a192f",
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "16px",
                paddingBottom: "8px",
                borderBottom: "1px solid #dfe6f3",
                marginTop: "8px",
              }}
            >
              Your 6-Month Poverty Escape Roadmap
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {roadmap.map((month, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "14px",
                    backgroundColor: "#f1f6ff",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    border: "1px solid #dfe6f3",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#0a192f",
                      color: "#64ffda",
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "700",
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ color: "#1d3557", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                      {month.title}
                    </div>
                    <div style={{ color: "#4a5568", fontSize: "12px", lineHeight: "1.6" }}>
                      {month.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {goal && (
              <div
                style={{
                  backgroundColor: "#0a192f",
                  borderRadius: "10px",
                  padding: "16px 20px",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                <div style={{ color: "#64ffda", fontSize: "13px", fontWeight: "700", marginBottom: "6px" }}>
                  🎯 Your Financial Goal
                </div>
                <div style={{ color: "#ccd6f6", fontSize: "13px" }}>{goal}</div>
              </div>
            )}
          </>
        )}

        {/* FOOTER NOTE */}
        <div
          style={{
            borderTop: "1px solid #dfe6f3",
            paddingTop: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ color: "#8892b0", fontSize: "10px", margin: "0" }}>
            Generated by Finance Guide · Developed by Soumik Majumder
          </p>
          <p style={{ color: "#64ffda", fontSize: "10px", margin: "0", fontWeight: "600" }}>
            finance-guide.vercel.app
          </p>
        </div>
      </div>
    </div>
  );
}
