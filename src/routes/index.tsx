import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
    Phone, MessageCircle, ArrowRight, Check, Star, ChevronDown, MapPin, Mail,
    Sparkles, Hammer, Truck, Wrench, IndianRupee, ShieldCheck, Clock, Ruler,
    Facebook, Instagram, Youtube, X, Menu, Award, Layers, Home as HomeIcon, Loader2,
} from "lucide-react";
import { submitLead } from "../lib/mailer";
import heroImg from "@/assets/hero-living.jpg";
import logo from "@/assets/logo.png";
import kitchenImg from "@/assets/kitchen.jpg";
import kitchen2Img from "@/assets/kitchen2.jpg";
import bedroomImg from "@/assets/bedroom.jpg";
import wardrobeImg from "@/assets/wardrobe.jpg";
import tvunitImg from "@/assets/tvunit.jpg";
import diningImg from "@/assets/dining.jpg";
import ceilingImg from "@/assets/ceiling.jpg";
import t1 from "@/assets/t1.jpg";
import t2 from "@/assets/t2.jpg";
import t3 from "@/assets/t3.jpg";

export const Route = createFileRoute("/")({
    head: () => ({
        meta: [
            { title: "Woodshine Interiors | Best Interior Designers in Trivandrum" },
            { name: "description", content: "Woodshine Interiors, trusted interior designers in Trivandrum. Expert home interiors, modular kitchens and free design consultation" },
            { name: "keywords", content: "interior designers in Trivandrum, home interiors Trivandrum, modular kitchen Trivandrum, home design Trivandrum, interior decorators Trivandrum, Woodshine Interiors" },
            { property: "og:title", content: "Woodshine Interiors | Best Interior Designers in Trivandrum" },
            { property: "og:description", content: "Woodshine Interiors, trusted interior designers in Trivandrum. Expert home interiors, modular kitchens and free design consultation" },
            { property: "og:image", content: "http://spaces.woodshine.in/og-banner.png" },
            { property: "og:url", content: "http://spaces.woodshine.in/" },
            { name: "twitter:title", content: "Woodshine Interiors | Best Interior Designers in Trivandrum" },
            { name: "twitter:description", content: "Woodshine Interiors, trusted interior designers in Trivandrum. Expert home interiors, modular kitchens and free design consultation" },
            { name: "twitter:image", content: "http://spaces.woodshine.in/og-banner.png" },
        ],
    }),
    component: Landing,
});

/* ---------- helpers ---------- */

function useReveal() {
    useEffect(() => {
        const els = document.querySelectorAll<HTMLElement>(".reveal");
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
            },
            { threshold: 0.12 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);
}

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [n, setN] = useState(0);
    useEffect(() => {
        if (!ref.current) return;
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) {
                    const start = performance.now();
                    const dur = 1600;
                    const tick = (t: number) => {
                        const p = Math.min(1, (t - start) / dur);
                        const eased = 1 - Math.pow(1 - p, 3);
                        setN(Math.round(to * eased));
                        if (p < 1) requestAnimationFrame(tick);
                    };
                    requestAnimationFrame(tick);
                    io.disconnect();
                }
            }
        }, { threshold: 0.5 });
        io.observe(ref.current);
        return () => io.disconnect();
    }, [to]);
    return <span ref={ref}>{n.toLocaleString("en-IN")}{suffix}</span>;
}

/* ---------- primitives ---------- */

function Section({ id, className = "", children }: { id?: string; className?: string; children: ReactNode }) {
    return <section id={id} className={`py-24 md:py-32 ${className}`}>{children}</section>;
}

function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/80 mb-5">
            <span className="h-px w-8 bg-primary/40" />
            {children}
        </div>
    );
}

function Btn({
    children, variant = "primary", href, onClick, className = "", type,
}: {
    children: ReactNode; variant?: "primary" | "ghost" | "outline" | "dark";
    href?: string; onClick?: () => void; className?: string; type?: "button" | "submit";
}) {
    const base = "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-300 will-change-transform";
    const styles = {
        primary: "bg-primary text-primary-foreground hover:shadow-[0_20px_50px_-15px_oklch(0.48_0.09_55/0.6)] hover:-translate-y-0.5",
        dark: "bg-accent text-accent-foreground hover:shadow-[0_20px_50px_-15px_oklch(0.18_0.005_60/0.6)] hover:-translate-y-0.5",
        outline: "border border-foreground/20 text-foreground hover:border-primary hover:text-primary",
        ghost: "text-foreground hover:text-primary",
    } as const;
    const cls = `${base} ${styles[variant]} ${className}`;
    const inner = <>{children}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>;
    if (href) return <a href={href} className={cls}>{inner}</a>;
    return <button type={type ?? "button"} onClick={onClick} className={cls}>{inner}</button>;
}

/* ---------- navbar ---------- */

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    useEffect(() => {
        const on = () => setScrolled(window.scrollY > 30);
        on(); window.addEventListener("scroll", on);
        return () => window.removeEventListener("scroll", on);
    }, []);
    const links = [
        ["Home", "#home"], ["Packages", "#packages"], ["Kitchens", "#kitchens"],
        ["Projects", "#projects"], ["Testimonials", "#testimonials"], ["FAQs", "#faq"], ["Contact", "#contact"],
    ];


    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
            <div className={`container-luxe transition-all duration-500 ${scrolled ? "" : ""}`}>
                <div className={`flex items-center justify-between rounded-full px-5 md:px-7 py-3 transition-all duration-500 ${scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent"}`}>
                    <a href="#home" className="flex items-center gap-2">
                        <img className="w-44" src={logo} alt="" />
                        {/* <span className="font-display text-lg leading-none">
                            Woodshine<span className="text-primary">.</span>
                            <span className="block text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-sans mt-0.5">Interiors</span>
                        </span> */}
                    </a>
                    <nav className="hidden lg:flex items-center gap-8 text-sm text-foreground/80">
                        {links.map(([l, h]) => (
                            <a key={l} href={h} className="relative py-1 hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 after:bg-primary hover:after:w-full after:transition-all">
                                {l}
                            </a>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        {!isMobile && (
                            <Btn
                                href="#contact"
                                className="px-5 py-2.5 text-xs"

                            >
                                Book Consultation
                            </Btn>
                        )}
                        <button
                            className="lg:hidden grid h-10 w-10 place-items-center rounded-full glass"
                            onClick={() => setOpen((o) => !o)}
                            aria-label="Menu"
                            style={{
                                display: 'grid',
                                height: '40px',
                                width: '40px',
                                placeItems: 'center',
                                borderRadius: '9999px',
                            }}
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                {open && (
                    <div className="lg:hidden mt-2 rounded-3xl glass p-6 shadow-[var(--shadow-soft)]">
                        <div className="flex flex-col gap-4">
                            {links.map(([l, h]) => (
                                <a key={l} href={h} onClick={() => setOpen(false)} className="text-base text-foreground/90 hover:text-primary">{l}</a>
                            ))}
                            <Btn href="#contact" className="mt-2">Book Consultation</Btn>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

/* ---------- hero + inline lead form ---------- */

function HeroLeadForm({ compact = false }: { compact?: boolean }) {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [ptype, setPtype] = useState("3BHK");

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await submitLead({
                data: {
                    name,
                    phone,
                    location,
                    propertyType: ptype,
                    source: "Hero Section (Free Consultation)",
                },
            });
            setSent(true);
        } catch (err: any) {
            console.error("Lead submission error:", err);
            setError(err?.message || "Failed to submit lead. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="rounded-3xl bg-card p-8 shadow-[var(--shadow-luxe)] text-center animate-fade-in">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success/10 text-success mb-4">
                    <Check className="h-7 w-7" />
                </div>
                <h3 className="font-display text-2xl mb-2">Thank you!</h3>
                <p className="text-sm text-muted-foreground">Our design consultant will call you within 24 hours to schedule your free consultation.</p>
            </div>
        );
    }
    return (
        <form onSubmit={onSubmit} className={`rounded-3xl bg-card/95 backdrop-blur-xl border border-white/40 shadow-[var(--shadow-luxe)] ${compact ? "p-6" : "p-7 md:p-8"}`}>
            <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-primary">Free Consultation</span>
            </div>
            <h3 className="font-display text-2xl md:text-[1.65rem] leading-tight mb-5">Get your free design estimate.</h3>
            {error && (
                <div className="mb-4 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                    {error}
                </div>
            )}
            <div className="space-y-3">
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary transition" />
                <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary transition" />
                <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location / City" className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm outline-none focus:border-primary transition" />
                <div className="grid grid-cols-3 gap-2">
                    {["2BHK", "3BHK", "Villa"].map((t) => (
                        <label key={t} className="cursor-pointer">
                            <input type="radio" name="ptype" checked={ptype === t} onChange={() => setPtype(t)} className="peer sr-only" />
                            <div className="rounded-full border border-border bg-background px-3 py-2.5 text-center text-xs peer-checked:bg-accent peer-checked:text-accent-foreground peer-checked:border-accent transition">{t}</div>
                        </label>
                    ))}
                </div>
            </div>
            <button type="submit" disabled={loading} className="mt-5 w-full rounded-full bg-primary text-primary-foreground py-3.5 text-sm font-medium tracking-wide hover:shadow-[0_20px_50px_-15px_oklch(0.48_0.09_55/0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Get Free Estimate"}
            </button>
            <p className="mt-3 text-[11px] text-muted-foreground text-center">Zero obligation · Reply within 24 hours</p>
        </form>
    );
}


function Hero() {
    return (
        <section id="home" className="relative pt-32 md:pt-40 pb-20 overflow-hidden">
            {/* Ambient shapes */}
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-accent/5 blur-3xl" />

            <div className="container-luxe relative">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    <div className="lg:col-span-7 animate-fade-up">
                        <Eyebrow>Complete Home Interiors</Eyebrow>
                        <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight">
                            Complete home interiors <em className="italic text-primary font-normal">designed around</em> your lifestyle.
                        </h1>
                        <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                            From modular kitchens to complete homes, Woodshine crafts beautifully considered spaces with premium materials, transparent pricing and professional installation.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Btn href="#contact">Book Consultation</Btn>
                            <Btn href="#packages" variant="outline">View Packages</Btn>
                        </div>
                        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                            {[
                                { icon: Layers, label: "Premium Materials" },
                                { icon: Hammer, label: "Factory Finished" },
                                { icon: Wrench, label: "Pro Installation" },
                                { icon: IndianRupee, label: "Transparent Pricing" },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2.5">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <span className="text-xs font-medium text-foreground/80 leading-tight">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-[var(--shadow-luxe)] animate-fade-in">
                            <img src={'/assets/land.JPG'} alt="Luxurious modern living room designed by Woodshine Interiors" width={1600} height={1200} className="w-full h-[520px] object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent/40 via-transparent to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5 rounded-2xl glass px-4 py-3 flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <img src={t1} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-white" />
                                    <img src={t2} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-white" />
                                    <img src={t3} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-white" />
                                </div>
                                <div className="text-xs">
                                    <div className="flex items-center gap-1 text-primary">
                                        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                                        <span className="ml-1 font-semibold text-foreground">4.9</span>
                                    </div>
                                    <div className="text-foreground/70">Trusted by 1,000+ homeowners</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 lg:mt-0 lg:absolute lg:-left-16 lg:top-8 lg:w-[360px] animate-float">
                            <HeroLeadForm compact />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---------- trust stats ---------- */

function TrustStats() {
    const stats = [
        { n: 100, s: "+", label: "Completed Projects" },
        { n: 100, s: "+", label: "Happy Customers" },
        { n: 10, s: "+ Yrs", label: "Experience" },
        { n: 100, s: "%", label: "Custom Designs" },
    ];
    return (
        <section className="border-y border-border bg-secondary/50">
            <div className="container-luxe py-16 md:py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                    {stats.map((s) => (
                        <div key={s.label} className="reveal text-center md:text-left">
                            <div className="font-display text-5xl md:text-6xl text-foreground">
                                <Counter to={s.n} suffix={s.s} />
                            </div>
                            <div className="mt-2 text-sm uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- why woodshine ---------- */

function WhyWoodshine() {
    const items = [
        { icon: ShieldCheck, title: "Premium Hardware", body: "Hettich, Blum and Häfele fittings engineered to last decades." },
        { icon: Ruler, title: "Custom Designs", body: "Every millimetre tailored to your home, taste and how you actually live." },
        { icon: Sparkles, title: "Modular Kitchens", body: "Space-efficient, ergonomic layouts crafted for real Indian cooking." },
        { icon: Wrench, title: "Pro Installation", body: "Trained, in-house teams — no third-party sub-contracting." },
        { icon: Award, title: "After-Sales Support", body: "Dedicated relationship manager and priority service, always." },
        { icon: IndianRupee, title: "Transparent Pricing", body: "Locked quotes, zero surprises. Every rupee accounted for." },
        { icon: Clock, title: "On-Time Delivery", body: "Committed timelines — or we compensate. That's our promise." },
    ];
    return (
        <Section id="why">
            <div className="container-luxe">
                <div className="max-w-3xl mb-16 reveal">
                    <Eyebrow>Why Woodshine</Eyebrow>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                        Uncompromising craft, <em className="italic text-primary font-normal">from concept to keys.</em>
                    </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {items.map(({ icon: Icon, title, body }, i) => (
                        <div key={title} className="reveal group rounded-3xl border border-border bg-card p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[var(--shadow-luxe)] hover:border-primary/20" style={{ transitionDelay: `${i * 40}ms` }}>
                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Icon className="h-5 w-5" />
                            </span>
                            <h3 className="mt-5 font-display text-xl">{title}</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ---------- packages ---------- */

function Packages() {
    const inclusions = ["Kitchen", "Wardrobes", "TV Unit", "Dining", "Living", "Bedrooms", "False Ceiling", "Prayer Unit"];
    const pkgs = [
        { name: "Basic", offer: "4,99,999", original: "5,10,899", desc: "Everything you need to move in beautifully.", tag: "" },
        { name: "Essential", offer: "6,55,299", original: "8,20,899", desc: "The perfect balance of design and value.", tag: "Most Chosen" },
        { name: "Premium", offer: "9,99,999", original: "12,99,999", desc: "Our most-loved package. Elevated finishes throughout.", tag: "" },
    ];
    // reorder so Premium is center on desktop
    const ordered = [pkgs[0], pkgs[1], pkgs[2]];
    return (
        <Section id="packages" className="bg-secondary/40">
            <div className="container-luxe">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 reveal">
                    <div>
                        <Eyebrow>Interior Packages</Eyebrow>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-2xl">
                            Three curated packages. <em className="italic text-primary font-normal">One clear price.</em>
                        </h2>
                    </div>
                    <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                        Transparent, all-inclusive pricing for complete home interiors. No hidden costs. No add-ons at the end.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {ordered.map((p) => {
                        const featured = p.tag === "Most Popular";
                        return (
                            <div key={p.name} className={`reveal relative rounded-[2rem] p-8 md:p-10 transition-all duration-500 ${featured ? "bg-accent text-accent-foreground shadow-[var(--shadow-luxe)] md:-translate-y-4" : "bg-card border border-border hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"}`}>
                                {featured && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary text-primary-foreground px-4 py-1 text-[11px] uppercase tracking-[0.2em]">
                                        {p.tag}
                                    </div>
                                )}
                                <div className={`text-xs uppercase tracking-[0.25em] ${featured ? "text-primary-soft" : "text-primary"}`}>{p.name} Package</div>
                                <div className="mt-4 flex items-baseline gap-3">
                                    <span className="font-display text-4xl md:text-5xl">₹{p.offer}</span>
                                </div>
                                <div className={`mt-1 text-sm line-through ${featured ? "text-white/50" : "text-muted-foreground"}`}>₹{p.original}</div>
                                <p className={`mt-4 text-sm ${featured ? "text-white/70" : "text-muted-foreground"}`}>{p.desc}</p>

                                <div className={`my-7 h-px ${featured ? "bg-white/10" : "bg-border"}`} />

                                <ul className="grid grid-cols-2 gap-2.5 text-sm">
                                    {inclusions.map((inc) => (
                                        <li key={inc} className="flex items-center gap-2">
                                            <Check className={`h-4 w-4 shrink-0 ${featured ? "text-primary-soft" : "text-success"}`} />
                                            <span className={featured ? "text-white/85" : "text-foreground/85"}>{inc}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a href="#contact" className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-medium transition-all ${featured ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-foreground text-background hover:bg-primary"}`}>
                                    Get Package Details <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
}

/* ---------- modular kitchens ---------- */

function Kitchens() {
    const types = ["Straight Kitchen", "L Shaped", "Parallel", "U Shaped", "Island", "Peninsula"];
    const features = [
        "Premium Hettich Hardware", "Soft-Close Systems", "Elica / Faber Chimney",
        "Custom Storage", "Factory Finish", "Premium Laminates", "Easy Maintenance",
    ];
    return (
        <Section id="kitchens">
            <div className="container-luxe">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-6 reveal">
                        <div className="relative rounded-[2rem] overflow-hidden shadow-[var(--shadow-luxe)] group">
                            <img src={"/assets/mod1.JPG"} alt="Premium modular kitchen with walnut cabinetry" loading="lazy" width={1408} height={1008} className="w-full h-[560px] object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent/50 via-transparent to-transparent" />
                            <img src={"/assets/mod2.JPG"} alt="" loading="lazy" width={1000} height={1000} className="absolute -bottom-8 -right-6 h-40 w-40 md:h-56 md:w-56 rounded-3xl object-cover border-8 border-background shadow-[var(--shadow-luxe)] hidden md:block" />
                        </div>
                    </div>

                    <div className="lg:col-span-6 reveal">
                        <Eyebrow>Modular Kitchens</Eyebrow>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                            Beautiful modular kitchens, <em className="italic text-primary font-normal">built around you.</em>
                        </h2>
                        <p className="mt-5 text-muted-foreground max-w-lg leading-relaxed">
                            Ergonomic layouts, premium finishes and industry-leading hardware — engineered to make everyday cooking effortless.
                        </p>

                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                            {types.map((t) => (
                                <div key={t} className="rounded-2xl border border-border bg-card px-4 py-3 text-sm hover:border-primary hover:text-primary transition-all cursor-default">
                                    {t}
                                </div>
                            ))}
                        </div>

                        <ul className="mt-8 grid sm:grid-cols-2 gap-2.5">
                            {features.map((f) => (
                                <li key={f} className="flex items-center gap-2 text-sm text-foreground/80">
                                    <Check className="h-4 w-4 text-success shrink-0" /> {f}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-9">
                            <Btn href="#contact">Book Kitchen Consultation</Btn>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}

/* ---------- process ---------- */

function Process() {
    const steps = [
        ["01", "Free Consultation", "Understand your needs, style and budget."],
        ["02", "Site Visit", "On-site measurement and technical survey."],
        ["03", "3D Design", "Photoreal walkthroughs of your future home."],
        ["04", "Quotation", "Transparent, itemised pricing — locked in."],
        ["05", "Manufacturing", "Factory-finished with premium materials."],
        ["06", "Installation", "45-day promise. Handed over, ready to live in."],
    ];
    return (
        <Section id="process" className="bg-secondary/40">
            <div className="container-luxe">
                <div className="max-w-3xl mb-14 reveal">
                    <Eyebrow>Our Process</Eyebrow>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                        A calm, considered path <em className="italic text-primary font-normal">to keys.</em>
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {steps.map(([n, t, d], i) => (
                        <div key={t} className="reveal group rounded-3xl bg-card p-8 border border-border hover:border-primary/30 hover:-translate-y-1 hover:shadow-[var(--shadow-soft)] transition-all duration-500" style={{ transitionDelay: `${i * 60}ms` }}>
                            <div className="flex items-baseline justify-between">
                                <span className="font-display text-5xl text-primary/20 group-hover:text-primary/60 transition-colors">{n}</span>
                                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="mt-5 font-display text-2xl">{t}</h3>
                            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ---------- gallery ---------- */

function Gallery() {
    const items = [
        { src: heroImg, tag: "Living Room", ratio: "aspect-[4/5]" },
        { src: kitchenImg, tag: "Modular Kitchen", ratio: "aspect-[4/3]" },
        { src: bedroomImg, tag: "Bedroom", ratio: "aspect-[3/4]" },
        { src: wardrobeImg, tag: "Wardrobe", ratio: "aspect-[4/3]" },
        { src: tvunitImg, tag: "TV Unit", ratio: "aspect-[3/2]" },
        { src: diningImg, tag: "Dining", ratio: "aspect-[3/4]" },
        { src: ceilingImg, tag: "False Ceiling", ratio: "aspect-[4/3]" },
        { src: kitchen2Img, tag: "Living Lounge", ratio: "aspect-square" },
    ];
    return (
        <Section id="projects">
            <div className="container-luxe">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 reveal">
                    <div>
                        <Eyebrow>Project Gallery</Eyebrow>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] max-w-2xl">
                            Homes we've had the privilege <em className="italic text-primary font-normal">to shape.</em>
                        </h2>
                    </div>
                    <Btn href="#contact" variant="outline">View More Projects</Btn>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
                    {items.map((it) => (
                        <figure key={it.tag} className="reveal mb-5 break-inside-avoid group relative overflow-hidden rounded-3xl">
                            <img src={it.src} alt={it.tag} loading="lazy" className={`w-full ${it.ratio} object-cover transition-transform duration-[1200ms] group-hover:scale-110`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-accent/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <span className="rounded-full glass px-3 py-1.5 text-xs font-medium">{it.tag}</span>
                                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ---------- comparison ---------- */

function Comparison() {
    const rows = [
        ["Design approach", "Custom, made for your home", "Generic, catalogue templates"],
        ["Hardware", "Hettich · Blum · Häfele", "Unbranded, short lifespan"],
        ["Installation", "In-house trained teams", "Third-party sub-contractors"],
        ["Pricing", "Locked, itemised, transparent", "Frequent add-ons and revisions"],
        ["Warranty", "Up to 10 years", "Rarely honoured"],
    ];
    return (
        <Section className="bg-secondary/40">
            <div className="container-luxe">
                <div className="max-w-3xl mb-12 reveal">
                    <Eyebrow>Why Choose Us</Eyebrow>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                        The Woodshine difference, <em className="italic text-primary font-normal">line by line.</em>
                    </h2>
                </div>
                <div className="reveal rounded-[2rem] bg-card border border-border overflow-hidden shadow-[var(--shadow-soft)]">
                    <div className="grid grid-cols-3 bg-accent text-accent-foreground text-sm">
                        <div className="px-6 md:px-8 py-5 uppercase tracking-[0.2em] text-xs opacity-70">Attribute</div>
                        <div className="px-6 md:px-8 py-5 flex items-center gap-2 font-display text-lg">
                            Woodshine
                        </div>
                        <div className="px-6 md:px-8 py-5 uppercase tracking-[0.2em] text-xs opacity-70">Competitors</div>
                    </div>
                    {rows.map(([attr, us, them], i) => (
                        <div key={attr} className={`grid grid-cols-3 text-sm ${i % 2 ? "bg-secondary/40" : ""}`}>
                            <div className="px-6 md:px-8 py-5 text-muted-foreground border-t border-border">{attr}</div>
                            <div className="px-6 md:px-8 py-5 border-t border-border flex items-center gap-2 text-foreground font-medium">
                                <Check className="h-4 w-4 text-success shrink-0" />{us}
                            </div>
                            <div className="px-6 md:px-8 py-5 border-t border-border text-muted-foreground flex items-center gap-2">
                                <X className="h-4 w-4 shrink-0 opacity-50" />{them}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ---------- testimonials ---------- */

function Testimonials() {
    const items = [
        { name: "Kiran Padmanabhan", loc: "", img: t1, quote: "There are amateurs, there are professionals, and there is Wood Shine. Terming them as just professionals would be an understatement. Wood Shine helped me build my studio. Their skillful technicians and their impeccable eye for details makes them stand out. Always open to suggestions and vocal in guiding us in the right direction, Wood Shine is the builder I would always recommend." },
        { name: "Abey Abraham", loc: "", img: t2, quote: "It was glad that I was connected with Wood Shine to get our interior design done... They are flexible and always comes up with great options that matches with the requirement and suite to the home's ambience. As a customer, i am always happy to recommend them." },
        { name: "Santha B M", loc: "Trivandrum", img: t3, quote: "I can confidently say that Woodshine Interiors & Builders are the best interior designers in Trivandrum. Their team is highly skilled and professional, and they go above and beyond to ensure that their clients are satisfied with the final result. I am thrilled with the outcome of my project and would recommend them to anyone looking for quality interior design services." },
        { name: "Aarcha Surendran", loc: "Trivandrum", img: t1, quote: "Woodshine Interiors & Builders truly are the best interior designers in Trivandrum. Their work is nothing short of exceptional, and they pay close attention to every detail. I am thrilled with the final result of my project and would highly recommend them to anyone looking for quality interior design services." },
        { name: "Dhanyasree V.S", loc: "Trivandrum", img: t2, quote: "I am Fully satisfied with our home interior work done by Woodshine Interiors & Builders at Trivandrum!! Woodshine team is professional, knowledgeable and qualitative. I am recommending their services to everyone because they provide desired interior experience throughout the entire work process. The interior design work was creatively completed and the final results were even better than my expectations." },
        { name: "LBG Preetha", loc: "Trivandrum", img: t3, quote: "I had the pleasure of working with Woodshine Interiors & Builders, and they truly are the best interior designers in Trivandrum. They were able to take my vision and turn it into a reality, and the final result exceeded my expectations. Their attention to detail is second to none, and their team is professional and easy to work with." },
        { name: "Walter Cuminns Holidays", loc: "", img: t1, quote: "The designers of Woodshine Interiors & Builders are talented and have done a wonderful job. The entire project duration was amazing for me. From discussion, design and implementation, all stages were conducted with sheer perfection. Highly recommended to everyone who wants to have the best interior designing services." },
        { name: "Pradeep A", loc: "", img: t2, quote: "We recently hired Woodshine for our home renovation project, and we are happier with the results. Their skilled team of professionals handled every aspect of the construction process flawlessly. From conceptualizing the interior layout to executing the final touches, they showed immense dedication and creativity. Thanks to Woodshine, our house now feels like a dream home." },
        { name: "yadhu krishnan", loc: "Trivandrum", img: t3, quote: "Well, we hired Woodshine Interiors & Builders for our home interior after a strong recommendation from one of my friends who also got his work done from Woodshine last year. I own a 3 bhk in Trivandrum. The decision to hire Woodshine was not a very difficult one since I was aware of the quality of their interior designing works & products. They made our experience quite delightful throughout the designing & execution phase. Completely satisfied with their work" },
        { name: "Ashish S", loc: "Trivandrum", img: t1, quote: "Recently hired Woodshine Interiors & Builders for an interior design project, and I must say, they are the best interior designers in Trivandrum. Their team is highly skilled, professional, and creative. They transformed my space into something truly amazing, and I couldn't be happier with the results." },
        { name: "Aravind Mahadevan", loc: "", img: t2, quote: "A home becomes a 'nice place to be in' when the interior becomes more beautiful than the exterior. For me, my first house was a dream come true and to convert it into a beautiful home, I was fortunate enough to have Wood Shine Interiors and Builders with me. The trust and confidence which they gave me at the very first meeting was enough for me to assign them the responsibility of building my home's interior very beautifully. The amazing creativity of the team and the overflowing ideas definitely helped me a lot to have my dream home far far better than I had dreamt of. The on time delivery and proper communication by the entire team of Wood shine turns our experience of interior designing a truly hassle free experience." },
        { name: "AlEeNa SaNtHoSh", loc: "Trivandrum", img: t3, quote: "I have contacted Woodshine team for my Apartment Interior and signed an agreement. On signing I was not sure as how they will do. Now after the Handover I can truly say that they are the best interior designers in Trivandrum. I can suggest people like me to surely check with them once before finalizing their Interior Designer" },
        { name: "VINYL RAJENDRAN", loc: "", img: t1, quote: "Thank you, woodshine for the excellent service. All the staffs are professional and well supportive. I would like to express my gratitude to Mr Aneesh and Mr Afzalsha . The one thing that really impressed me was their design team , they understood my concepts and designed it according to my needs. The team was very professional in their approach. I would highly recommend woodshine for any interior project with great confidence." },
        { name: "rakhi ashok", loc: "", img: t2, quote: "A huge thank you to Aneesh, Sree, and the entire Woodshine team for turning our dream into a stunning reality! Their patience, attention to detail, and willingness to accommodate our suggestions and changes were truly impressive. The final result exceeded our expectations - top-notch quality that has made our home truly beautiful. We highly recommend Woodshine to all homeowners looking to transform their spaces. Their exceptional service and craftsmanship will not disappoint!" },
        { name: "Balu chidambar", loc: "", img: t3, quote: "Approachable and professional team. Supportive and guides with best viable solution. The only guys who gave me design and asked 'can we do?' Right from first call, team was responsible and responsive. Work too was reasonable and ontime." },
        { name: "Vishnu Namboodiri", loc: "", img: t1, quote: "Strongly recommend for a customised superior work. Optimal space utilisation in particular is worth mentioning" },
        { name: "Dithi Prakash", loc: "", img: t2, quote: "Excellent team work.. they provide... very creative minds..." },
        { name: "Nadesan Subramania pillai", loc: "", img: t3, quote: "Quality work super designing ideas" }
    ];
    const loop = [...items, ...items];
    return (
        <Section id="testimonials">
            <div className="container-luxe mb-12">
                <div className="max-w-3xl reveal">
                    <Eyebrow>Client Stories</Eyebrow>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
                        Homes made, <em className="italic text-primary font-normal">friendships kept.</em>
                    </h2>
                </div>
            </div>

            <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
                <div className="flex gap-6 w-max" style={{ animation: "marquee 60s linear infinite" }}>
                    {loop.map((t, i) => (
                        <figure key={i} className="w-[360px] md:w-[420px] shrink-0 rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
                            <div className="flex items-center gap-1 text-primary mb-4">
                                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-4 w-4 fill-current" />)}
                            </div>
                            <blockquote className="font-display text-lg leading-snug text-foreground">"{t.quote}"</blockquote>
                            <figcaption className="mt-6 flex items-center gap-3">
                                <img src={t.img} alt="" className="h-11 w-11 rounded-full object-cover" />
                                <div>
                                    <div className="text-sm font-semibold">{t.name}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{t.loc}</div>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </Section>
    );
}

/* ---------- limited offer ---------- */

function LimitedOffer() {
    const time = [
        { n: "07", l: "Days" }, { n: "14", l: "Hours" }, { n: "32", l: "Minutes" }, { n: "48", l: "Seconds" },
    ];
    const benefits = ["Free Design Consultation", "Free Site Visit", "Special Package Pricing"];
    return (
        <Section className="bg-accent text-accent-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(600px circle at 20% 20%, oklch(0.48 0.09 55 / 0.35), transparent 60%), radial-gradient(500px circle at 80% 80%, oklch(0.42 0.08 145 / 0.2), transparent 60%)" }} />
            <div className="container-luxe relative">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 reveal">
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary-soft mb-5">
                            <span className="h-px w-8 bg-primary-soft/50" /> Limited Time
                        </div>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02]">
                            Save up to <span className="text-primary-soft">₹3 Lakhs</span> on complete interior packages.
                        </h2>
                        <p className="mt-5 text-white/70 max-w-lg leading-relaxed">
                            This season only — enjoy special package pricing plus complimentary design, site visit and 3D walkthrough.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {time.map((t) => (
                                <div key={t.l} className="glass-dark rounded-2xl px-5 py-4 min-w-[86px] text-center">
                                    <div className="font-display text-3xl md:text-4xl">{t.n}</div>
                                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/60 mt-1">{t.l}</div>
                                </div>
                            ))}
                        </div>

                        <ul className="mt-9 grid sm:grid-cols-2 gap-2.5">
                            {benefits.map((b) => (
                                <li key={b} className="flex items-center gap-2 text-sm text-white/85">
                                    <Check className="h-4 w-4 text-primary-soft" /> {b}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10">
                            <a href="#contact" className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-8 py-4 text-sm font-medium hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-15px_oklch(0.48_0.09_55/0.7)] transition-all">
                                Claim My Offer <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-5 reveal">
                        <div className="relative">
                            <img src={bedroomImg} alt="" loading="lazy" className="w-full rounded-[2rem] object-cover h-[520px] shadow-[var(--shadow-luxe)]" />
                            <div className="absolute -bottom-6 -left-6 glass-dark rounded-3xl p-6 max-w-[220px]">
                                <div className="text-xs uppercase tracking-[0.25em] text-primary-soft">Save</div>
                                <div className="font-display text-5xl mt-1">₹3L</div>
                                <div className="text-xs text-white/60 mt-2">on Premium Package</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}

/* ---------- FAQ ---------- */

function FAQ() {
    const items = [
        ["Warranty", "We offer up to 10 years warranty on modular units and lifetime on plywood carcass — all in writing."],
        ["Timeline", "Complete home interiors are handed over in 45 days from design sign-off. Kitchens alone typically finish in 25 days."],
        ["Customisation", "Every project is 100% custom. From cabinet depth to laminate to handle finish, everything is tailored to you."],
        // ["EMI Options", "Yes — flexible EMI plans starting at zero cost, up to 24 months, in partnership with major banks."],
        ["Materials", "We use BWR/BWP-grade plywood, premium laminates, Hettich/Blum hardware and factory-grade PU or acrylic finishes."],
        ["Installation", "In-house installation teams handle everything. We protect your floors, seal dust, and hand over site-cleaned."],
    ];
    const [open, setOpen] = useState<number | null>(0);
    return (
        <Section id="faq" className="bg-secondary/40">
            <div className="container-luxe">
                <div className="grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-4 reveal">
                        <Eyebrow>Frequently Asked</Eyebrow>
                        <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                            Everything you'd like <em className="italic text-primary font-normal">to know.</em>
                        </h2>
                        <p className="mt-5 text-muted-foreground text-sm leading-relaxed">
                            Can't find your answer? Our team is one call away.
                        </p>
                        <a href="tel:+919999999999" className="mt-6 inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                            <Phone className="h-4 w-4" /> +91 99999 99999
                        </a>
                    </div>
                    <div className="lg:col-span-8 space-y-3 reveal">
                        {items.map(([q, a], i) => {
                            const isOpen = open === i;
                            return (
                                <div key={q} className={`rounded-3xl border transition-all overflow-hidden ${isOpen ? "border-primary/40 bg-card shadow-[var(--shadow-soft)]" : "border-border bg-card"}`}>
                                    <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between text-left px-7 py-5">
                                        <span className="font-display text-lg md:text-xl">{q}</span>
                                        <ChevronDown className={`h-5 w-5 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    <div className={`grid transition-all duration-500 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                        <div className="overflow-hidden">
                                            <p className="px-7 pb-6 text-sm text-muted-foreground leading-relaxed">{a}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </Section>
    );
}

/* ---------- final lead ---------- */

function FinalLead() {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("3BHK");
    const [budget, setBudget] = useState("Under ₹5 L");
    const [message, setMessage] = useState("");

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await submitLead({
                data: {
                    name,
                    phone,
                    email,
                    location,
                    propertyType,
                    budget,
                    message,
                    source: "Contact Section Form",
                },
            });
            setSent(true);
        } catch (err: any) {
            console.error("Lead submission error:", err);
            setError(err?.message || "Failed to submit lead. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section id="contact" className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <img src={heroImg} alt="" className="w-full h-full object-cover opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
            </div>
            <div className="container-luxe">
                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-5 reveal lg:sticky lg:top-32">
                        <Eyebrow>Let's Talk</Eyebrow>
                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.02]">
                            Let's design your <em className="italic text-primary font-normal">dream home.</em>
                        </h2>
                        <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">
                            Share a few details and our senior design consultant will call you within 24 hours to schedule your complimentary consultation.
                        </p>

                        <div className="mt-10 space-y-4">
                            {[
                                { icon: Phone, label: "+91 808 607 6666", sub: "Mon-Sat : 9.30 AM - 6.00 PM" },
                                { icon: Mail, label: "woodshineinteriors@gmail.com", sub: "For enquiries and support" },
                                { icon: MapPin, label: "Trivandrum", sub: "Serving across South India" },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <div className="text-sm font-semibold">{label}</div>
                                        <div className="text-xs text-muted-foreground">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-7 reveal">
                        <div className="rounded-[2rem] bg-card border border-border shadow-[var(--shadow-luxe)] p-8 md:p-12">
                            {sent ? (
                                <div className="text-center py-10">
                                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10 text-success mb-6">
                                        <Check className="h-8 w-8" />
                                    </div>
                                    <h3 className="font-display text-3xl mb-3">We've received your request.</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">A design consultant will reach out within 24 hours to schedule your complimentary consultation.</p>
                                </div>
                            ) : (
                                <form onSubmit={onSubmit} className="space-y-5">
                                    {error && (
                                        <div className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <Field label="Full name"><input required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" /></Field>
                                        <Field label="Phone"><input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input" placeholder="+91" /></Field>
                                        <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" /></Field>
                                        <Field label="Project location"><input required value={location} onChange={(e) => setLocation(e.target.value)} className="input" placeholder="City, area" /></Field>
                                        <Field label="Property type">
                                            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input">
                                                <option>1BHK</option><option>2BHK</option><option>3BHK</option><option>4BHK</option><option>Villa</option>
                                            </select>
                                        </Field>
                                        <Field label="Approximate budget">
                                            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="input">
                                                <option>Under ₹5 L</option>
                                                <option>₹5 L – ₹8 L</option>
                                                <option>₹8 L – ₹12 L</option>
                                                <option>₹12 L – ₹20 L</option>
                                                <option>₹20 L +</option>
                                            </select>
                                        </Field>
                                    </div>
                                    <Field label="Tell us about your project">
                                        <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="input resize-none" placeholder="Rooms to design, timeline, style preferences…" />
                                    </Field>
                                    <button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-primary-foreground py-4 text-sm font-medium tracking-wide hover:shadow-[0_25px_60px_-15px_oklch(0.48_0.09_55/0.7)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : "Book My Free Consultation"}
                                    </button>
                                    <p className="text-[11px] text-muted-foreground text-center">
                                        By submitting, you agree to be contacted by Woodshine Interiors. We respect your privacy.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <label className="block">
            <span className="block text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</span>
            {children}
        </label>
    );
}

/* ---------- footer ---------- */

function Footer() {
    return (
        <footer className="bg-accent text-accent-foreground pt-20 pb-10">
            <div className="container-luxe">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                    <div>
                        <a href="#home" className="inline-block mb-5 bg-white p-3 rounded-2xl">
                            <img className="w-44" src={logo} alt="Woodshine Interiors Logo" />
                        </a>
                        <p className="text-sm text-white/60 leading-relaxed max-w-xs">
                            Designed for Living. Crafted for Life. Premium home interiors with transparent pricing and factory-finished quality.
                        </p>
                        <div className="mt-6 flex gap-2">
                            {[
                                { icon: Facebook, href: "https://www.facebook.com/WoodShineInteriors/", label: "Facebook" },
                                { icon: Instagram, href: "https://www.instagram.com/woodshinetvm/", label: "Instagram" },
                                { icon: Youtube, href: "https://www.youtube.com/@WoodshineInteriorsBuilders", label: "YouTube" },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="grid h-10 w-10 place-items-center rounded-full glass-dark hover:bg-primary hover:border-primary transition-all"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <FooterCol title="Quick Links" links={["Home", "Packages", "Kitchens", "Projects", "Testimonials", "FAQs"]} />
                    <FooterCol title="Services" links={["Complete Home Interiors", "Modular Kitchens", "Wardrobes", "TV Units", "False Ceilings", "Custom Furniture"]} />

                    <div>
                        <div className="text-sm uppercase tracking-[0.25em] text-primary-soft mb-5">Visit Us</div>
                        <div className="rounded-2xl overflow-hidden glass-dark aspect-[4/3] relative">
                            <div className="absolute inset-0 grid place-items-center text-center p-6">
                                <div>
                                    <MapPin className="h-6 w-6 mx-auto text-primary-soft" />
                                    <div className="mt-3 text-sm font-medium">Woodshine Studio</div>
                                    <div className="text-xs text-white/60 mt-1">TC 29/2425/3 HOUSE NO GNRA-12, NEAR, Cotton Hill Rd, Vazhuthacaud, Thiruvananthapuram, Kerala 695014</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
                    <div>© {new Date().getFullYear()} Woodshine Interiors. All rights reserved.</div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
    return (
        <div>
            <div className="text-sm uppercase tracking-[0.25em] text-primary-soft mb-5">{title}</div>
            <ul className="space-y-3">
                {links.map((l) => (
                    <li key={l}><a href="#" className="text-sm text-white/70 hover:text-white transition-colors">{l}</a></li>
                ))}
            </ul>
        </div>
    );
}

/* ---------- floating & exit intent ---------- */

function FloatingActions() {
    return (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
            <a href="https://wa.me/918086076666" className="grid h-12 w-12 place-items-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-luxe)] hover:scale-110 transition-transform" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
            </a>
            <a href="tel:+918086076666" className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-luxe)] hover:scale-110 transition-transform" aria-label="Call">
                <Phone className="h-5 w-5" />
            </a>
            <a href="#contact" className="hidden md:inline-flex items-center gap-2 rounded-full bg-accent text-accent-foreground px-5 py-3 text-xs font-medium shadow-[var(--shadow-luxe)] hover:-translate-y-0.5 transition-all">
                <Sparkles className="h-3.5 w-3.5" /> Book Consultation
            </a>
        </div>
    );
}

function ExitIntent() {
    const [show, setShow] = useState(false);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const shown = useRef(false);

    useEffect(() => {
        const on = (e: MouseEvent) => {
            if (shown.current) return;
            if (e.clientY < 8) { shown.current = true; setShow(true); }
        };
        const t = setTimeout(() => document.addEventListener("mouseout", on), 5000);
        return () => { clearTimeout(t); document.removeEventListener("mouseout", on); };
    }, []);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitLead({
                data: {
                    phone,
                    source: "Exit Intent Modal (Free 3D Walkthrough)",
                },
            });
            setSent(true);
            setTimeout(() => setShow(false), 2500);
        } catch (err) {
            console.error("Failed to submit exit lead:", err);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-accent/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="relative w-full max-w-md rounded-[2rem] bg-card p-8 md:p-10 shadow-[var(--shadow-luxe)]">
                <button onClick={() => setShow(false)} className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full hover:bg-secondary" aria-label="Close">
                    <X className="h-4 w-4" />
                </button>
                {sent ? (
                    <div className="text-center py-6">
                        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success mb-3">
                            <Check className="h-6 w-6" />
                        </div>
                        <h4 className="font-display text-xl mb-1">Claimed Successfully!</h4>
                        <p className="text-xs text-muted-foreground">We'll reach out to you shortly for your free 3D design.</p>
                    </div>
                ) : (
                    <>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-4">
                            <Sparkles className="h-3.5 w-3.5" /> Wait — one moment
                        </div>
                        <h3 className="font-display text-3xl leading-tight">Before you go, unlock a <em className="italic text-primary">free 3D design</em>.</h3>
                        <p className="mt-3 text-sm text-muted-foreground">Leave your phone number and we'll gift you a complimentary 3D walkthrough of one room — no strings attached.</p>
                        <form onSubmit={onSubmit} className="mt-6 flex gap-2">
                            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="input flex-1" />
                            <button type="submit" disabled={loading} className="rounded-full bg-primary text-primary-foreground px-5 text-sm font-medium hover:-translate-y-0.5 transition-transform flex items-center gap-1.5 disabled:opacity-70">
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Claim"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

/* ---------- page ---------- */

function Landing() {
    useReveal();
    return (
        <div className="min-h-screen bg-background text-foreground">
            <style>{`
        .input {
          width: 100%;
          border-radius: 9999px;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.85rem 1.25rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        textarea.input { border-radius: 1.25rem; }
        .input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 4px oklch(0.48 0.09 55 / 0.08); }
      `}</style>
            <Navbar />
            <main>
                <Hero />
                <TrustStats />
                <WhyWoodshine />
                <Packages />
                <Kitchens />
                <Process />
                <Gallery />
                {/* <Comparison /> */}
                <Testimonials />
                <LimitedOffer />
                <FAQ />
                <FinalLead />
            </main>
            <Footer />
            <FloatingActions />
            <ExitIntent />
        </div>
    );
}
