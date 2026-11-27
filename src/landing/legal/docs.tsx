import { pricing, siteConfig } from '../config';
import { Fill, Owner, type LegalDoc } from './LegalLayout';

const { minEmployees, trialDays } = pricing;
const P = siteConfig.legal;

function ContactBlock() {
  return (
    <div className="lg-contact">
      <strong>
        <Owner />
      </strong>
      <span>
        <Fill k="address" />
      </span>
      <span>
        Email: <Fill k="supportEmail" />
      </span>
    </div>
  );
}

function GrievanceBlock() {
  return (
    <div className="lg-contact">
      <strong>Grievance Officer</strong>
      <span>
        <Fill k="grievanceOfficer" />
      </span>
      <span>
        Email: <Fill k="grievanceEmail" />
      </span>
      <span>
        Address: <Fill k="address" />
      </span>
    </div>
  );
}

/* ───────────────────────── Privacy Policy ───────────────────────── */

export const privacyPolicy: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  intro: (
    <>
      <p>
        This Privacy Policy explains how <Owner /> (“we”, “us”) collects, uses, shares and protects personal data through
        the TeamBridge website and the TeamBridge workspace (together, the “Service”).
      </p>
      <p>
        We process personal data in line with the Digital Personal Data Protection Act, 2023, the Information Technology
        Act, 2000 and the rules made under them.
      </p>
    </>
  ),
  sections: [
    {
      id: 'roles',
      title: 'Our role',
      body: (
        <>
          <p>
            <strong>For our website, sign-up and billing</strong>, we decide why and how your personal data is used, so we
            act as the Data Fiduciary.
          </p>
          <p>
            <strong>For data your organisation adds to TeamBridge</strong>, such as employee profiles, attendance, tasks,
            projects, meetings, chat messages, reimbursements and customer records, your organisation is the Data
            Fiduciary and we process that data on its behalf as a Data Processor. If you are an employee using TeamBridge
            through your employer, please contact your employer first about your data.
          </p>
        </>
      ),
    },
    {
      id: 'collect',
      title: 'Information we collect',
      body: (
        <>
          <h3>Information you give us</h3>
          <ul>
            <li>
              <strong>Account and contact details:</strong> name, work email, mobile number, company name and team size,
              for example when you start a trial, subscribe or book a demo.
            </li>
            <li>
              <strong>Billing details:</strong> chosen plan, billing period, number of employees, invoice and GST details,
              and payment status.
            </li>
            <li>
              <strong>Support messages:</strong> anything you send us when you contact us.
            </li>
          </ul>
          <h3>Information your organisation adds to TeamBridge</h3>
          <ul>
            <li>Employee profiles, departments, roles and permissions.</li>
            <li>Attendance and leave records.</li>
            <li>Tasks, projects, meetings and team chat.</li>
            <li>Finance records such as invoices, costs and reimbursement requests.</li>
            <li>Customer and lead records in the CRM.</li>
            <li>
              Meeting recordings and transcripts, only where your organisation enables recording and participants consent.
            </li>
          </ul>
          <h3>Information collected automatically</h3>
          <ul>
            <li>Log and device data, such as IP address, browser type, pages visited and the time of each visit.</li>
            <li>Cookies and similar technologies, as described in the Cookies section.</li>
          </ul>
          <h3>Payment information</h3>
          <p>
            Payments are processed by our payment partner, Razorpay. Card, UPI and bank details are entered on Razorpay’s
            secure pages and are handled under Razorpay’s own privacy policy. We do not store full card numbers. We receive
            only what we need to confirm and record a payment, such as the transaction ID, amount, payment method type
            and status.
          </p>
        </>
      ),
    },
    {
      id: 'use',
      title: 'How we use information',
      body: (
        <ul>
          <li>To create and manage your account, free trial and subscription.</li>
          <li>To provide, maintain and secure the Service, including preventing fraud and misuse.</li>
          <li>To process payments, issue invoices and meet tax and accounting obligations.</li>
          <li>To respond to support requests and demo bookings.</li>
          <li>To send service messages, such as trial reminders, billing notices and important product changes.</li>
          <li>To understand how the Service is used, so we can improve it.</li>
          <li>To comply with the law and respond to lawful requests from authorities.</li>
        </ul>
      ),
    },
    {
      id: 'basis',
      title: 'Consent and legal grounds',
      body: (
        <>
          <p>
            We process your personal data with your consent, which you give when you sign up, start a trial or contact us,
            or for other legitimate uses permitted by law, such as meeting legal obligations.
          </p>
          <p>
            You can withdraw your consent at any time by contacting us. Withdrawal does not affect processing that already
            happened. If you withdraw consent that we need to provide the Service, we may have to close your account.
          </p>
        </>
      ),
    },
    {
      id: 'ai',
      title: 'AI features',
      body: (
        <p>
          Some features use AI to process content in your workspace, for example to turn a voice note into a draft task or
          to summarise a meeting. This content is processed only to provide the feature to your organisation. AI
          suggestions are reviewed by a person before they take effect. We do not sell your content or use it to advertise
          to you.
        </p>
      ),
    },
    {
      id: 'share',
      title: 'Sharing of information',
      body: (
        <>
          <p>We do not sell personal data. We share it only:</p>
          <ul>
            <li>
              With service providers who help us run the Service, such as cloud hosting, email delivery and Razorpay for
              payments. They may use the data only to provide their service to us.
            </li>
            <li>With people in your own organisation, according to the roles and permissions your organisation sets.</li>
            <li>When required by law, court order or a government authority.</li>
            <li>To protect the rights, safety and property of our users, the public or us.</li>
            <li>
              As part of a merger, acquisition or sale of assets, in which case we will tell you before your data comes
              under a different privacy policy.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: 'retention',
      title: 'How long we keep data',
      body: (
        <>
          <p>
            We keep account and workspace data while your subscription or trial is active. After your account is closed,
            we delete or anonymise workspace data within a reasonable period, unless your organisation asks us to export
            it first or the law requires us to keep it longer.
          </p>
          <p>We keep billing and invoice records for as long as tax and accounting laws require.</p>
        </>
      ),
    },
    {
      id: 'security',
      title: 'Security',
      body: (
        <p>
          We use reasonable security practices to protect personal data, including encrypted connections, role-based
          access controls and restricted internal access. No system is completely secure, so we cannot guarantee absolute
          security. If a personal data breach occurs, we will notify affected users and the Data Protection Board of India
          as the law requires.
        </p>
      ),
    },
    {
      id: 'rights',
      title: 'Your rights',
      body: (
        <>
          <p>Under the Digital Personal Data Protection Act, 2023, you have the right to:</p>
          <ul>
            <li>Get a summary of the personal data we process about you, and how we process it.</li>
            <li>Ask us to correct, complete, update or erase your personal data.</li>
            <li>Have your grievances addressed.</li>
            <li>Nominate another person to exercise your rights if you die or become unable to do so.</li>
          </ul>
          <p>
            To use these rights, contact our Grievance Officer using the details below. For data your organisation added
            to TeamBridge, we will pass your request to your organisation and help it respond.
          </p>
        </>
      ),
    },
    {
      id: 'children',
      title: 'Children',
      body: (
        <p>
          TeamBridge is a business service and is not meant for anyone under 18. We do not knowingly collect personal data
          from children. If you think a child has given us personal data, please contact us and we will delete it.
        </p>
      ),
    },
    {
      id: 'transfers',
      title: 'Where data is processed',
      body: (
        <p>
          Our service providers may process data in India or in other countries. Where data is transferred outside India,
          we do so only as permitted under Indian law and with appropriate safeguards.
        </p>
      ),
    },
    {
      id: 'cookies',
      title: 'Cookies',
      body: (
        <p>
          We use cookies and similar technologies that are needed to keep you signed in, remember your preferences and keep
          the Service secure. We may also use analytics cookies to understand how the website is used. You can block or
          delete cookies in your browser settings, but parts of the Service may then not work properly.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to this policy',
      body: (
        <p>
          We may update this policy from time to time. We will change the “Last updated” date above and, for significant
          changes, notify account owners by email or in the product before the change takes effect.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Grievance Officer and contact',
      body: (
        <>
          <p>
            For questions, complaints or requests about your personal data, contact our Grievance Officer. We will
            acknowledge your complaint and respond within the time required by law.
          </p>
          <GrievanceBlock />
          <p>
            If you are not satisfied with our response, you may contact the Data Protection Board of India once it accepts
            complaints.
          </p>
        </>
      ),
    },
  ],
};

/* ───────────────────────── Terms & Conditions ───────────────────────── */

export const termsAndConditions: LegalDoc = {
  slug: 'terms',
  title: 'Terms & Conditions',
  intro: (
    <>
      <p>
        These Terms & Conditions (“Terms”) are an agreement between <Owner /> (“we”, “us”) and the organisation that
        signs up for TeamBridge (“Customer”, “you”). They apply to the TeamBridge website and the TeamBridge workspace
        (together, the “Service”).
      </p>
      <p>
        By starting a trial, subscribing or using the Service, you agree to these Terms. If you accept them for an
        organisation, you confirm that you are authorised to do so.
      </p>
    </>
  ),
  sections: [
    {
      id: 'service',
      title: 'The Service',
      body: (
        <p>
          TeamBridge is a cloud workspace for managing employees, attendance, tasks, projects, meetings, customers and
          related operations. The features available to you depend on your plan, as described on our pricing page. Some
          modules are offered as paid add-ons.
        </p>
      ),
    },
    {
      id: 'accounts',
      title: 'Accounts',
      body: (
        <ul>
          <li>The Service is for business use. You must be at least 18 and able to enter into a binding contract.</li>
          <li>You must give accurate sign-up and billing details and keep them up to date.</li>
          <li>
            You are responsible for everyone you invite to your workspace, for the roles and permissions you give them,
            and for keeping sign-in details secure.
          </li>
          <li>Tell us immediately if you suspect unauthorised use of your account.</li>
        </ul>
      ),
    },
    {
      id: 'trial',
      title: 'Free trial',
      body: (
        <ul>
          <li>
            New customers can try a plan free for {trialDays} days. No payment is taken for the trial period.
          </li>
          <li>At the end of the trial, you can subscribe to keep using the Service. If you don’t, access ends.</li>
          <li>We offer one free trial per organisation and may refuse or end a trial that is being misused.</li>
        </ul>
      ),
    },
    {
      id: 'pricing',
      title: 'Plans, pricing and billing',
      body: (
        <ul>
          <li>
            Plans are priced per employee per month, with a minimum of {minEmployees} employees per subscription.
          </li>
          <li>
            You can pay monthly, or yearly in advance at a discounted rate. Yearly subscriptions are billed upfront for
            the full year.
          </li>
          <li>
            All prices are in Indian Rupees (INR) and exclude GST and other applicable taxes, which are added to your
            invoice.
          </li>
          <li>Payments are processed by our payment partner, Razorpay. You agree to Razorpay’s terms when you pay.</li>
          <li>
            If you add employees during a billing period, the additional employees are charged for the rest of that
            period. If you reduce employees, the lower count applies from the next billing period.
          </li>
          <li>Custom integrations, dedicated hosting and on-site deployment are quoted separately.</li>
        </ul>
      ),
    },
    {
      id: 'renewal',
      title: 'Renewal and price changes',
      body: (
        <>
          <p>
            Subscriptions renew automatically at the end of each billing period, for the same plan and employee count,
            unless you cancel before the renewal date.
          </p>
          <p>
            We may change our prices. Any change applies from your next renewal, and we will tell you at least 30 days in
            advance.
          </p>
        </>
      ),
    },
    {
      id: 'payment-failure',
      title: 'Late or failed payments',
      body: (
        <p>
          If a payment fails or is overdue, we will notify you and may retry the payment. If it remains unpaid after the
          notice period we give you, we may suspend access until payment is made. Your data is not deleted because of a
          suspension.
        </p>
      ),
    },
    {
      id: 'cancellation',
      title: 'Cancellation and refunds',
      body: (
        <p>
          You can cancel your subscription at any time. How cancellation works and when refunds are given is set out in
          our <a href={P.cancellation}>Cancellation & Refund Policy</a>, which forms part of these Terms.
        </p>
      ),
    },
    {
      id: 'use',
      title: 'Acceptable use',
      body: (
        <>
          <p>You agree not to:</p>
          <ul>
            <li>Break any law, or infringe anyone’s rights, through the Service.</li>
            <li>Upload malware or try to gain unauthorised access to the Service or other customers’ data.</li>
            <li>Disrupt, overload or reverse engineer the Service, except where the law allows it.</li>
            <li>Resell or sublicense the Service without our written permission.</li>
            <li>Use the Service to send spam or unlawful content.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'data',
      title: 'Your data and responsibilities',
      body: (
        <>
          <p>
            You own the data you and your team add to TeamBridge (“Customer Data”). You give us permission to host, process
            and display Customer Data only to provide and support the Service. Our{' '}
            <a href={P.privacy}>Privacy Policy</a> explains how we handle personal data.
          </p>
          <p>
            As the employer, you are responsible for having a lawful basis to process your employees’ personal data in
            TeamBridge, for informing them about it, and for getting participants’ consent before recording meetings.
          </p>
          <p>
            You can export your Customer Data while your account is active. After cancellation or termination, you can ask
            us to export it within a reasonable period before it is deleted.
          </p>
        </>
      ),
    },
    {
      id: 'ai',
      title: 'AI features',
      body: (
        <p>
          AI features, such as draft tasks or meeting summaries, produce suggestions that may be incomplete or incorrect.
          You are responsible for reviewing them before you rely on or approve them.
        </p>
      ),
    },
    {
      id: 'ip',
      title: 'Intellectual property',
      body: (
        <p>
          We own the Service, including its software, design and branding. During your subscription, we give you a
          limited, non-exclusive, non-transferable right to use the Service for your internal business purposes. If you
          send us feedback, we may use it without any obligation to you.
        </p>
      ),
    },
    {
      id: 'confidentiality',
      title: 'Confidentiality',
      body: (
        <p>
          Each party will keep the other’s non-public information confidential and use it only for the purpose of these
          Terms, except where disclosure is required by law.
        </p>
      ),
    },
    {
      id: 'third-party',
      title: 'Third-party services',
      body: (
        <p>
          The Service may connect with third-party services, such as payment, email or calendar providers. Your use of them
          is governed by their own terms, and we are not responsible for them.
        </p>
      ),
    },
    {
      id: 'availability',
      title: 'Availability and support',
      body: (
        <p>
          We work to keep the Service available and secure, but we do not guarantee that it will be uninterrupted or
          error-free. We may carry out maintenance, ideally with advance notice. Support is provided as described for your
          plan, with priority support on plans that include it. Specific service levels apply only if agreed in writing.
        </p>
      ),
    },
    {
      id: 'warranty',
      title: 'Disclaimer',
      body: (
        <p>
          Except as expressly stated in these Terms, the Service is provided “as is” and “as available”, and we disclaim
          all other warranties to the extent permitted by law.
        </p>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: (
        <p>
          To the extent permitted by law, neither party is liable for indirect, incidental or consequential losses, or for
          loss of profits, revenue or data. Our total liability arising from these Terms is limited to the fees you paid
          us for the Service in the 12 months before the claim arose.
        </p>
      ),
    },
    {
      id: 'indemnity',
      title: 'Indemnity',
      body: (
        <p>
          You agree to compensate us for claims and losses caused by Customer Data, or by your breach of these Terms or the
          law.
        </p>
      ),
    },
    {
      id: 'termination',
      title: 'Suspension and termination',
      body: (
        <p>
          We may suspend or end your access if you seriously breach these Terms, fail to pay, or if the law requires it.
          Where reasonable, we will give you notice and a chance to fix the problem first. Sections that by their nature
          should continue, such as payment obligations, liability and governing law, survive termination.
        </p>
      ),
    },
    {
      id: 'law',
      title: 'Governing law and disputes',
      body: (
        <p>
          These Terms are governed by the laws of India. The courts at <Fill k="jurisdiction" /> have exclusive
          jurisdiction over any dispute arising from them. We encourage you to contact us first so we can try to resolve
          any issue informally.
        </p>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to these Terms',
      body: (
        <p>
          We may update these Terms from time to time. We will change the “Last updated” date and, for significant changes,
          notify account owners at least 30 days before they take effect. If you keep using the Service after that, you
          accept the updated Terms.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      body: <ContactBlock />,
    },
  ],
};

/* ───────────────────────── Cancellation & Refund Policy ───────────────────────── */

export const cancellationPolicy: LegalDoc = {
  slug: 'cancellation',
  title: 'Cancellation & Refund Policy',
  intro: (
    <p>
      This policy explains how to cancel a TeamBridge trial or subscription and when refunds are given. It forms part of
      our <a href={P.terms}>Terms & Conditions</a>. TeamBridge is a digital service delivered online, so nothing is
      shipped or physically delivered.
    </p>
  ),
  sections: [
    {
      id: 'trial',
      title: 'Free trial',
      body: (
        <p>
          The {trialDays}-day free trial costs nothing, so there is nothing to refund. You can stop using it at any time.
          If you don’t subscribe by the end of the trial, access simply ends.
        </p>
      ),
    },
    {
      id: 'how',
      title: 'How to cancel',
      body: (
        <>
          <p>An account owner can cancel at any time, either:</p>
          <ul>
            <li>from billing settings in TeamBridge, where available, or</li>
            <li>
              by emailing <Fill k="supportEmail" /> from the account owner’s registered email address, with your company
              name.
            </li>
          </ul>
          <p>We will confirm the cancellation by email.</p>
        </>
      ),
    },
    {
      id: 'monthly',
      title: 'Monthly subscriptions',
      body: (
        <ul>
          <li>Cancellation takes effect at the end of the current monthly billing period.</li>
          <li>You keep access until then, and you won’t be charged again.</li>
          <li>We don’t give refunds or credits for unused days in a month you have already paid for.</li>
        </ul>
      ),
    },
    {
      id: 'yearly',
      title: 'Yearly subscriptions',
      body: (
        <ul>
          <li>Yearly subscriptions are billed upfront at a discounted rate.</li>
          <li>Cancelling stops the next renewal. You keep access until the end of the year you have paid for.</li>
          <li>
            We don’t give refunds for the unused part of a yearly subscription, except where required by law or under
            section 6 below.
          </li>
        </ul>
      ),
    },
    {
      id: 'changes',
      title: 'Plan and team size changes',
      body: (
        <ul>
          <li>Upgrades and added employees apply straight away and are charged for the rest of the billing period.</li>
          <li>
            Downgrades and reduced employee counts apply from the next billing period. They don’t create a refund for the
            current one.
          </li>
          <li>Paid add-ons can be cancelled separately and follow the same rules as your plan’s billing period.</li>
        </ul>
      ),
    },
    {
      id: 'refunds',
      title: 'When we do refund',
      body: (
        <>
          <p>We will refund you in full for:</p>
          <ul>
            <li>a duplicate payment for the same invoice,</li>
            <li>an amount charged incorrectly because of an error on our side, or</li>
            <li>a payment that was deducted from your account but did not complete on our side.</li>
          </ul>
          <p>
            Tell us within 30 days of the charge. Once a refund is approved, we start it within 7 working days. It goes
            back to the original payment method through our payment partner, Razorpay. Your bank may take a further 5–10
            working days to show it.
          </p>
        </>
      ),
    },
    {
      id: 'request',
      title: 'How to request a refund',
      body: (
        <p>
          Email <Fill k="supportEmail" /> with your company name, the payment date and amount, and the Razorpay payment ID
          or invoice number. We will reply within 3 working days.
        </p>
      ),
    },
    {
      id: 'after',
      title: 'Your data after cancellation',
      body: (
        <p>
          You can export your data before your access ends. After that, we keep it for a short period in case you return,
          then delete it, as explained in our <a href={P.privacy}>Privacy Policy</a>.
        </p>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      body: <ContactBlock />,
    },
  ],
};

export const LEGAL_DOCS = { privacy: privacyPolicy, terms: termsAndConditions, cancellation: cancellationPolicy };
