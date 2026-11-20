# Certification page

- Astro renders the credential, verification links, and coverage note in the initial HTML.
- The availability, fault-isolation, and cost examples cite the AWS SAA-C03 exam guide. The
  `#cert-coverage` disclosure uses native details and summary.
- The Credly badge is a separate React island. The iframe starts when that island becomes
  visible and keeps the same Credly host, load event, timeout, and retry mechanism. The iframe
  uses a no-referrer policy. Direct Credly and AWS verification links remain available outside
  the frame.
- `.c-cert-container` places the paper note beside the credential on wide screens and below it
  on narrow screens. The credential uses the active palette’s brand color as the accent.
