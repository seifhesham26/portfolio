# Ice wyvern portfolio

Rebuild Seif El-Den Hesham's existing Next.js portfolio as a cinematic arctic
experience using the supplied demon dragon, Three.js, and GSAP. Preserve the
project data, experience, education, certificates, CV, social links, and EmailJS flow.

The chosen direction is midnight navy, icy off-white, desaturated cyan, large
Outfit typography, sharp panels, and an original frozen landscape. The hero pairs
the developer's introduction with a large, animated wyvern. Projects use their real
screenshots in a desktop horizontal gallery; mobile uses a vertical layout. About,
skills, experience, education, credentials, and contact each have a distinct layout.

One fixed, pointer-transparent Three.js canvas follows the entire page. The existing
wyvern anatomy and flying clip remain intact. Frost-blue physical materials, an AO
map, procedural ice variation, cold rim lights, and a sparse snow field create the
ice treatment. A tested continuous flight path provides changes in position,
scale, banking, and direction as the user scrolls. GSAP handles hero staging,
scroll reveals, project pinning, image parallax, and hover feedback.

The 26 MB source must be optimized with unused animations removed and Meshopt
compression. The renderer is dynamically imported, caps pixel ratio, suspends
rendering in hidden tabs, uses a smaller composition on mobile, and disposes all
resources when unmounted. Reduced motion disables flight, pinning, and automatic
animation; a manual motion button can pause the experience. If WebGL or the model
fails, the landscape and all portfolio content remain available with a brief status.

Validation: meaningful flight-path tests, TypeScript, ESLint, production build,
and browser checks for desktop, mobile, navigation, motion controls, contact form
validation, and console errors. Sending real messages is outside verification.
