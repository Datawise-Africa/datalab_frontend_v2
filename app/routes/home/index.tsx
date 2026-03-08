import { Link } from 'react-router';
import {
  ArrowRight,
  BarChart3,
  Brain,
  Globe,
  Layers,
  Lightbulb,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { generateSEOTags } from '~/lib/utils/seo';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';

export function meta() {
  return generateSEOTags({
    title: 'Datawise Africa - Transforming Data Into Clear Results',
    description:
      "Build bold digital products, de-risk transformation, and scale your data program with Datawise Africa. Intelligent solutions for the continent's digital future.",
    url: '/',
    keywords:
      'data analytics, digital transformation, AI, Africa, product management, inventory',
  });
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const stats = [
  { value: '99%', label: 'Client Satisfaction' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '12', label: 'African Countries' },
  { value: '50+', label: 'Enterprise Partners' },
];

const services = [
  {
    icon: Brain,
    title: 'Data & AI',
    description:
      'Turn raw data into actionable insights with machine learning pipelines, predictive analytics, and intelligent automation.',
  },
  {
    icon: Lightbulb,
    title: 'Product Innovation',
    description:
      'From ideation to launch — we help you build digital products that solve real problems and scale across markets.',
  },
  {
    icon: Layers,
    title: 'Digital Transformation',
    description:
      'Modernize legacy systems, adopt cloud-native architectures, and streamline operations for the digital age.',
  },
  {
    icon: Shield,
    title: 'Technology Consulting',
    description:
      'Strategic guidance on technology decisions, architecture reviews, and digital roadmaps tailored to your business.',
  },
  {
    icon: TrendingUp,
    title: 'App Modernization',
    description:
      'Re-platform, re-architect, or rebuild your applications for better performance, scalability, and maintainability.',
  },
  {
    icon: Sparkles,
    title: 'AI-Enabled Engineering',
    description:
      'Embed intelligence into your software with AI-powered features, copilots, and automated decision systems.',
  },
];

const industries = [
  { name: 'Fintech & Banking', icon: BarChart3 },
  { name: 'Healthcare', icon: Shield },
  { name: 'Agriculture', icon: Globe },
  { name: 'E-Commerce', icon: Layers },
  { name: 'Logistics', icon: TrendingUp },
  { name: 'Education', icon: Users },
];

const testimonials = [
  {
    quote:
      'Datawise transformed our supply chain visibility. We now make decisions in hours, not weeks.',
    author: 'Sarah Okonkwo',
    role: 'COO, AgriConnect',
  },
  {
    quote:
      'Their team integrated seamlessly with ours. The product they delivered exceeded every benchmark.',
    author: 'James Mwangi',
    role: 'CTO, PayFlow Africa',
  },
  {
    quote:
      'The AI models they built for us reduced fraud detection time by 87%. Truly exceptional work.',
    author: 'Amina Diallo',
    role: 'VP Engineering, SecureBank',
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* ===================== HERO ===================== */}
      <section className="relative min-h-[90vh] flex items-center bg-gray-950 text-gray-50 overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary opacity-10 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-chart-2 opacity-10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-chart-1 opacity-5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-900/50 text-gray-300 text-sm mb-8"
            >
              <Zap className="w-4 h-4 text-primary" />
              Powering Africa&apos;s Digital Transformation
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              Transforming
              <br />
              <span className="text-primary">big ideas</span> into
              <br />
              clear results
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed"
            >
              Build bold new products, de-risk digital transformation, and scale
              your data & AI program with Africa&apos;s leading technology
              partner.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" className="text-base px-8 py-6" asChild>
                <Link to="/products">
                  Explore Platform
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 bg-transparent border-gray-500 text-white hover:bg-gray-800"
                asChild
              >
                <Link to="/categories">Browse Solutions</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== TRUST BAR ===================== */}
      <section className="border-b border-border bg-background">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0}
            className="max-w-2xl mb-16"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              What we do
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Services built for scale
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              End-to-end capabilities that help you innovate faster, operate
              smarter, and grow sustainably.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={staggerItem}>
                <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {service.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== INDUSTRIES ===================== */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-sm font-semibold text-chart-2 uppercase tracking-wider mb-3">
              Industries
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Deep domain expertise
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We bring sector-specific knowledge to every engagement, ensuring
              solutions that fit your industry&apos;s unique challenges.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {industries.map((industry) => (
              <motion.div
                key={industry.name}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="group flex flex-col items-center gap-4 p-6 rounded-xl border border-border bg-background hover:border-chart-2/40 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-chart-2/10 flex items-center justify-center group-hover:bg-chart-2/20 transition-colors">
                  <industry.icon className="w-6 h-6 text-chart-2" />
                </div>
                <span className="text-sm font-semibold text-center">
                  {industry.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== WHY US ===================== */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              custom={0}
            >
              <p className="text-sm font-semibold text-chart-1 uppercase tracking-wider mb-3">
                Why Datawise
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Your competitive
                <br />
                advantage
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                We combine deep technical expertise with an intimate
                understanding of African markets to deliver solutions that
                actually work in the real world.
              </p>
              <Button size="lg" className="px-8" asChild>
                <Link to="/products">
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-4"
            >
              {[
                {
                  title: 'Africa-first approach',
                  desc: 'Solutions designed for the unique infrastructure, connectivity, and market dynamics of the continent.',
                },
                {
                  title: 'Full-stack delivery',
                  desc: 'From strategy through design, engineering, and operations — one partner for the entire journey.',
                },
                {
                  title: 'AI at the core',
                  desc: 'Every solution we build is enhanced with intelligent automation, analytics, and machine learning.',
                },
                {
                  title: 'Proven at scale',
                  desc: '500+ projects delivered across 12 countries with a 99% client satisfaction rate.',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={staggerItem}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 p-5 rounded-xl border border-border hover:border-chart-1/30 hover:bg-chart-1/5 transition-all duration-300"
                >
                  <CheckCircle className="w-6 h-6 text-chart-1 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================== TESTIMONIALS ===================== */}
      <section className="py-24 bg-gray-950 text-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Trusted by leaders
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((item) => (
              <motion.div
                key={item.author}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-colors"
              >
                <p className="text-gray-300 leading-relaxed mb-8 text-lg">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-gray-100">{item.author}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary opacity-5 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-chart-2 opacity-5 blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            custom={0}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Ready to build
              <br />
              something <span className="text-primary">bold</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Let&apos;s talk about how Datawise can help you turn your vision
              into a high-performing digital product.
            </p>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button size="lg" className="text-base px-10 py-6" asChild>
                <Link to="/products">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-10 py-6"
                asChild
              >
                <Link to="/categories">Explore Solutions</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
