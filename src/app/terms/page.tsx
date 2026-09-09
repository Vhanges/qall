import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Qall Terms of Service — the terms and conditions governing your use of the Qall insurance CRM platform.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="15 February 2026">
      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          1. Agreement to Terms
        </h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you
          (&quot;Client,&quot; &quot;you,&quot; or &quot;your&quot;) and Qall Technologies Ltd (&quot;Qall,&quot; &quot;we,&quot; &quot;us,&quot;
          or &quot;our&quot;), a company registered in England and Wales, governing your access to and
          use of the Qall platform, including all associated software, APIs, dashboards,
          mobile applications, and related services (collectively, the &quot;Platform&quot;).
        </p>
        <p className="mt-3">
          By accessing or using the Platform, you acknowledge that you have read, understood,
          and agree to be bound by these Terms. If you are entering into these Terms on behalf
          of an organisation, you represent and warrant that you have the authority to bind
          that organisation to these Terms.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          2. Description of Services
        </h2>
        <p>
          Qall provides a cloud-based customer relationship management (CRM) platform
          designed specifically for insurance brokerages, managing general agents (MGAs),
          and insurance distribution networks. The Platform includes, but is not limited to:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Advisor performance tracking and benchmarking dashboards</li>
          <li>Automated commission calculation, reconciliation, and audit trails</li>
          <li>Lead capture, scoring, routing, and lifecycle management</li>
          <li>Client portfolio management and engagement tools</li>
          <li>Real-time revenue analytics and reporting</li>
          <li>AI-powered insights and capacity optimisation tools</li>
          <li>Integration with third-party insurance providers, carriers, and data sources</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          3. Account Registration and Security
        </h2>
        <p>
          To access the Platform, you must register for an account and provide accurate,
          complete, and current information. You are responsible for maintaining the
          confidentiality of your account credentials and for all activities that occur
          under your account.
        </p>
        <p className="mt-3">
          You agree to: (a) immediately notify Qall of any unauthorised use of your
          account or any other breach of security; (b) ensure that all users within your
          organisation comply with these Terms; and (c) not share account credentials
          with unauthorised third parties.
        </p>
        <p className="mt-3">
          Qall employs industry-standard security measures including encryption at rest
          and in transit, role-based access controls, and regular penetration testing.
          However, no method of electronic transmission or storage is 100% secure, and
          we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          4. Subscription and Payment Terms
        </h2>
        <p>
          Access to the Platform is provided on a subscription basis. Subscription plans,
          pricing, and billing cycles are set out in your Order Form or as displayed on
          the Platform at the time of purchase.
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>
            <strong className="text-dark-200">Billing:</strong> Fees are invoiced in advance on a
            monthly or annual basis as specified in your subscription plan. All fees are
            quoted in GBP unless otherwise stated.
          </li>
          <li>
            <strong className="text-dark-200">Late Payments:</strong> Overdue invoices shall accrue
            interest at 4% above the Bank of England base rate, calculated daily from the
            due date until payment is received in full.
          </li>
          <li>
            <strong className="text-dark-200">Price Changes:</strong> Qall reserves the right to
            modify pricing with 30 days&apos; written notice prior to your next renewal period.
            Continued use of the Platform after a price change constitutes acceptance of
            the new pricing.
          </li>
          <li>
            <strong className="text-dark-200">Taxes:</strong> All fees are exclusive of VAT and
            other applicable taxes, which shall be charged in addition where required by law.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          5. Client Data and Ownership
        </h2>
        <p>
          You retain all rights, title, and interest in and to the data you submit to the
          Platform (&quot;Client Data&quot;), including policyholder information, commission records,
          advisor performance data, and client portfolios. Qall does not claim ownership
          of your Client Data.
        </p>
        <p className="mt-3">
          You grant Qall a limited, non-exclusive licence to process, store, and transmit
          Client Data solely for the purpose of providing and improving the Platform.
          Qall may use anonymised and aggregated data derived from Client Data for
          analytics, benchmarking, and service improvement, provided such data cannot
          be used to identify any individual or organisation.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          6. Acceptable Use
        </h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>Use the Platform for any unlawful purpose or in violation of any applicable regulation, including but not limited to the Financial Conduct Authority (FCA) rules</li>
          <li>Upload or transmit malicious code, viruses, or any material that could damage or interfere with the Platform</li>
          <li>Attempt to reverse engineer, decompile, or disassemble any part of the Platform</li>
          <li>Circumvent or disable any security features or access controls</li>
          <li>Use the Platform to store or process data in violation of data protection laws, including the UK GDPR and Data Protection Act 2018</li>
          <li>Sublicense, resell, or redistribute access to the Platform without prior written consent from Qall</li>
        </ul>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          7. Intellectual Property
        </h2>
        <p>
          The Platform, including all software, algorithms, user interfaces, designs,
          documentation, and trademarks, is the exclusive property of Qall Technologies Ltd
          and is protected by intellectual property laws. Nothing in these Terms grants you
          any right, title, or interest in the Platform beyond the limited right to use it
          in accordance with these Terms.
        </p>
        <p className="mt-3">
          Any feedback, suggestions, or feature requests you provide to Qall may be used
          by Qall without obligation or compensation to you.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          8. Service Level and Availability
        </h2>
        <p>
          Qall targets 99.9% uptime for the Platform, measured on a monthly basis, excluding
          scheduled maintenance windows. Scheduled maintenance will be communicated at
          least 48 hours in advance where reasonably practicable.
        </p>
        <p className="mt-3">
          In the event of prolonged unscheduled downtime exceeding 0.1% in any calendar
          month, affected clients on annual plans may request service credits in accordance
          with the Service Level Agreement (SLA) provided in their Order Form.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          9. Third-Party Integrations
        </h2>
        <p>
          The Platform may integrate with or provide access to third-party services,
          including insurance carriers, payment processors, and data providers. Qall is
          not responsible for the availability, accuracy, or practices of any third-party
          service. Your use of third-party integrations is subject to the respective
          third party&apos;s terms and conditions.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          10. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, Qall&apos;s total aggregate liability arising
          out of or in connection with these Terms shall not exceed the total fees paid by
          you to Qall in the twelve (12) months immediately preceding the event giving rise
          to the claim.
        </p>
        <p className="mt-3">
          Qall shall not be liable for any indirect, incidental, special, consequential,
          or punitive damages, including but not limited to loss of profits, loss of
          revenue, loss of commissions, loss of data, or business interruption, however
          caused and under any theory of liability.
        </p>
        <p className="mt-3">
          Nothing in these Terms excludes or limits liability for: (a) death or personal
          injury caused by negligence; (b) fraud or fraudulent misrepresentation; or
          (c) any other liability that cannot be excluded or limited under applicable law.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          11. Term and Termination
        </h2>
        <p>
          These Terms commence on the date you first access the Platform and continue
          for the duration of your subscription period. Either party may terminate these
          Terms:
        </p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>By providing 30 days&apos; written notice prior to the end of the current billing period</li>
          <li>Immediately, if the other party commits a material breach that remains unremedied for 14 days after written notice</li>
          <li>Immediately, if the other party enters administration, liquidation, or becomes insolvent</li>
        </ul>
        <p className="mt-3">
          Upon termination, your access to the Platform will cease. You may request
          an export of your Client Data within 30 days of termination, after which
          Qall reserves the right to delete your Client Data in accordance with its
          data retention policies.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          12. Indemnification
        </h2>
        <p>
          You agree to indemnify, defend, and hold harmless Qall and its officers,
          directors, employees, and agents from and against any claims, damages, losses,
          liabilities, and expenses (including reasonable legal fees) arising out of or
          in connection with: (a) your use of the Platform; (b) your breach of these Terms;
          (c) your violation of any applicable law or regulation; or (d) any Client Data
          you submit to the Platform.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          13. Governing Law and Disputes
        </h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of
          England and Wales. Any dispute arising out of or in connection with these Terms
          shall be subject to the exclusive jurisdiction of the courts of England and Wales.
        </p>
        <p className="mt-3">
          Before initiating formal proceedings, both parties agree to attempt to resolve
          any dispute through good-faith negotiation for a period of not less than 30 days.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          14. Modifications to Terms
        </h2>
        <p>
          Qall reserves the right to modify these Terms at any time. Material changes
          will be communicated via email or through an in-platform notification at least
          14 days before taking effect. Your continued use of the Platform after such
          changes constitutes acceptance of the revised Terms.
        </p>
      </section>

      <section>
        <h2 className="font-heading font-semibold text-xl text-dark-100 mb-3">
          15. Contact
        </h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <div className="mt-3 p-4 rounded-xl bg-white/5 border border-white/10">
          <p className="text-dark-200 font-medium">Qall Technologies Ltd</p>
          <p className="mt-1">Email: legal@qall.ai</p>
          <p>Website: www.qall.ai</p>
        </div>
      </section>
    </LegalPage>
  );
}
