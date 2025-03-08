import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailProps {
  applicantName?: string;
  reviewerName?: string;
  position?: string;
  email?: string;
  contactInfo?: string;
}

export default function ConfirmationEmail({
  applicantName,
  reviewerName = "Navindu Rathnayaka",
  position = "Recruitment Manager",
  email = "info@gmail.com",
  contactInfo = "077 123 4567",
}: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Application Received - Thank You</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={paragraph}>Dear {applicantName},</Text>
            <Text style={paragraph}>
              Thank you for submitting your CV for consideration. I wanted to
              let you know that we have received your application, and it is
              currently under review.
            </Text>
            <Text style={paragraph}>
              We aim to complete the review process as efficiently as possible,
              and we will keep you updated on the progress. In the meantime, if
              you have any questions or additional details to share, feel free
              to reach out.
            </Text>
            <Text style={paragraph}>
              Thank you for your interest, and we appreciate your patience as we
              evaluate your application.
            </Text>
            <Text style={signature}>
              Best regards,
              <br />
              {reviewerName}
              <br />
              {position}
              <br />
              {email}
              <br />
              {contactInfo}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 10px",
  padding: "32px 40px",
  maxWidth: "580px",
  border: "1px solid #eaeaea",
  borderRadius: "5px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};

const signature = {
  marginTop: "32px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
};
