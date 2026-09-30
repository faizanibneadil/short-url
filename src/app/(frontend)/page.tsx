import React from "react"
import Link from "next/link"
import { URLShortener } from "@/blocks/URLShortener/component"
import { queryPageBySlug } from "@/utilities/queries/queryPageBySlug"
import { RichText } from "@/components/RitchText"
import { DefaultTypedEditorState } from "@payloadcms/richtext-lexical"
import dynamic from "next/dynamic"
import type { Params, SearchParams } from "@/types"
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  QrCode,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage(props: {
  params: Params
  searchParams: SearchParams
}) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  // Fetch optional home page content from Payload CMS
  const cmsPage = await queryPageBySlug({ slug: "home" })

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      {/* Hero Section */}
      <section className="relative w-full pt-12 md:pt-20 pb-16 md:pb-24 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center text-center">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[350px] bg-gradient-to-tr from-primary/20 via-indigo-500/15 to-purple-500/10 blur-[120px] -z-10 pointer-events-none rounded-full" />

        {/* Announcement Badge */}
        <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-2 duration-500 mx-auto">
          <Sparkles className="size-3.5 text-primary" />
          <span>Next-Gen Link Infrastructure for Teams</span>
          <span className="size-1 rounded-full bg-primary/40" />
          <Link
            href="#features"
            className="hover:underline flex items-center gap-0.5"
          >
            Explore <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl leading-[1.1] mb-6 mx-auto text-center">
          Shorten, Share & Track Your Links with{" "}
          <span className="bg-gradient-to-r from-primary via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Lightning Speed
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-normal leading-relaxed mb-10 mx-auto text-center">
          Transform long, cumbersome URLs into sleek, brand-focused links in seconds. Built for developers, creators, and high-growth teams.
        </p>

        {/* Shortener Box Container */}
        <div className="w-full max-w-3xl mb-12 shadow-2xl rounded-2xl mx-auto flex justify-center">
          <URLShortener
            blockProps={{
              blockType: "urlShortener",
              heading: "Create Short Link",
              description: null,
            }}
            params={params}
            searchParams={searchParams}
          />
        </div>

        {/* CMS Content Fallback if configured */}
        {cmsPage?.content && (
          <div className="w-full max-w-3xl text-center my-8 p-6 rounded-2xl bg-card border border-border mx-auto flex flex-col items-center">
            <RichText
              data={cmsPage.content as DefaultTypedEditorState}
              params={params}
              searchParams={searchParams}
              blocks={{
                urlShortener: ({ node }) => (
                  <URLShortener
                    blockProps={node.fields}
                    params={params}
                    searchParams={searchParams}
                  />
                ),
              }}
              inlineBlocks={{
                rotate_text: ({ node }) => {
                  const RotateText = dynamic(() =>
                    import("@/components/RotatingText").then(
                      ({ RotatingText }) => ({
                        default: RotatingText,
                      })
                    )
                  )
                  return (
                    <RotateText
                      texts={node.fields.texts}
                      mainClassName={node.fields.main_class_name!}
                      rotationInterval={node.fields.rotation_interval!}
                      staggerDuration={node.fields.stagger_duration!}
                      staggerFrom={
                        node.fields.stagger_from === "number"
                          ? node.fields.stagger_from_value_in_number!
                          : node.fields.stagger_from!
                      }
                      splitLevelClassName={node.fields.split_level_class_name!}
                      splitBy={node.fields.split_by!}
                      loop={node.fields.enable_loop!}
                      auto={node.fields.enable_auto!}
                    />
                  )
                },
              }}
            />
          </div>
        )}

        {/* Trust Stats Counter Bar */}
        <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm mx-auto text-center">
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-black text-foreground">
              99.99%
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">
              Uptime SLA
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-black text-foreground">
              &lt; 50ms
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">
              Global Latency
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-black text-foreground">
              1M+
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">
              Links Generated
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl md:text-3xl font-black text-foreground">
              100%
            </span>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">
              Free & Secure
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="w-full py-20 bg-muted/20 border-y border-border/40 flex flex-col items-center justify-center text-center">
        <div className="max-w-6xl w-full mx-auto px-4 flex flex-col items-center justify-center">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <h2 className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
              Powerful Features
            </h2>
            <p className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Everything you need to manage your links like a pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col items-center text-center">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Ultra-Fast Redirection
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Powered by Cloudflare Vercel edge deployment, ensuring your short links redirect in under 50 milliseconds worldwide.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col items-center text-center">
              <div className="size-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BarChart3 className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Real-Time Analytics
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor click counts, geographic origins, device distribution, and traffic sources with deep analytical insight.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col items-center text-center">
              <div className="size-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Bank-Grade Security
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatic HTTPS encryption, spam domain filtering, and malicious link protection keep your audience safe.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col items-center text-center">
              <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <SlidersHorizontal className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Custom Slugs & Branding
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Personalize link paths to enhance brand trust, improve click-through rates, and keep URLs memorable.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col items-center text-center">
              <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Developer REST API
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Seamlessly integrate link creation into your web apps, mobile products, or CI workflows via lightweight API endpoints.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/50 transition-all hover:shadow-xl group flex flex-col items-center text-center">
              <div className="size-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <QrCode className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Instant QR Code Generator
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every shortened link comes with a downloadable high-resolution vector QR code ready for print or digital media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Developer API Section */}
      <section id="api" className="w-full py-20 px-4 max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-center lg:text-left w-full">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="text-xs uppercase tracking-widest text-primary font-bold block mb-2">
              Built for Developers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Integrate short link generation with one line of code
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed max-w-lg">
              Our Payload CMS + Next.js architecture provides a clean RESTful interface to programmatically create and manage links from any app.
            </p>

            <ul className="space-y-3 mb-8 text-left">
              <li className="flex items-center gap-2.5 text-sm font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Payload CMS 3.0 powered headless engine</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Deterministic short code generation</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-medium">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>Postgres & Redis cache synchronization</span>
              </li>
            </ul>

            <Button
              size="lg"
              className="rounded-xl font-bold gap-2"
              render={
                <a
                  href="https://github.com/devslix"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Code2 className="size-4" />
                  <span>Explore Developer Docs</span>
                </a>
              }
              nativeButton={false}
            />
          </div>

          {/* Code snippet display */}
          <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-800 shadow-2xl font-mono text-xs md:text-sm text-zinc-300 overflow-x-auto text-left w-full max-w-lg mx-auto lg:mx-0">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-800">
              <div className="size-3 rounded-full bg-red-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
              <span className="text-zinc-500 text-xs ml-2">POST /api/urls</span>
            </div>
            <pre className="text-zinc-100">
              <code>{`// Create a short URL programmatically
const response = await fetch('https://url.devslix.com/api/urls', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    longURL: 'https://devslix.com/products/payload-cms-masterclass'
  })
});

const data = await response.json();
console.log(data.doc.shortURL);
// Output: "https://url.devslix.com/s/x9k2p"`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="w-full py-16 px-4 max-w-5xl mx-auto mb-16 flex flex-col items-center justify-center">
        <div className="relative w-full rounded-3xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 p-8 md:p-12 overflow-hidden text-center text-white shadow-2xl flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 relative z-10 text-center">
            Ready to streamline your links?
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm md:text-base mb-8 relative z-10 text-center">
            Start shortening URLs instantly with our production-grade platform. Fast, reliable, and completely free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
            <Button
              size="lg"
              className="bg-white text-zinc-950 hover:bg-white/90 rounded-full font-bold px-8 shadow-lg"
              render={
                <a href="#shorten" className="flex items-center gap-2">
                  <span>Get Started Now</span>
                  <ArrowRight className="size-4" />
                </a>
              }
              nativeButton={false}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
