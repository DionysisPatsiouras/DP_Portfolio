DP_Portfolio is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

To create a production build, run `npm run build`. The build uses webpack so it also works in environments that restrict Turbopack's local worker process.

## Contact form

The contact form sends directly from the browser with `@emailjs/browser`. Add `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, and `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` to `.env.development` for local use and to your host's environment before building for production. See `.env.example` for the variable names. Do not expose the EmailJS private key with a `NEXT_PUBLIC_` prefix.

Paste `templates/emailjs-contact.html` into the EmailJS template's HTML content. Set **To Email** to your own inbox, **Subject** to `{{title}}`, and **Reply-To** to `{{email}}`. Keep **From Email** set to the address of the connected email service. The HTML uses `{{name}}`, `{{email}}`, `{{title}}`, and `{{message}}`, matching the fields sent by the contact form. Put the saved template's actual ID in `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
