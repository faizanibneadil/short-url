"use client";

import { motion, useReducedMotion } from "motion/react";
import type React from "react";
import type { ReactNode } from "react";
import { DataFromGlobalSlug } from "payload";
import Link from "next/link";
import { formatHref } from "@/utilities/formatHref";
import { Link2 } from "lucide-react";

type FooterLink = {
    title: string;
    href: string;
    icon?: ReactNode;
};
type FooterLinkGroup = {
    label: string;
    links: FooterLink[];
};

export function StickyFooter(props: { footerProps?: DataFromGlobalSlug<'footer'> }) {
    const {
        footerProps
    } = props || {}

    const {
        menus,
        slogan
    } = footerProps || {}

    return (
        <footer className="w-full border-t border-border/50 bg-card/50 backdrop-blur-md font-(family-name:--font-outfit) mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="size-8 rounded-lg bg-gradient-to-br from-primary via-indigo-500 to-purple-600 p-0.5 shadow-md shadow-primary/20">
                                <div className="size-full bg-background rounded-[6px] flex items-center justify-center">
                                    <Link2 className="size-3.5 text-primary" />
                                </div>
                            </div>
                            <span className="font-extrabold text-base tracking-tight">
                                url<span className="text-primary">.devslix</span>
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            {slogan || "Production-grade URL shortener built with Next.js and Payload CMS. Fast, secure, and reliable link infrastructure."}
                        </p>
                    </div>

                    {/* Menus from CMS or Fallback */}
                    {menus && menus.length > 0 ? (
                        menus.map((menu, index) => (
                            <AnimatedContainer delay={0.1 + index * 0.1} key={menu?.label || index}>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                                        {menu?.label}
                                    </h3>
                                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                                        {menu?.links?.map((link) => (
                                            <li key={link?.id}>
                                                <Link
                                                    className="hover:text-primary transition-colors"
                                                    href={formatHref(link)}
                                                >
                                                    {link?.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedContainer>
                        ))
                    ) : (
                        footerLinkGroups.map((group, index) => (
                            <AnimatedContainer delay={0.1 + index * 0.1} key={group.label}>
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                                        {group.label}
                                    </h3>
                                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                                        {group.links.map((link) => (
                                            <li key={link.title}>
                                                <Link
                                                    className="hover:text-primary transition-colors"
                                                    href={link.href}
                                                >
                                                    {link.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </AnimatedContainer>
                        ))
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} DevSlix. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Security
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const footerLinkGroups: FooterLinkGroup[] = [
    {
        label: "Product",
        links: [
            { title: "URL Shortener", href: "#shorten" },
            { title: "Analytics", href: "#features" },
            { title: "REST API", href: "#api" },
            { title: "Enterprise SLA", href: "#features" },
        ],
    },
    {
        label: "Resources",
        links: [
            { title: "Documentation", href: "#api" },
            { title: "API Reference", href: "#api" },
            { title: "System Status", href: "https://url.devslix.com" },
            { title: "GitHub Repo", href: "https://github.com/devslix" },
        ],
    },
    {
        label: "Company",
        links: [
            { title: "About DevSlix", href: "https://devslix.com" },
            { title: "Contact Support", href: "https://devslix.com" },
            { title: "Legal & Compliance", href: "#" },
        ],
    },
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
    children?: React.ReactNode;
    delay?: number;
};

function AnimatedContainer({
    delay = 0.1,
    children,
    ...props
}: AnimatedContainerProps) {
    const shouldReduceMotion = useReducedMotion();

    if (shouldReduceMotion) {
        return children;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            transition={{ delay, duration: 0.5 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
