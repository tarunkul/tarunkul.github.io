# MapMyVisitors Tracker Design

## Goal

Add anonymous visitor analytics to the portfolio using the owner-provided MapMyVisitors widget. The tracker must load on every page visit without adding a visible map or disturbing the portfolio layout.

## Selected approach

Use the recommended MapMyVisitors JavaScript embed in the document body. Place it in a dedicated, fixed one-pixel container at the bottom-right corner. The container will be clipped and visually transparent so the generated map cannot affect layout or become an accidental interactive control.

The site will also include a short, visible analytics disclosure linking to MapMyVisitors' privacy policy. This keeps the tracker itself unobtrusive while telling visitors that anonymous traffic analytics are used.

## Files and responsibilities

- `index.html`
  - Add the disclosure to the footer.
  - Add the owner-provided MapMyVisitors script immediately before the existing site scripts and before `</body>`.
  - Keep the third-party tracker isolated from the portfolio's own JavaScript.
- `styles.css`
  - Style the disclosure as subdued footer copy with an accessible link.
  - Constrain the tracker host to a fixed one-pixel box with hidden overflow, zero opacity, and no pointer interaction.
- `README.md`
  - Replace any claim that no visitor data is collected with an accurate explanation of anonymous third-party analytics.

## Data flow and privacy

When a visitor loads the portfolio, their browser requests the MapMyVisitors script. MapMyVisitors records traffic metadata such as a page view, approximate location derived from the IP address, referrer, and device/browser information, then exposes aggregate statistics at the owner's MapMyVisitors dashboard.

The integration does not identify visitors by name and does not send contact-form contents to MapMyVisitors. A disclosure will link to `https://mapmyvisitors.com/b/policy` for details. The tracking request must load eagerly; it must not depend on scrolling to the footer.

## Failure behavior

The portfolio must remain fully usable if MapMyVisitors is blocked, offline, or slow. The embed will have no dependency on the site's navigation, theme, or contact-form code. No site content will wait for the analytics request.

## Accessibility and layout

The invisible tracker host will be hidden from assistive technology and keyboard interaction. The visible disclosure remains readable and keyboard-accessible. The one-pixel fixed box will not add document width, height, or mobile overflow.

## Verification

- Confirm the provider URL, public widget identifier, and script token match the supplied snippet.
- Confirm the script appears between `<body>` and `</body>`.
- Confirm there is only one MapMyVisitors embed.
- Validate that the tracker host cannot alter page layout or receive pointer input.
- Verify the disclosure and README accurately describe anonymous analytics.
- Run the existing project checks and inspect desktop/mobile rendering.
- Confirm a request to `mapmyvisitors.com/map.js` occurs when the page loads, while simulating a blocked request does not break the site.

