/**
 * How It Works Section
 *
 * 3-step process explanation.
 * Copy from LANDING_PAGE_PLAN.md lines 175-210
 */

export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Select & Create',
      description:
        'Choose your category (hiring, dating, or founder matching) and create your basic profile.',
      icon: '🎯',
    },
    {
      number: 2,
      title: 'Share Your Profile',
      description:
        'Copy our personality prompt → Paste into ChatGPT → Get your authentic profile → Share the link with us. You control what we see.',
      icon: '📤',
    },
    {
      number: 3,
      title: 'Get Matched & Connect',
      description:
        "We analyze compatibility between you and others in your category. When there's strong compatibility + mutual interest, we connect you.",
      icon: '🤝',
    },
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-2xl font-semibold mb-3">
                {step.number}. {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
