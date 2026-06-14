import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

/**
 * Card Component - Container với shadow và border
 * HCI: Visual grouping, clear boundaries
 */
export default function Card({ 
  children, 
  className = "", 
  padding = "md",
  hover = false 
}: CardProps) {
  
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  };
  
  const hoverStyle = hover ? "hover:shadow-md transition-shadow duration-200" : "";
  
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 ${paddingStyles[padding]} ${hoverStyle} ${className}`}>
      {children}
    </div>
  );
}
