import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Heart, Shield, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Verified Students',
      description: 'Every student is verified with documentation before creating a campaign.',
    },
    {
      icon: TrendingUp,
      title: 'Full Transparency',
      description: 'See exactly how funds are used with receipts and milestone tracking.',
    },
    {
      icon: Heart,
      title: 'Direct Impact',
      description: 'Your donation goes directly to the student—no middlemen, no mystery.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Discover',
      description: 'Browse verified student profiles and read their inspiring stories.',
    },
    {
      number: '2',
      title: 'Donate',
      description: 'Support students directly with one-time or recurring donations.',
    },
    {
      number: '3',
      title: 'Track',
      description: 'Follow their journey with updates, receipts, and milestones.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 sm:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="secondary" className="mb-4 bg-secondary/10 text-secondary-foreground">
                <Heart className="mr-1 h-3 w-3" />
                Direct Impact Philanthropy
              </Badge>
              <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                Fund Students,
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent">
                  Change Lives
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                Connect directly with verified students seeking educational funding. Every dollar tracked,
                every receipt shared, every milestone celebrated.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" onClick={() => navigate('/discover')} className="group">
                  Discover Students
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
                  Start a Campaign
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary/20 blur-3xl" />
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group h-full border-border/50 transition-all hover:border-primary/50 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border/40 bg-muted/30 py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to make a direct impact
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-light text-2xl font-bold text-primary-foreground shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-transparent md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">$2.4M+</div>
                <div className="text-muted-foreground">Funds Raised</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">5,000+</div>
                <div className="text-muted-foreground">Students Helped</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary">12,000+</div>
                <div className="text-muted-foreground">Generous Donors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary via-primary-light to-accent py-20 text-white">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Ready to Make a Difference?
            </h2>
            <p className="mb-8 text-xl text-white/90">
              Join thousands of donors and students building a brighter future together.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/discover')}
                className="bg-white text-primary hover:bg-white/90"
              >
                Browse Students
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/register')}
                className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Create Campaign
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
