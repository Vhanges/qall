import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Qall Privacy Policy — how we collect, use, store, and protect your personal data in compliance with UK GDPR.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="16 October 2026">
      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          1. Introduction
        </h2>
        <p>
          Qall Technologies Ltd (&quot;Qall,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to
          protecting the privacy and security of your personal data. This Privacy Policy
          explains how we collect, use, disclose, and safeguard information when you
          visit our website (www.theqall.com), use our cloud-based insurance CRM platform
          (the &quot;Platform&quot;), or otherwise interact with us.
        </p>
        <p className="mt-3">
          We are the data controller for the personal data we collect directly from you.
          When processing personal data on behalf of our clients (e.g., policyholder or
          advisor data entered into the Platform), we act as a data processor.
        </p>
        <p className="mt-3">
          This policy is issued in compliance with the UK General Data Protection
          Regulation (UK GDPR), the Data Protection Act 2018, and the Privacy and
          Electronic Communications Regulations (PECR).
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          2. Information We Collect
        </h2>

        <h3 className="font-heading font-medium text-lg text-dark-200 mt-4 mb-2">
          2.1 Information You Provide Directly
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-dark-200">Account Information:</strong> Name, email address,
            job title, company name, phone number, and business address when you register
            for an account or request a demo
          </li>
          <li>
            <strong className="text-dark-200">Contact Form Submissions:</strong> Name, email address,
            primary business barrier, and message content when you submit a contact enquiry
          </li>
          <li>
            <strong className="text-dark-200">Billing Information:</strong> Payment card details,
            billing address, and VAT number (processed securely via our payment
            processor)
          </li>
          <li>
            <strong className="text-dark-200">Communication Data:</strong> Records of correspondence
            when you contact our support team, participate in surveys, or provide feedback
          </li>
          <li>
            <strong className="text-dark-200">AI Assistant Data:</strong> Messages you submit to
            the AI assistant on our website, together with the session identifier and IP
            address used to process your request
          </li>
        </ul>

        <h3 className="font-heading font-medium text-lg text-dark-200 mt-4 mb-2">
          2.2 Information Collected Automatically
        </h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong className="text-dark-200">Usage Data:</strong> Pages requested and features used
            within the Platform, as recorded in our server logs
          </li>
          <li>
            <strong className="text-dark-200">Device Information:</strong> Browser type, operating
            system, device type, screen resolution, and language preferences
          </li>
          <li>
            <strong className="text-dark-200">Log Data:</strong> IP address, access times, referring
            URLs, and server response codes
          </li>
          <li>
            <strong className="text-dark-200">Cookies and Similar Technologies:</strong> See Section
            8 (Cookie Policy) for details
          </li>
        </ul>

        <h3 className="font-heading font-medium text-lg text-dark-200 mt-4 mb-2">
          2.3 Client Data (Processed on Behalf of Clients)
        </h3>
        <p>
          When our clients use the Platform, they may upload or input data relating to
          their advisors, policyholders, commissions, and business operations. This data
          is processed by Qall strictly in accordance with our clients&apos; instructions and
          the terms of our Data Processing Agreement (DPA). This may include:
        </p>
        <ul className="list-disc pl-6 mt-2 space-y-2">
          <li>Advisor names, contact details, and performance metrics</li>
          <li>Policyholder names, policy numbers, and coverage details</li>
          <li>Commission amounts, payment schedules, and override structures</li>
          <li>Lead information including source, status, and conversion data</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          3. How We Use Your Information
        </h2>
        <p>We process your personal data for the following purposes:</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Service Delivery:</strong> To provide, maintain,
            and improve the Platform, including commission calculations, performance
            analytics, and advisor management tools
          </li>
          <li>
            <strong className="text-dark-200">AI Assistant:</strong> To respond to questions
            you submit to the AI assistant on our website and to maintain the context of
            that conversation
          </li>
          <li>
            <strong className="text-dark-200">Account Management:</strong> To create and manage
            your account, process subscriptions, and handle billing
          </li>
          <li>
            <strong className="text-dark-200">Communication:</strong> To respond to enquiries,
            provide customer support, send service notifications, and deliver product
            updates
          </li>
          <li>
            <strong className="text-dark-200">Service Improvement:</strong> To understand
            how the Platform is used and to improve functionality and user experience
          </li>
          <li>
            <strong className="text-dark-200">Security:</strong> To detect, prevent, and address
            technical issues, fraud, and unauthorised access
          </li>
          <li>
            <strong className="text-dark-200">Legal Compliance:</strong> To comply with applicable
            laws, regulations, and legal processes, including any requirements that apply to our
            clients&apos; regulated activities
          </li>
          <li>
            <strong className="text-dark-200">Marketing:</strong> To send promotional communications
            about Qall services, where you have consented or where we have a legitimate
            interest (you may opt out at any time)
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          4. Legal Basis for Processing
        </h2>
        <p>We rely on the following legal bases under the UK GDPR:</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Contract Performance (Article 6(1)(b)):</strong> Processing
            necessary to perform our contract with you, including providing access to
            the Platform and processing payments
          </li>
          <li>
            <strong className="text-dark-200">Legitimate Interests (Article 6(1)(f)):</strong> Processing
            necessary for our legitimate interests, including improving our services,
            ensuring Platform security, and responding to enquiries submitted through
            our AI assistant, where those interests are not overridden by your rights
          </li>
          <li>
            <strong className="text-dark-200">Consent (Article 6(1)(a)):</strong> Where you have
            given clear consent for us to process your personal data for specific purposes,
            such as marketing communications
          </li>
          <li>
            <strong className="text-dark-200">Legal Obligation (Article 6(1)(c)):</strong> Processing
            necessary to comply with a legal obligation, including tax, accounting, and
            regulatory requirements
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          5. Data Sharing and Disclosure
        </h2>
        <p>
          We do not sell your personal data. We may share your information with the
          following categories of recipients:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Service Providers:</strong> We use a
            limited number of third-party providers to operate our website and the
            Platform, each bound by contractual data protection obligations. Depending
            on the features you use, these include Oracle Corporation (object storage
            and speech-to-text), Microsoft Corporation (email delivery), 8x8, Inc.
            (voice calling and call recording), ClickSend (SMS delivery), Meta
            Platforms, Inc. (WhatsApp Business messaging), and Amazon Web Services,
            Inc. (backup storage). If you use the AI assistant on our website, a
            third-party language model provider processes the content of the messages
            you send it. We maintain a current list of our service providers, available
            on request, and will notify you of material changes.
          </li>
          <li>
            <strong className="text-dark-200">Insurance Partners:</strong> Where required to
            facilitate integrations with insurance carriers and providers as part of the
            Platform&apos;s functionality, and only with your authorisation
          </li>
          <li>
            <strong className="text-dark-200">Professional Advisors:</strong> Lawyers, auditors,
            and accountants where necessary for the operation of our business
          </li>
          <li>
            <strong className="text-dark-200">Legal Requirements:</strong> Where disclosure is
            required by law, regulation, legal process, or enforceable governmental request
          </li>
          <li>
            <strong className="text-dark-200">Business Transfers:</strong> In connection with a
            merger, acquisition, or sale of all or a portion of our business, with
            appropriate confidentiality protections
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          6. International Transfers
        </h2>
        <p>
          Some of our service providers process personal data outside the
          United Kingdom. Where we transfer personal data outside the UK, we ensure
          appropriate safeguards are in place, including:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>UK adequacy regulations recognising the recipient country&apos;s data protection standards</li>
          <li>International Data Transfer Agreements (IDTAs) or UK Addendum to EU Standard Contractual Clauses</li>
          <li>Binding Corporate Rules where applicable</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          7. Data Retention
        </h2>
        <p>
          We retain personal data only for as long as necessary to fulfil the purposes
          for which it was collected:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Account Data:</strong> Retained for the duration of
            your subscription and for 12 months following termination to facilitate
            data export requests
          </li>
          <li>
            <strong className="text-dark-200">Client Data:</strong> Retained for 30 days following
            account termination, after which it is permanently deleted unless a longer
            retention period is required by law
          </li>
          <li>
            <strong className="text-dark-200">Billing Records:</strong> Retained for 7 years in
            accordance with HMRC requirements
          </li>
          <li>
            <strong className="text-dark-200">Contact Enquiries:</strong> Retained for 24 months
            from the date of submission
          </li>
          <li>
            <strong className="text-dark-200">AI Assistant Conversations:</strong> Messages
            you submit to the AI assistant on our website, together with the associated
            session identifier and IP address, are used to generate responses. Contact
            privacy@theqall.com for the current retention period for this data.
          </li>
          <li>
            <strong className="text-dark-200">Usage and Log Data:</strong> Retained in
            anonymised form for up to 36 months
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          8. Cookie Policy
        </h2>
        <p>
          We use cookies and similar technologies to keep the Platform secure and
          working. We do not use advertising or cross-site tracking cookies. The
          categories we use are:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Strictly Necessary:</strong> Essential for the
            Platform to function, including session management, authentication, and
            security cookies. These cannot be disabled.
          </li>
          <li>
            <strong className="text-dark-200">Functional:</strong> Enable enhanced functionality
            and personalisation, such as remembering your preferences and settings.
          </li>
          <li>
            <strong className="text-dark-200">Local Storage:</strong> Our website stores a
            session identifier under the key <code>qall.chat.sessionId</code> in your
            browser&apos;s local storage. This is used to keep the AI assistant
            conversation continuous. It contains no personal information itself and
            remains on your device until you clear your browser storage.
          </li>
        </ul>
        <p className="mt-3">
          You can manage your cookie preferences through your browser settings. Please
          note that disabling certain cookies may affect the functionality of the Platform.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          9. Your Rights
        </h2>
        <p>
          Under the UK GDPR, you have the following rights regarding your personal data:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Right of Access:</strong> Request a copy of the
            personal data we hold about you
          </li>
          <li>
            <strong className="text-dark-200">Right to Rectification:</strong> Request correction
            of inaccurate or incomplete personal data
          </li>
          <li>
            <strong className="text-dark-200">Right to Erasure:</strong> Request deletion of your
            personal data in certain circumstances
          </li>
          <li>
            <strong className="text-dark-200">Right to Restrict Processing:</strong> Request that
            we limit the processing of your personal data
          </li>
          <li>
            <strong className="text-dark-200">Right to Data Portability:</strong> Request your
            personal data in a structured, commonly used, machine-readable format
          </li>
          <li>
            <strong className="text-dark-200">Right to Object:</strong> Object to processing based
            on legitimate interests or for direct marketing purposes
          </li>
          <li>
            <strong className="text-dark-200">Rights Related to Automated Decision-Making:</strong> Not
            be subject to decisions based solely on automated processing that produce
            legal or similarly significant effects
          </li>
        </ul>
        <p className="mt-3">
          To exercise any of these rights, please contact us at privacy@theqall.com. We will
          respond to your request within one month, as required by law. There is no fee
          for making a request unless it is manifestly unfounded or excessive.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          10. Data Security
        </h2>
        <p>
          We implement appropriate technical and organisational measures to protect your
          personal data, including:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Encryption of data in transit using TLS for all website and Platform connections</li>
          <li>Role-based access controls restricting access to data according to a user&apos;s role</li>
          <li>Regular internal security reviews of our codebase, with findings tracked and remediated</li>
          <li>Automated daily backups of Platform data, stored on local and cloud storage</li>
          <li>Employee security awareness training</li>
          <li>
            A documented approach to notifying affected individuals and the Information
            Commissioner&apos;s Office within 72 hours of becoming aware of a personal
            data breach, where the threshold for notification is met
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          11. Children&apos;s Privacy
        </h2>
        <p>
          The Platform is designed for business use and is not directed at individuals
          under the age of 18. We do not knowingly collect personal data from children.
          If we become aware that we have collected personal data from a child without
          appropriate consent, we will take steps to delete that information promptly.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          12. Changes to This Policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our
          practices, technology, legal requirements, or other factors. We will notify
          you of any material changes by email or through a prominent notice on the
          Platform at least 14 days before the changes take effect.
        </p>
        <p className="mt-3">
          We encourage you to review this Privacy Policy periodically for the latest
          information on our privacy practices.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          13. Contact Us
        </h2>
        <p>
          If you have any questions about this Privacy Policy or wish to exercise your
          data protection rights, please contact us:
        </p>
        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-dark-200 font-medium">Qall Technologies Ltd — Data Protection</p>
          <p>Email: privacy@theqall.com</p>
          <p>Website: www.theqall.com</p>
        </div>
        <p className="mt-4">
          If you are not satisfied with our response, you have the right to lodge a
          complaint with the Information Commissioner&apos;s Office (ICO):
        </p>
        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-dark-200 font-medium">Information Commissioner&apos;s Office</p>
          <p>Website: ico.org.uk</p>
          <p>Telephone: 0303 123 1113</p>
        </div>
      </section>
    </LegalPage>
  );
}
