import React, { useState } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { faqList } from "../../utils/CommonUtils";
import "./Faq.css";

const Faq = () => {
  const [expanded, setExpanded] = useState(faqList[0].id);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className="staticContent">
      <h4>FAQ</h4>
      <div className="faqList">
        {faqList.map((faq) => (
          <Accordion
            key={faq.id}
            expanded={expanded === faq.id}
            onChange={handleChange(faq.id)}
          >
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls={`panel-${faq.id}-content`}
              id={`panel-${faq.id}-header`}
            >
              {faq.name}
            </AccordionSummary>
            <AccordionDetails>
              <p>{faq.description}</p>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default Faq;
