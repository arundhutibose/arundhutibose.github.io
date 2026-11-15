// Edit this file to change the site's text and links. Nothing else needs touching.

export const site = {
  name: 'Arundhuti Bose',
  byline: 'Artist & Art Psychotherapist',
  headline: "Sorry, I'm under construction",
  tagline: 'A new home for my paintings is being built. Open to commissions meanwhile.',
  instagram: {
    handle: 'boseitup',
    url: 'https://www.instagram.com/boseitup/',
  },
  letter: {
    recipient: 'Arundhuti Bose', // shown in the letter's "To" line
    email: 'boseitup11111@gmail.com',
    subject: 'Reaching out about your art',
    greeting: 'Dear Arundhuti,',
    signOff: 'Warmly,',
    // FormSubmit forwards the letter to `email`. No account or key needed; the
    // first letter ever sent triggers a one-time activation email to her inbox.
    endpoint: 'https://formsubmit.co/ajax/boseitup11111@gmail.com',
  },
}

export type Instagram = typeof site.instagram
export type Letter = typeof site.letter
